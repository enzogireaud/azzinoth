import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define coaching plans
export const COACHING_PLANS = {
  simple: {
    id: 'simple',
    name: 'Simple Plan',
    price: 1500, // 15€ in cents
    description: 'One game review with detailed feedback'
  },
  medium: {
    id: 'medium', 
    name: 'Medium Plan',
    price: 2500, // 25€ in cents
    description: 'OP.GG review + two game reviews + champion pool advice'
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan', 
    price: 4000, // 40€ in cents
    description: '1 hour Discord coaching session'
  },
  'premium-plus': {
    id: 'premium-plus',
    name: 'Premium+ Plan',
    price: 6000, // 60€ in cents  
    description: '1.5 hour Discord coaching session + live game review'
  }
} as const;

export type PlanId = keyof typeof COACHING_PLANS;

export async function createCheckoutSession(planId: PlanId, customerEmail?: string, hasBooking?: boolean) {
  const plan = COACHING_PLANS[planId];
  
  if (!plan) {
    throw new Error('Invalid plan selected');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Ensure the baseUrl is properly formatted
  const normalizedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: plan.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment', // One-time payment instead of subscription
    success_url: `${normalizedBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}&plan=${planId}`,
    cancel_url: normalizedBaseUrl,
    customer_email: customerEmail,
    metadata: {
      plan_id: planId,
      plan_name: plan.name,
      has_booking: hasBooking ? 'true' : 'false'
    }
  });

  return session;
}