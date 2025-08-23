import { discordAPI } from './api';

// Helper function to send Discord server invite to a customer's private channel
export async function sendDiscordInviteToCustomer(customerEmail: string, sessionTime: string) {
  try {
    const message = `🎮 **Discord Server Invite for Your Coaching Session**

**Session Time:** ${new Date(sessionTime).toLocaleString()}

**Join our Discord server:** https://discord.gg/YOUR_INVITE_CODE_HERE

**Voice Channel:** Look for "Premium Coaching" channels
**What to bring:**
• Your questions ready
• OP.GG profile open  
• Recent replays if needed

See you soon! ⚡`;

    // In production, you'd want to find the specific customer channel
    // For now, send to notifications channel with customer email
    await discordAPI.sendNotification(
      `📨 **Send this to ${customerEmail}'s private channel:**\n\n${message}`
    );
    
    return true;
  } catch (error) {
    console.error('Error sending Discord invite:', error);
    return false;
  }
}
