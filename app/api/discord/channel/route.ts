import { NextRequest, NextResponse } from 'next/server';
import { productionChannelStorage } from '@/lib/discord/channel-storage-db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session');
  
  console.log('🔍 === PRODUCTION CHANNEL LOOKUP API ===');
  console.log('🔍 Raw URL:', request.url);
  console.log(`🔍 Checking for Discord channel with session ID: ${sessionId}`);
  
  if (!sessionId) {
    console.log('❌ No session ID provided');
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  const channelInfo = await productionChannelStorage.getChannel(sessionId);
  console.log(`🔍 Production storage lookup result:`, channelInfo ? 'FOUND' : 'NOT FOUND');
  
  if (channelInfo) {
    console.log(`✅ Channel info found:`, {
      channelUrl: channelInfo.channelUrl,
      planType: channelInfo.planType,
      createdAt: new Date(channelInfo.createdAt)
    });
  }
  
  // Debug: List all stored channels
  const allChannels = await productionChannelStorage.listChannels();
  console.log(`📋 All stored channels (${allChannels.length}):`, 
    allChannels.map(([id, info]) => ({ id, planType: info.planType, email: info.customerEmail }))
  );
  
  if (!channelInfo) {
    return NextResponse.json({
      found: false,
      message: 'Discord channel is being created...',
      debug: {
        searchingFor: sessionId,
        totalStored: allChannels.length,
        storedSessions: allChannels.map(([id]) => id)
      }
    });
  }

  return NextResponse.json({
    found: true,
    channelUrl: channelInfo.channelUrl,
    planType: channelInfo.planType,
    createdAt: channelInfo.createdAt
  });
}
