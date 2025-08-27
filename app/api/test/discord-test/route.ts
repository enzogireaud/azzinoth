import { NextResponse } from 'next/server';
import { discordAPI } from '@/lib/discord/api';

export async function GET() {
  console.log('🧪 === DISCORD TEST ENDPOINT ===');
  
  try {
    // Test Discord configuration
    console.log('🔧 Discord Bot Token available:', !!process.env.DISCORD_BOT_TOKEN);
    console.log('🔧 Discord Guild ID available:', !!process.env.DISCORD_GUILD_ID);
    
    if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_GUILD_ID) {
      return NextResponse.json({
        success: false,
        error: 'Discord environment variables missing',
        botToken: !!process.env.DISCORD_BOT_TOKEN,
        guildId: !!process.env.DISCORD_GUILD_ID
      });
    }

    // Test notification
    console.log('📢 Testing Discord notification...');
    await discordAPI.sendNotification('🧪 **Test message from production!** Discord integration is working! ✅');
    
    console.log('✅ Discord test successful!');
    return NextResponse.json({
      success: true,
      message: 'Discord integration working!',
      botToken: !!process.env.DISCORD_BOT_TOKEN,
      guildId: !!process.env.DISCORD_GUILD_ID
    });
    
  } catch (error) {
    console.error('❌ Discord test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      botToken: !!process.env.DISCORD_BOT_TOKEN,
      guildId: !!process.env.DISCORD_GUILD_ID
    });
  }
}
