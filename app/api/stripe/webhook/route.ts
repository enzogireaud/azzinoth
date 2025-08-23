import Stripe from 'stripe';
import { stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';
import { channelStore } from '@/lib/discord/channel-store';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  console.log('🚀 Stripe webhook endpoint hit!');
  console.log('Headers:', Object.fromEntries(request.headers.entries()));
  
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;
  
  console.log('📦 Payload received:', payload ? 'YES' : 'NO');
  console.log('✍️ Signature received:', signature ? 'YES' : 'NO');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Payment for ${paymentIntent.amount} was successful!`);
      // Here you could send emails, update databases, etc.
      break;
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`🎯 Checkout session completed: ${session.id}`);
      console.log('Session details:', {
        id: session.id,
        planId: session.metadata?.plan_id,
        customerEmail: session.customer_details?.email || session.customer_email,
        customerName: session.customer_details?.name,
        amount: session.amount_total
      });
      
      try {
        // Get plan info from session metadata
        const planId = session.metadata?.plan_id;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name;
        
        console.log(`🔍 Processing payment: planId=${planId}, email=${customerEmail}`);
        
        if (planId && customerEmail) {
          console.log('✅ Plan and email found, creating Discord channel...');
          
          // Create Discord channel for customer
          const channelUrl = await discordAPI.createCustomerChannel({
            planType: planId as 'simple' | 'medium' | 'premium' | 'premium-plus',
            customerEmail,
            orderId: session.id,
            customerName: customerName || undefined,
          });
          
          if (channelUrl) {
            console.log(`✅ Discord channel created for ${customerEmail}: ${channelUrl}`);
            
            // Store channel info for the success page to retrieve
            channelStore.storeChannel(session.id, {
              channelUrl,
              planType: planId,
              customerEmail,
              createdAt: Date.now()
            });
            console.log(`✅ Channel info stored for session: ${session.id}`);
            
            // Send notification to you about new customer
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
        console.error('❌ Error processing checkout session:', error);
        if (error instanceof Error) {
          console.error('Error details:', error.message);
          console.error('Error stack:', error.stack);
        }
        // Don't throw error to avoid webhook retry loops
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
