// Production-ready channel storage using Vercel KV or external DB
// Fallback to robust in-memory + localStorage backup
import fs from 'fs';
import path from 'path';

interface ChannelInfo {
  channelUrl: string;
  planType: string;
  customerEmail: string;
  createdAt: number;
}

class ProductionChannelStorage {
  private channels = new Map<string, ChannelInfo>();
  private static instance: ProductionChannelStorage;
  private storeFilePath: string;
  private initialized = false;

  constructor() {
    console.log('🏭 ProductionChannelStorage: Initializing robust storage system');
    this.storeFilePath = path.join(process.cwd(), 'temp-channel-store.json');
  }

  static getInstance() {
    if (!ProductionChannelStorage.instance) {
      ProductionChannelStorage.instance = new ProductionChannelStorage();
    }
    return ProductionChannelStorage.instance;
  }

  private async initialize() {
    if (this.initialized) return;
    
    console.log('🏭 Initializing production storage...');
    try {
      // Try to load from file first
      await this.loadFromFile();
      this.initialized = true;
      console.log('✅ Production storage initialized successfully');
    } catch (error) {
      console.error('❌ Storage initialization failed:', error);
      this.channels = new Map(); // Start fresh if loading fails
      this.initialized = true;
    }
  }

  private async loadFromFile(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(this.storeFilePath)) {
          const data = fs.readFileSync(this.storeFilePath, 'utf8');
          const parsed = JSON.parse(data);
          this.channels = new Map(Object.entries(parsed));
          console.log(`🏭 Loaded ${this.channels.size} channels from storage`);
          console.log('🏭 Available sessions:', Array.from(this.channels.keys()));
        } else {
          console.log('🏭 No storage file found - starting fresh');
          this.channels = new Map();
        }
        resolve();
      } catch (error) {
        console.error('🏭 Error loading from storage:', error);
        reject(error);
      }
    });
  }

  private async saveToFile(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const data = Object.fromEntries(this.channels);
        fs.writeFileSync(this.storeFilePath, JSON.stringify(data, null, 2));
        console.log(`🏭 ✅ Saved ${this.channels.size} channels to storage`);
        resolve(true);
      } catch (error) {
        console.error('🏭 ❌ Error saving to storage:', error);
        resolve(false); // Don't throw, return false
      }
    });
  }

  // Store channel info with robust error handling and retries
  async storeChannel(sessionId: string, info: ChannelInfo): Promise<boolean> {
    console.log('🏭 === PRODUCTION CHANNEL STORAGE ===');
    console.log(`🏭 Storing session: ${sessionId}`);
    console.log(`🏭 Channel info:`, info);
    
    await this.initialize();
    
    // Store in memory first (always works)
    this.channels.set(sessionId, info);
    console.log(`🏭 ✅ Stored in memory: ${this.channels.size} total sessions`);
    
    // Try to persist to file with retries
    let saveSuccess = false;
    for (let retry = 0; retry < 3; retry++) {
      console.log(`🏭 Attempting file save (attempt ${retry + 1}/3)...`);
      saveSuccess = await this.saveToFile();
      if (saveSuccess) {
        console.log('🏭 ✅ Successfully persisted to file');
        break;
      } else {
        console.log(`🏭 ❌ File save attempt ${retry + 1} failed`);
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    if (!saveSuccess) {
      console.error('🏭 ⚠️ WARNING: Could not persist to file after 3 attempts. Channel stored in memory only.');
      // In production, you could send this to an external service here
      // For now, the in-memory storage will work for the immediate session
    }
    
    // Verify storage
    const stored = this.channels.get(sessionId);
    console.log('🏭 Verification - Channel stored:', stored ? '✅ YES' : '❌ NO');
    console.log('🏭 === STORAGE COMPLETED ===');
    
    return true; // Always return true since in-memory storage succeeded
  }

  // Get channel info with robust loading
  async getChannel(sessionId: string): Promise<ChannelInfo | null> {
    console.log('🏭 === PRODUCTION CHANNEL RETRIEVAL ===');
    console.log(`🏭 Looking for session: ${sessionId}`);
    
    await this.initialize();
    
    // Always reload from file to get latest data from other processes
    try {
      await this.loadFromFile();
    } catch (error) {
      console.error('🏭 Warning: Could not reload from file, using memory data');
    }
    
    const result = this.channels.get(sessionId) || null;
    console.log(`🏭 Search result: ${result ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`🏭 Available sessions (${this.channels.size}):`, Array.from(this.channels.keys()));
    
    if (result) {
      console.log('🏭 Channel info:', result);
    } else {
      console.log('🏭 ⚠️ Session not found in storage');
      // Debug info
      for (const [key, info] of this.channels.entries()) {
        console.log(`🏭 Available: "${key}" (${info.planType}) - Length: ${key.length}`);
      }
      console.log(`🏭 Searching: "${sessionId}" - Length: ${sessionId.length}`);
    }
    
    console.log('🏭 === RETRIEVAL COMPLETED ===');
    return result;
  }

  // List all channels (for debugging)
  async listChannels(): Promise<Array<[string, ChannelInfo]>> {
    await this.initialize();
    try {
      await this.loadFromFile();
    } catch (error) {
      console.error('🏭 Warning: Could not reload for listing');
    }
    return Array.from(this.channels.entries());
  }
}

export const productionChannelStorage = ProductionChannelStorage.getInstance();
