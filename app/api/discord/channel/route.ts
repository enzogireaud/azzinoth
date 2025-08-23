import { NextRequest, NextResponse } from 'next/server';
import { channelStore } from '@/lib/discord/channel-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session');
  
  if (!sessionId) {
    return NextResponse.json(
      { error: 'Session ID required' },
      { status: 400 }
    );
  }

  const channelInfo = channelStore.getChannel(sessionId);
  
  if (!channelInfo) {
    return NextResponse.json({
      found: false,
      message: 'Discord channel is being created...'
    });
  }

  return NextResponse.json({
    found: true,
    channelUrl: channelInfo.channelUrl,
    planType: channelInfo.planType,
    createdAt: channelInfo.createdAt
  });
}
