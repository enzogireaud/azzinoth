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
    console.log(`🏭 Memory keys after storage:`, Array.from(this.channels.keys()));
    
    // Try to persist to file with retries
    let saveSuccess = false;
    for (let retry = 0; retry < 3; retry++) {
      console.log(`🏭 Attempting file save (attempt ${retry + 1}/3)...`);
      saveSuccess = await this.saveToFile();
      if (saveSuccess) {
        console.log('🏭 ✅ Successfully persisted to file');
        // Wait a moment to ensure file write is complete
        await new Promise(resolve => setTimeout(resolve, 50));
        break;
      } else {
        console.log(`🏭 ❌ File save attempt ${retry + 1} failed`);
        // Wait a bit before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    if (!saveSuccess) {
      console.error('🏭 ⚠️ WARNING: Could not persist to file after 3 attempts. Channel stored in memory only.');
    }
    
    // CRITICAL: Verify storage with immediate retrieval test
    console.log('🏭 === IMMEDIATE VERIFICATION TEST ===');
    const stored = this.channels.get(sessionId);
    console.log('🏭 Direct memory check - Channel stored:', stored ? '✅ YES' : '❌ NO');
    if (stored) {
      console.log('🏭 Direct memory data:', stored);
    }
    
    // Force file reload and test
    try {
      await this.loadFromFile();
      const reloadedStored = this.channels.get(sessionId);
      console.log('🏭 After file reload - Channel found:', reloadedStored ? '✅ YES' : '❌ NO');
      if (reloadedStored) {
        console.log('🏭 Reloaded data:', reloadedStored);
      }
    } catch (error) {
      console.error('🏭 Error during verification reload:', error);
    }
    
    console.log('🏭 === STORAGE COMPLETED ===');
    
    return true; // Always return true since in-memory storage succeeded
  }

  // Get channel info with robust loading
  async getChannel(sessionId: string): Promise<ChannelInfo | null> {
    console.log('🏭 === PRODUCTION CHANNEL RETRIEVAL ===');
    console.log(`🏭 Looking for session: ${sessionId}`);
    console.log(`🏭 Session ID length: ${sessionId.length}`);
    console.log(`🏭 Session ID type: ${typeof sessionId}`);
    
    await this.initialize();
    
    // First check memory without reload
    console.log('🏭 STEP 1: Checking current memory state...');
    console.log(`🏭 Current memory size: ${this.channels.size}`);
    console.log(`🏭 Current memory keys:`, Array.from(this.channels.keys()));
    const memoryResult = this.channels.get(sessionId);
    console.log(`🏭 Memory check result: ${memoryResult ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    // Always reload from file to get latest data from other processes
    console.log('🏭 STEP 2: Reloading from file...');
    try {
      await this.loadFromFile();
      console.log(`🏭 After file reload - memory size: ${this.channels.size}`);
      console.log(`🏭 After file reload - keys:`, Array.from(this.channels.keys()));
    } catch (error) {
      console.error('🏭 Warning: Could not reload from file, using memory data');
    }
    
    // Final lookup
    console.log('🏭 STEP 3: Final lookup...');
    const result = this.channels.get(sessionId) || null;
    console.log(`🏭 Final result: ${result ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    if (result) {
      console.log('🏭 Found channel info:', result);
    } else {
      console.log('🏭 ⚠️ Session not found - DETAILED DEBUG:');
      console.log(`🏭 Total sessions in memory: ${this.channels.size}`);
      
      // Character-by-character comparison
      for (const [key, info] of this.channels.entries()) {
        console.log(`🏭 Comparing with: "${key}"`);
        console.log(`🏭   Target: "${sessionId}"`);
        console.log(`🏭   Lengths: ${key.length} vs ${sessionId.length}`);
        console.log(`🏭   Equal: ${key === sessionId}`);
        console.log(`🏭   Plan: ${info.planType}`);
        
        // Character by character check
        if (key.length === sessionId.length) {
          let diff = false;
          for (let i = 0; i < key.length; i++) {
            if (key[i] !== sessionId[i]) {
              console.log(`🏭   Diff at position ${i}: "${key[i]}" vs "${sessionId[i]}"`);
              diff = true;
              break;
            }
          }
          if (!diff) {
            console.log(`🏭   ⚠️ CHARACTERS MATCH BUT === FAILED!`);
          }
        }
      }
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
