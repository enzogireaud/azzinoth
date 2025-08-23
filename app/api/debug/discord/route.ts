import { NextRequest, NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';

export async function POST(request: NextRequest) {
  console.log('🧪 === DISCORD DEBUG TEST ENDPOINT ===');
  
  try {
    const testData = {
      planType: 'premium' as const,
      customerEmail: 'debug@test.com',
      orderId: 'debug-test-123',
      customerName: 'Debug User'
    };

    console.log('🧪 Testing Discord channel creation...');
    const channelUrl = await discordAPI.createCustomerChannel(testData);
    
    if (channelUrl) {
      console.log('✅ Discord test successful!');
      return NextResponse.json({
        success: true,
        channelUrl,
        message: 'Discord integration working!'
      });
    } else {
      console.log('❌ Discord test failed - no URL returned');
      return NextResponse.json({
        success: false,
        message: 'Discord channel creation failed'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Discord debug test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Discord test exception'
    }, { status: 500 });
  }
}
