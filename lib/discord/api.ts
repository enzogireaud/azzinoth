// Discord REST API Integration (Serverless-friendly)
interface DiscordChannel {
  id: string;
  name: string;
  type: number;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
  };
  thumbnail?: {
    url: string;
  };
}

interface CustomerChannelData {
  planType: 'simple' | 'medium' | 'premium' | 'premium-plus';
  customerEmail: string;
  orderId: string;
  customerName?: string;
}

class DiscordAPI {
  private baseURL = 'https://discord.com/api/v10';
  private botToken?: string;
  private guildId?: string;

  constructor() {
    // Don't initialize during build time - defer until first use
  }

  private ensureInitialized() {
    if (!this.botToken || !this.guildId) {
      this.botToken = process.env.DISCORD_BOT_TOKEN;
      this.guildId = process.env.DISCORD_GUILD_ID;

      if (!this.botToken || !this.guildId) {
        console.warn('Discord configuration missing - Discord integration disabled');
        return false;
      }
    }
    return true;
  }

  private async makeRequest(endpoint: string, method = 'GET', body?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bot ${this.botToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  async createCustomerChannel(data: CustomerChannelData): Promise<string | null> {
    try {
      if (!this.ensureInitialized()) {
        console.log('Discord not configured - skipping channel creation');
        return null;
      }
      // Find or create "Active Customers" category
      const channels = await this.makeRequest(`/guilds/${this.guildId}/channels`);
      let categoryId = channels.find((ch: any) => 
        ch.type === 4 && ch.name === 'Active Customers'
      )?.id;

      if (!categoryId) {
        const category = await this.makeRequest(`/guilds/${this.guildId!}/channels`, 'POST', {
          name: 'Active Customers',
          type: 4, // Category channel
        });
        categoryId = category.id;
      }

      // Create unique channel name
      const channelName = `${data.planType}-customer-${data.orderId.slice(-8)}`.toLowerCase();

      // Create private text channel
      const channel = await this.makeRequest(`/guilds/${this.guildId!}/channels`, 'POST', {
        name: channelName,
        type: 0, // Text channel
        parent_id: categoryId,
        permission_overwrites: [
          {
            id: this.guildId!, // @everyone role
            type: 0,
            deny: '1024', // VIEW_CHANNEL permission
          },
          // Note: You'll need to get your user ID and add it here manually
          // {
          //   id: 'YOUR_USER_ID_HERE',
          //   type: 1,
          //   allow: '3072', // VIEW_CHANNEL + SEND_MESSAGES
          // },
        ],
      });

      // Send welcome message
      await this.sendWelcomeMessage(channel.id, data);

      console.log(`Created Discord channel: ${channelName} for ${data.customerEmail}`);
      return `https://discord.com/channels/${this.guildId!}/${channel.id}`;

    } catch (error) {
      console.error('Error creating Discord channel:', error);
      return null;
    }
  }

  private async sendWelcomeMessage(channelId: string, data: CustomerChannelData) {
    const embed = this.createWelcomeEmbed(data);
    
    await this.makeRequest(`/channels/${channelId}/messages`, 'POST', {
      embeds: [embed]
    });

    // Send additional info message
    const infoEmbed: DiscordEmbed = {
      title: '💡 Important Information',
      description: 
        `**This channel will automatically delete after ${['premium', 'premium-plus'].includes(data.planType) ? '14 days' : '7 days'}.**\n\n` +
        `🔒 This is your **private channel** - only you and I can see it.\n` +
        `⚡ I'll respond as quickly as possible.\n` +
        `❓ Feel free to ask questions anytime!\n\n` +
        `🎯 **Need immediate help?** Just mention me @Azzinoth`,
      color: 0xffaa00, // Orange color
    };

    await this.makeRequest(`/channels/${channelId}/messages`, 'POST', {
      embeds: [infoEmbed]
    });
  }

  private createWelcomeEmbed(data: CustomerChannelData): DiscordEmbed {
    let embed: DiscordEmbed = {
      color: 0x00ff00, // Green color
      footer: {
        text: 'Azzinoth Coaching - Master Your Toplane'
      }
    };

    switch (data.planType) {
      case 'simple':
        embed.title = '⚡ Simple Plan Activated!';
        embed.description = 
          `Hey **${data.customerName || 'Champion'}**! Ready to improve your toplane gameplay?\n\n` +
          `**What I need from you:**\n` +
          `📁 Upload **1 game replay file** (.rofl format from League client)\n` +
          `🎯 Choose a game where you want specific feedback\n\n` +
          `**What you'll get:**\n` +
          `📝 Detailed written analysis within **24-48 hours**\n` +
          `🎯 Specific improvement points for your toplane gameplay\n` +
          `⚔️ Matchup-specific advice`;
        embed.fields = [
          {
            name: '📂 How to get your replay file:',
            value: '1. Open League of Legends client\n2. Go to Match History\n3. Click "Download" on the game you want analyzed\n4. Upload the .rofl file here',
            inline: false
          }
        ];
        break;

      case 'medium':
        embed.title = '🔥 Medium Plan Activated!';
        embed.description = 
          `Hey **${data.customerName || 'Champion'}**! Time to level up your toplane mastery!\n\n` +
          `**What I need from you:**\n` +
          `🔗 Your **OP.GG profile link**\n` +
          `📁 Upload **2 game replay files** (.rofl format)\n` +
          `🎯 Pick games that represent your typical gameplay\n\n` +
          `**What you'll get:**\n` +
          `📊 Complete analysis of both games within **24 hours**\n` +
          `🏆 Champion pool optimization advice\n` +
          `📈 Macro improvement recommendations\n` +
          `⚔️ Detailed matchup guidance`;
        embed.fields = [
          {
            name: '🔗 OP.GG Profile:',
            value: 'Share your OP.GG link so I can analyze your champion pool and rank history',
            inline: false
          },
          {
            name: '📂 Replay Files:',
            value: 'Upload 2 .rofl files from your League client Match History',
            inline: false
          }
        ];
        break;

      case 'premium':
        embed.title = '👑 Premium Plan Activated!';
        embed.description = 
          `Welcome **${data.customerName || 'Champion'}** to premium coaching!\n\n` +
          `**Your 1-hour live coaching session awaits:**\n` +
          `🎤 **Discord voice call** with screen sharing\n` +
          `📊 **Live OP.GG review** and champion pool discussion\n` +
          `🎮 **Interactive replay analysis** together\n` +
          `🎯 **Real-time Q&A** about your gameplay\n\n` +
          `**Next Steps:**\n` +
          `📅 Book your session using the Calendly link below\n` +
          `🔗 Share your OP.GG profile for session preparation\n` +
          `🎧 I'll send Discord voice channel invite before our call`;
        embed.fields = [
          {
            name: '📅 Book Your 1-Hour Session:',
            value: '**[📅 Click here to book your session](https://calendly.com/enzogireauds/toplane-coaching-1h)**\n\n*Choose a time that works for you!*',
            inline: false
          },
          {
            name: '🔗 OP.GG Profile:',
            value: 'Share your OP.GG link for session preparation',
            inline: false
          }
        ];
        break;

      case 'premium-plus':
        embed.title = '💎 Premium+ Plan Activated!';
        embed.description = 
          `Welcome **${data.customerName || 'Champion'}** to the ultimate coaching experience!\n\n` +
          `**Your 1.5-hour premium session includes:**\n` +
          `🎤 **Extended Discord voice call** with screen sharing\n` +
          `📊 **Deep OP.GG analysis** and champion pool optimization\n` +
          `🎮 **Multiple replay reviews** together\n` +
          `🔴 **LIVE game spectating** (I'll watch you play real-time!)\n` +
          `🎯 **Comprehensive strategy discussion**\n\n` +
          `**Next Steps:**\n` +
          `📅 Book your session using the Calendly link below\n` +
          `🔗 Share your OP.GG profile for session preparation\n` +
          `🎧 I'll send Discord voice channel invite before our call`;
        embed.fields = [
          {
            name: '📅 Book Your 1.5-Hour Premium Session:',
            value: '**[📅 Click here to book your premium session](https://calendly.com/enzogireauds/premium-plan-1h30)**\n\n*Choose your preferred time slot!*',
            inline: false
          },
          {
            name: '🔗 OP.GG Profile:',
            value: 'Share your OP.GG link for session preparation',
            inline: false
          }
        ];
        break;
    }

    return embed;
  }

  async sendNotification(message: string, channelName = 'notifications') {
    try {
      if (!this.ensureInitialized()) {
        console.log('Discord not configured - skipping notification');
        return;
      }
      // Find notifications channel
      const channels = await this.makeRequest(`/guilds/${this.guildId}/channels`);
      const notificationChannel = channels.find((ch: any) => 
        ch.type === 0 && ch.name === channelName
      );

      if (notificationChannel) {
        await this.makeRequest(`/channels/${notificationChannel.id}/messages`, 'POST', {
          content: message
        });
      } else {
        console.warn(`Notification channel '${channelName}' not found`);
      }
    } catch (error) {
      console.error('Error sending Discord notification:', error);
    }
  }
}

// Create singleton instance
const discordAPI = new DiscordAPI();

export { discordAPI };
export type { CustomerChannelData };
