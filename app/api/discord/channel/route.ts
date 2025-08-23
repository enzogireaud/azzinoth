import { NextRequest, NextResponse } from 'next/server';
import { channelStore } from '@/lib/discord/channel-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session');
  
  console.log(`🔍 Checking for Discord channel with session ID: ${sessionId}`);
  
  if (!sessionId) {
    console.log('❌ No session ID provided');
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  const channelInfo = channelStore.getChannel(sessionId);
  console.log(`🔍 Channel store lookup result:`, channelInfo ? 'FOUND' : 'NOT FOUND');
  
  if (channelInfo) {
    console.log(`✅ Channel info found:`, {
      channelUrl: channelInfo.channelUrl,
      planType: channelInfo.planType,
      createdAt: new Date(channelInfo.createdAt)
    });
  }
  
  // Debug: List all stored channels
  const allChannels = channelStore.listChannels();
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
