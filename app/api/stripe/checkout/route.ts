import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, PlanId } from '@/lib/payments/stripe';

export async function POST(request: NextRequest) {
  try {
    const { planId, customerEmail, hasBooking } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession(planId as PlanId, customerEmail, hasBooking);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    );
  }
}
