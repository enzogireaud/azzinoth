import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import { discordAPI } from '@/lib/discord/api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session');
  
  console.log('🎯 === ON-DEMAND CHANNEL CREATION ===');
  console.log(`🎯 Session ID: ${sessionId}`);
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  try {
    // Get payment details from Stripe
    console.log('💳 Fetching Stripe session details...');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session || session.payment_status !== 'paid') {
      console.log('❌ Session not found or not paid');
      return NextResponse.json(
        { error: 'Invalid or unpaid session' },
        { status: 404 }
      );
    }

    // Extract customer details
    const customerEmail = session.customer_details?.email || session.customer_email;
    const customerName = session.customer_details?.name;
    const planId = session.metadata?.plan_id || 'simple';
    
    console.log('👤 Customer details:');
    console.log(`   Email: ${customerEmail}`);
    console.log(`   Name: ${customerName}`);
    console.log(`   Plan: ${planId}`);
    console.log(`   Amount: €${session.amount_total ? session.amount_total / 100 : 'N/A'}`);

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email not found in session' },
        { status: 400 }
      );
    }

    // Create Discord channel
    console.log('🏗️ Creating Discord channel...');
    const channelUrl = await discordAPI.createCustomerChannel({
      planType: planId,
      customerEmail,
      orderId: sessionId,
      customerName: customerName || undefined,
    });
    
    if (!channelUrl) {
      console.error('❌ Failed to create Discord channel');
      return NextResponse.json(
        { error: 'Failed to create Discord channel' },
        { status: 500 }
      );
    }

    console.log(`✅ Discord channel created: ${channelUrl}`);
    
    // Send admin notification
    console.log('📢 Sending admin notification...');
    try {
      await discordAPI.sendNotification(
        `🎉 **New Customer!** \n**Plan:** ${planId.toUpperCase()}\n**Email:** ${customerEmail}\n**Channel:** <${channelUrl}>\n**Amount:** €${session.amount_total ? session.amount_total / 100 : 'N/A'}`
      );
      console.log('✅ Admin notification sent');
    } catch (notifError) {
      console.error('⚠️ Admin notification failed:', notifError);
      // Don't fail the whole request for notification errors
    }

    console.log('🎯 === ON-DEMAND CREATION COMPLETED ===');
    
    return NextResponse.json({
      success: true,
      channelUrl,
      planType: planId,
      customerEmail,
      sessionId
    });

  } catch (error) {
    console.error('❌ On-demand channel creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create channel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
