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
  } catch (error: unknown) {
    console.error('Error creating checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: errorMessage },
      { status: 500 }
    );
  }
}
