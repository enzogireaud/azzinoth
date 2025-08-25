import Stripe from 'stripe';
import { stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';
import { channelStore } from '@/lib/discord/channel-store';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 === STRIPE WEBHOOK RECEIVED ===');
    console.log('🚀 Headers:', Object.fromEntries(request.headers.entries()));
    
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
    
    console.log('📦 Payload received:', payload ? 'YES' : 'NO');
    console.log('✍️ Signature received:', signature ? 'YES' : 'NO');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
      console.log('✅ Webhook signature verified successfully');
  } catch (err) {
      console.error('❌ Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

    console.log('📋 Event type:', event.type);
    console.log('📋 Event ID:', event.id);

    // Process the webhook event
  switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment for ${paymentIntent.amount} was successful!`);
        // Here you could send emails, update databases, etc.
        break;
      
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`🎯 === CHECKOUT SESSION COMPLETED ===`);
        console.log(`🎯 Session ID: ${session.id}`);
        console.log('🎯 Full session object:', JSON.stringify(session, null, 2));
        console.log('🎯 Session details:', {
          id: session.id,
          planId: session.metadata?.plan_id,
          customerEmail: session.customer_details?.email || session.customer_email,
          customerName: session.customer_details?.name,
          amount: session.amount_total,
          metadata: session.metadata
        });
        
        try {
          // Get plan info from session metadata
          const planId = session.metadata?.plan_id;
          const customerEmail = session.customer_details?.email || session.customer_email;
          const customerName = session.customer_details?.name;
          
          console.log(`🔍 Processing payment: planId=${planId}, email=${customerEmail}`);
          console.log(`🔍 Metadata available:`, session.metadata);
          
          if (planId && customerEmail) {
            console.log('✅ Plan and email found, creating Discord channel...');
            
            // Create Discord channel for customer
            console.log('🏗️ About to call discordAPI.createCustomerChannel with data:', {
              planType: planId,
              customerEmail,
              orderId: session.id,
              customerName: customerName || undefined,
            });
            
            const channelUrl = await discordAPI.createCustomerChannel({
              planType: planId as 'simple' | 'medium' | 'premium' | 'premium-plus',
              customerEmail,
              orderId: session.id,
              customerName: customerName || undefined,
            });
            
            console.log('🏗️ discordAPI.createCustomerChannel returned:', channelUrl);
            
            if (channelUrl) {
              console.log(`✅ Discord channel created for ${customerEmail}: ${channelUrl}`);
              
                          // Store channel info for the success page to retrieve
            console.log('💾 === ABOUT TO STORE CHANNEL INFO ===');
            console.log('💾 Session ID:', session.id);
            console.log('💾 Channel URL:', channelUrl);
            console.log('💾 Plan type:', planId);
            console.log('💾 channelStore instance:', channelStore);
            console.log('💾 channelStore constructor name:', channelStore.constructor.name);
            
            channelStore.storeChannel(session.id, {
              channelUrl,
              planType: planId,
              customerEmail,
              createdAt: Date.now()
            });
            console.log(`✅ Channel info stored for session: ${session.id}`);
            
            // Verify storage worked immediately
            console.log('🔍 === IMMEDIATE VERIFICATION ===');
            const storedInfo = channelStore.getChannel(session.id);
            console.log('🔍 Immediate verification - stored info retrieved:', storedInfo);
            console.log('🔍 channelStore instance during verification:', channelStore);
            console.log('💾 === STORAGE VERIFICATION COMPLETED ===');
              
              // Send notification to you about new customer
              console.log('📢 About to send admin notification...');
              await discordAPI.sendNotification(
                `🎉 **New Customer!** \n**Plan:** ${planId.toUpperCase()}\n**Email:** ${customerEmail}\n**Channel:** <${channelUrl}>\n**Amount:** €${session.amount_total ? session.amount_total / 100 : 'N/A'}`
              );
              console.log('✅ Admin notification sent');
            } else {
              console.error('❌ Discord channel creation failed - no URL returned');
            }
          } else {
            console.error('❌ Missing plan_id or customer_email in session metadata');
            console.error('Available metadata:', session.metadata);
          }
        } catch (error: unknown) {
          console.error('❌ === ERROR PROCESSING CHECKOUT SESSION ===');
          console.error('❌ Error:', error);
          if (error instanceof Error) {
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
          }
          console.error('❌ Session ID that failed:', session.id);
          // Don't throw error to avoid webhook retry loops
        }
        console.log('🎯 === CHECKOUT SESSION PROCESSING COMPLETED ===');
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });

  } catch (error) {
    console.error('❌ === WEBHOOK REQUEST PROCESSING FAILED ===');
    console.error('❌ Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}