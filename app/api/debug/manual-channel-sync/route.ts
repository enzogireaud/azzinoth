import { NextResponse } from 'next/server';
import { channelStore } from '@/lib/discord/channel-store';

export async function POST(request: Request) {
  console.log('🔧 === MANUAL CHANNEL SYNC DEBUG ===');
  
  try {
    const { sessionId, channelUrl, planType, customerEmail } = await request.json();
    
    console.log('🔧 Manual sync request:', { sessionId, channelUrl, planType, customerEmail });
    
    if (!sessionId || !channelUrl || !planType || !customerEmail) {
      return NextResponse.json({ 
        error: 'Missing required fields: sessionId, channelUrl, planType, customerEmail' 
      });
    }

    // Force store the channel info
    channelStore.storeChannel(sessionId, {
      channelUrl,
      planType,
      customerEmail,
      createdAt: Date.now()
    });
    
    // Verify it was stored
    const verified = channelStore.getChannel(sessionId);
    
    console.log('✅ Manual sync completed. Verification:', verified);
    
    return NextResponse.json({
      success: true,
      message: 'Channel manually synced',
      stored: verified
    });
    
  } catch (error) {
    console.error('❌ Manual sync failed:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
