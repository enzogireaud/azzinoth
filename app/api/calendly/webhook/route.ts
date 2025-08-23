import { NextRequest, NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Calendly sends different event types
    const eventType = payload.event;
    
    if (eventType === 'invitee.created') {
      const { event: appointmentEvent, invitee } = payload.payload;
      
      // Extract booking details
      const customerEmail = invitee.email;
      const customerName = invitee.name;
      const sessionTime = appointmentEvent.start_time;
      const sessionDuration = appointmentEvent.name; // "1h" or "1.5h"
      
      // Find the customer's existing Discord channel
      // This would require storing channel IDs when we create them
      // For now, we'll send a general notification
      
      const message = `🗓️ **New Calendly Booking!**
**Customer:** ${customerName} (${customerEmail})
**Session:** ${sessionDuration}
**Time:** ${new Date(sessionTime).toLocaleString()}

Please send Discord server invite to their private channel!`;
      
      await discordAPI.sendNotification(message);
      
      console.log('Calendly booking notification sent:', customerEmail);
    }
    
    return NextResponse.json({ received: true });
    
  } catch (error) {
    console.error('Calendly webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
