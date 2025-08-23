import Stripe from 'stripe';
import { stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

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
      console.log(`Checkout session completed: ${session.id}`);
      
      try {
        // Get plan info from session metadata
        const planId = session.metadata?.plan_id;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const customerName = session.customer_details?.name;
        
        if (planId && customerEmail) {
          // Create Discord channel for customer
          const channelUrl = await discordAPI.createCustomerChannel({
            planType: planId as 'simple' | 'medium' | 'premium' | 'premium-plus',
            customerEmail,
            orderId: session.id,
            customerName: customerName || undefined,
          });
          
          if (channelUrl) {
            console.log(`Discord channel created for ${customerEmail}: ${channelUrl}`);
            
            // Send notification to you about new customer
            await discordAPI.sendNotification(
              `🎉 **New Customer!** \n**Plan:** ${planId.toUpperCase()}\n**Email:** ${customerEmail}\n**Channel:** <${channelUrl}>\n**Amount:** €${session.amount_total ? session.amount_total / 100 : 'N/A'}`
            );
          }
        } else {
          console.error('Missing plan_id or customer_email in session metadata');
        }
      } catch (error: unknown) {
        console.error('Error processing checkout session:', error);
        // Don't throw error to avoid webhook retry loops
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
