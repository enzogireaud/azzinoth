// Simple in-memory store for Discord channel URLs
// In production, you'd use Redis or a database

interface ChannelInfo {
  channelUrl: string;
  planType: string;
  customerEmail: string;
  createdAt: number;
}

class ChannelStore {
  private channels = new Map<string, ChannelInfo>();

  // Store channel info using Stripe session ID as key
  storeChannel(sessionId: string, info: ChannelInfo) {
    console.log(`🏪 STORING channel info for session: ${sessionId}`);
    console.log(`🏪 Channel info:`, info);
    this.channels.set(sessionId, info);
    console.log(`✅ Successfully stored! Total stored: ${this.channels.size}`);
    console.log(`🗂️ All stored sessions:`, Array.from(this.channels.keys()));
    
    // Auto-cleanup after 1 hour
    setTimeout(() => {
      this.channels.delete(sessionId);
      console.log(`🧹 Cleaned up channel info for session ${sessionId}`);
    }, 60 * 60 * 1000);
  }

  // Get channel info by session ID
  getChannel(sessionId: string): ChannelInfo | null {
    console.log(`🔍 LOOKING UP channel for session: ${sessionId}`);
    console.log(`🔍 Total stored sessions: ${this.channels.size}`);
    console.log(`🔍 Available sessions:`, Array.from(this.channels.keys()));
    const result = this.channels.get(sessionId) || null;
    console.log(`🔍 Lookup result:`, result ? 'FOUND' : 'NOT FOUND');
    return result;
  }

  // List all stored channels (for debugging)
  listChannels() {
    return Array.from(this.channels.entries());
  }
}

export const channelStore = new ChannelStore();
