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
    this.channels.set(sessionId, info);
    console.log(`Stored channel info for session ${sessionId}`);
    
    // Auto-cleanup after 1 hour
    setTimeout(() => {
      this.channels.delete(sessionId);
      console.log(`Cleaned up channel info for session ${sessionId}`);
    }, 60 * 60 * 1000);
  }

  // Get channel info by session ID
  getChannel(sessionId: string): ChannelInfo | null {
    return this.channels.get(sessionId) || null;
  }

  // List all stored channels (for debugging)
  listChannels() {
    return Array.from(this.channels.entries());
  }
}

export const channelStore = new ChannelStore();
