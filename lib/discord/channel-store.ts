// File-based persistent store for Discord channel URLs
// Works across Next.js serverless function invocations
import fs from 'fs';
import path from 'path';

interface ChannelInfo {
  channelUrl: string;
  planType: string;
  customerEmail: string;
  createdAt: number;
}

class ChannelStore {
  private channels = new Map<string, ChannelInfo>();
  private static instance: ChannelStore;
  private storeFilePath: string;

  constructor() {
    console.log('🏪 ChannelStore constructor called - creating persistent file-based instance');
    // Use temp directory for persistent storage across serverless invocations
    this.storeFilePath = path.join(process.cwd(), 'temp-channel-store.json');
    this.loadFromFile();
  }

  static getInstance() {
    if (!ChannelStore.instance) {
      console.log('🏪 Creating new ChannelStore persistent instance');
      ChannelStore.instance = new ChannelStore();
    } else {
      console.log('🏪 Using existing ChannelStore persistent instance');
    }
    return ChannelStore.instance;
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.storeFilePath)) {
        const data = fs.readFileSync(this.storeFilePath, 'utf8');
        const parsed = JSON.parse(data);
        this.channels = new Map(Object.entries(parsed));
        console.log(`🏪 Loaded ${this.channels.size} channel entries from persistent storage`);
        console.log('🏪 Loaded sessions:', Array.from(this.channels.keys()));
      } else {
        console.log('🏪 No persistent storage file found - starting fresh');
      }
    } catch (error) {
      console.error('🏪 Error loading from persistent storage:', error);
      this.channels = new Map();
    }
  }

  private saveToFile() {
    try {
      const data = Object.fromEntries(this.channels);
      fs.writeFileSync(this.storeFilePath, JSON.stringify(data, null, 2));
      console.log(`🏪 Saved ${this.channels.size} channel entries to persistent storage`);
    } catch (error) {
      console.error('🏪 Error saving to persistent storage:', error);
    }
  }

  // Store channel info using Stripe session ID as key
  storeChannel(sessionId: string, info: ChannelInfo) {
    console.log(`🏪 === STORING CHANNEL INFO (PERSISTENT) ===`);
    console.log(`🏪 Session ID: ${sessionId}`);
    console.log(`🏪 Channel info:`, info);
    console.log(`🏪 Current store size before: ${this.channels.size}`);
    console.log(`🏪 Current sessions before:`, Array.from(this.channels.keys()));
    
    this.channels.set(sessionId, info);
    this.saveToFile(); // Persist to file immediately
    
    console.log(`🏪 Current store size after: ${this.channels.size}`);
    console.log(`🏪 Current sessions after:`, Array.from(this.channels.keys()));
    console.log(`✅ Successfully stored and persisted! Total stored: ${this.channels.size}`);
    console.log(`🗂️ All stored sessions:`, Array.from(this.channels.keys()));
    
    // Auto-cleanup after 2 hours (extended timeout)
    const cleanupTimer = setTimeout(() => {
      console.log(`🧹 Auto-cleanup timer triggered for session ${sessionId}`);
      // Reload from file in case other processes modified it
      this.loadFromFile();
      if (this.channels.has(sessionId)) {
        this.channels.delete(sessionId);
        this.saveToFile(); // Persist the cleanup
        console.log(`🧹 Cleaned up and persisted removal for session ${sessionId}`);
      } else {
        console.log(`🧹 Session ${sessionId} was already cleaned up`);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours instead of 1

    console.log(`🧹 Cleanup timer set for session ${sessionId}, timer ID:`, cleanupTimer);
    console.log(`🏪 === PERSISTENT STORAGE COMPLETED ===`);
  }

  // Get channel info by session ID
  getChannel(sessionId: string): ChannelInfo | null {
    console.log(`🔍 === CHANNEL LOOKUP STARTED (PERSISTENT) ===`);
    console.log(`🔍 Looking for session: ${sessionId}`);
    
    // Reload from file to get latest data from other processes
    this.loadFromFile();
    
    console.log(`🔍 Store instance ID:`, this);
    console.log(`🔍 Total stored sessions: ${this.channels.size}`);
    console.log(`🔍 Available sessions:`, Array.from(this.channels.keys()));
    console.log(`🔍 Map object:`, this.channels);
    
    const result = this.channels.get(sessionId) || null;
    console.log(`🔍 Lookup result:`, result ? 'FOUND' : 'NOT FOUND');
    
    if (result) {
      console.log(`🔍 Found data:`, result);
    } else {
      console.log(`🔍 Session not found. Debugging...`);
      console.log(`🔍 Exact key match test:`, this.channels.has(sessionId));
      console.log(`🔍 All keys for comparison:`);
      for (const key of this.channels.keys()) {
        console.log(`🔍   Key: "${key}" (length: ${key.length})`);
        console.log(`🔍   Target: "${sessionId}" (length: ${sessionId.length})`);
        console.log(`🔍   Match: ${key === sessionId}`);
      }
    }
    
    console.log(`🔍 === PERSISTENT CHANNEL LOOKUP COMPLETED ===`);
    return result;
  }

  // List all stored channels (for debugging)
  listChannels() {
    // Reload from file to get latest data
    this.loadFromFile();
    return Array.from(this.channels.entries());
  }
}

export const channelStore = ChannelStore.getInstance();
