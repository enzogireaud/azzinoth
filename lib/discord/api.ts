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
    console.log(`🔗 Making Discord API request: ${method} ${endpoint}`);
    if (body) {
      console.log(`🔗 Request body:`, JSON.stringify(body, null, 2));
    }
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bot ${this.botToken}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseText = await response.text();
      console.log(`🔗 Discord API response: ${response.status} ${response.statusText}`);
      console.log(`🔗 Response body:`, responseText);

      if (!response.ok) {
        const error = new Error(`Discord API error: ${response.status} ${response.statusText} - ${responseText}`);
        console.error('🔗 Discord API request failed:', error.message);
        throw error;
      }

      return responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      console.error('🔗 Discord API request exception:', error);
      throw error;
    }
  }

  async createCustomerChannel(data: CustomerChannelData): Promise<string | null> {
    try {
      console.log('🏗️ === STARTING DISCORD CHANNEL CREATION ===');
      console.log('🏗️ Customer data:', data);
      
      if (!this.ensureInitialized()) {
        console.log('❌ Discord not configured - skipping channel creation');
        return null;
      }
      console.log('✅ Discord initialized successfully');
      
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
          // Bot should have permissions through server roles
          // Note: You can add your user ID here manually for access
          // {
          //   id: 'YOUR_USER_ID_HERE',
          //   type: 1,
          //   allow: '3072', // VIEW_CHANNEL + SEND_MESSAGES
          // },
        ],
      });

      console.log('📢 === SENDING WELCOME MESSAGES ===');
      console.log('📢 About to send welcome messages to channel:', channel.id);
      console.log('📢 sendWelcomeMessage function exists?', typeof this.sendWelcomeMessage);
      console.log('📢 Channel ID type:', typeof channel.id, 'value:', channel.id);
      console.log('📢 Data object:', JSON.stringify(data, null, 2));
      
      try {
        console.log('📢 CALLING sendWelcomeMessage NOW...');
        await this.sendWelcomeMessage(channel.id, data);
        console.log('📢 Welcome messages completed successfully');
      } catch (error) {
        console.error('❌ === WELCOME MESSAGE SENDING FAILED ===');
        console.error('❌ Welcome message sending failed:', error);
        if (error instanceof Error) {
          console.error('❌ Welcome message error details:', error.message);
          console.error('❌ Welcome message error stack:', error.stack);
        }
        console.error('❌ === END WELCOME MESSAGE ERROR ===');
      }

      console.log(`✅ Created Discord channel: ${channelName} for ${data.customerEmail}`);
      console.log('🏗️ === DISCORD CHANNEL CREATION COMPLETED ===');
      
      // Store channel info for later use (could be database in production)
      // For now, we'll use the channel name to find it later
      
      return `https://discord.com/channels/${this.guildId!}/${channel.id}`;

    } catch (error) {
      console.error('❌ === DISCORD CHANNEL CREATION FAILED ===');
      console.error('❌ Error details:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      return null;
    }
  }

  private async sendWelcomeMessage(channelId: string, data: CustomerChannelData) {
    console.log(`💬 === SENDING CONSOLIDATED WELCOME MESSAGE ===`);
    console.log(`💬 Target channel: ${channelId}`);
    console.log(`💬 Customer data:`, data);
    
    try {
      console.log(`💬 Creating consolidated welcome embed...`);
      const embed = this.createConsolidatedWelcomeEmbed(data);
      console.log(`💬 Consolidated embed created`);
      
      console.log(`💬 Sending welcome message to channel ${channelId}...`);
      const response = await this.makeRequest(`/channels/${channelId}/messages`, 'POST', {
        embeds: [embed]
      });
      console.log(`✅ Consolidated welcome message sent successfully to ${channelId}`);
      console.log(`💬 === WELCOME MESSAGE COMPLETED ===`);
    } catch (error) {
      console.error(`❌ === WELCOME MESSAGE FAILED ===`);
      console.error(`❌ Failed to send welcome message to ${channelId}:`, error);
      if (error instanceof Error) {
        console.error(`❌ Error details:`, error.message);
        console.error(`❌ Error stack:`, error.stack);
      }
    }
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

  private createActionStepsEmbed(data: CustomerChannelData): DiscordEmbed {
    const embed: DiscordEmbed = {
      title: '📋 Your Next Steps',
      color: 0x00bfff, // Deep sky blue
      footer: {
        text: 'Follow these steps to get started with your coaching!'
      }
    };

    switch (data.planType) {
      case 'simple':
        embed.description = `**Ready to improve your toplane gameplay?** Here's what you need to do:`;
        embed.fields = [
          {
            name: '1️⃣ Upload Your Game Replay',
            value: '• Go to your League of Legends client\n• Open **Match History**\n• Find the game you want analyzed\n• Click **"Download"** to get the .rofl file\n• **Drag and drop the file here** in this Discord channel',
            inline: false
          },
          {
            name: '2️⃣ What Game to Choose?',
            value: '• Pick a **recent ranked game** (within last 7 days)\n• Choose a game where you **struggled** or want feedback\n• Avoid games with trolls/AFKers (focus on your gameplay)\n• **Toplane games only** please!',
            inline: false
          },
          {
            name: '3️⃣ What Happens Next?',
            value: '• I\'ll analyze your gameplay within **24-48 hours**\n• You\'ll receive **detailed written feedback**\n• Focus areas: **laning, teamfights, macro decisions**\n• I\'ll provide **specific improvement tips**',
            inline: false
          }
        ];
        break;

      case 'medium':
        embed.description = `**Time to level up your toplane mastery!** Here's your complete roadmap:`;
        embed.fields = [
          {
            name: '1️⃣ Share Your OP.GG Profile',
            value: '• Go to **op.gg** and search your summoner name\n• Copy the **full URL** of your profile\n• **Paste it here** so I can analyze your champion pool and rank history',
            inline: false
          },
          {
            name: '2️⃣ Upload 2 Game Replays',
            value: '• Go to League client → **Match History**\n• Download **2 recent ranked games** (.rofl files)\n• Pick games that show your **typical performance**\n• **Drag and drop both files** in this channel',
            inline: false
          },
          {
            name: '3️⃣ What You\'ll Receive (within 24h)',
            value: '• **Complete analysis** of both games\n• **Champion pool optimization** advice\n• **Macro improvement** recommendations\n• **Matchup-specific** guidance\n• **Rank climbing strategy** tailored to you',
            inline: false
          }
        ];
        break;

      case 'premium':
        embed.description = `**Welcome to premium coaching!** Get ready for your **1-hour live session**:`;
        embed.fields = [
          {
            name: '1️⃣ Book Your Session',
            value: '• Use this Calendly link: **[Book 1h Session](https://calendly.com/enzogireauds/toplane-coaching-1h)**\n• Choose a time that works for you\n• You\'ll receive confirmation email',
            inline: false
          },
          {
            name: '2️⃣ Share Your OP.GG',
            value: '• Post your **OP.GG profile link** here\n• This helps me prepare for our session\n• I\'ll review your match history beforehand',
            inline: false
          },
          {
            name: '3️⃣ Session Preparation',
            value: '• Think about **specific champions/matchups** you want to discuss\n• Have **recent games** ready to review together\n• Prepare **questions** about your gameplay\n• Make sure **Discord voice** is working',
            inline: false
          },
          {
            name: '4️⃣ What We\'ll Cover (1 Hour)',
            value: '• **Live OP.GG review** and champion pool discussion\n• **Interactive replay analysis** together\n• **Real-time Q&A** about your gameplay\n• **Personalized improvement plan**',
            inline: false
          }
        ];
        break;

      case 'premium-plus':
        embed.description = `**Ultimate coaching experience activated!** Prepare for **1.5 hours** of intensive coaching:`;
        embed.fields = [
          {
            name: '1️⃣ Book Your Premium Session',
            value: '• Use this Calendly link: **[Book 1.5h Premium Session](https://calendly.com/enzogireauds/premium-plan-1h30)**\n• Choose your preferred time slot\n• Block **1.5 hours** in your schedule',
            inline: false
          },
          {
            name: '2️⃣ Pre-Session Setup',
            value: '• Share your **OP.GG profile link** here\n• Make sure you can **play a live game** during our session\n• Have **screen share** ready in Discord\n• Test your **microphone and audio**',
            inline: false
          },
          {
            name: '3️⃣ Session Structure (1.5 Hours)',
            value: '• **30 min**: Deep OP.GG analysis + champion pool optimization\n• **45 min**: Multiple replay reviews together\n• **15 min**: **LIVE game spectating** (I watch you play real-time!)\n• **Bonus**: Comprehensive strategy discussion',
            inline: false
          },
          {
            name: '4️⃣ Premium Extras',
            value: '• **Live game coaching** - I guide you during a real match\n• **Extended Q&A** - no question is off-limits\n• **Custom improvement roadmap** for your climb\n• **Follow-up notes** summarizing our session',
            inline: false
          }
        ];
        break;
    }

    return embed;
  }

  private createSubscriptionSummaryEmbed(data: CustomerChannelData): DiscordEmbed {
    const embed: DiscordEmbed = {
      title: '🎉 Subscription Confirmation',
      color: 0xffd700, // Gold color
      footer: {
        text: `Welcome to Azzinoth Coaching • Master Toplane Training`
      }
    };

    const plans = {
      premium: {
        name: 'Premium Plan',
        price: '€50',
        duration: '1 Hour',
        calendlyLink: 'https://calendly.com/enzogireauds/toplane-coaching-1h',
        features: [
          '🎤 **Live Discord voice session** with screen sharing',
          '📊 **OP.GG profile deep dive** and champion pool analysis', 
          '🎮 **Interactive replay review** together',
          '🎯 **Real-time Q&A** about your gameplay',
          '📋 **Personalized improvement plan**'
        ]
      },
      'premium-plus': {
        name: 'Premium+ Plan', 
        price: '€75',
        duration: '1.5 Hours',
        calendlyLink: 'https://calendly.com/enzogireauds/premium-plan-1h30',
        features: [
          '🎤 **Extended live Discord session** with screen sharing',
          '📊 **Comprehensive OP.GG analysis** and champion optimization',
          '🎮 **Multiple replay reviews** with detailed breakdowns', 
          '🔴 **LIVE game spectating** - I watch you play in real-time!',
          '🎯 **Extended Q&A session** with no limits',
          '📋 **Custom improvement roadmap** for your rank climb',
          '📝 **Follow-up notes** summarizing our session'
        ]
      }
    };

    const planInfo = plans[data.planType as keyof typeof plans];
    
    embed.description = `**Congratulations ${data.customerName || 'Champion'}!** 🏆\n\n` +
                       `You've successfully purchased the **${planInfo.name}** (${planInfo.price}) for **${planInfo.duration}** of intensive toplane coaching with Azzinoth.`;

    embed.fields = [
      {
        name: '🎯 What You Get:',
        value: planInfo.features.join('\n'),
        inline: false
      },
      {
        name: '📅 Book Your Session NOW:',
        value: `**[🗓️ CLICK HERE TO BOOK YOUR ${planInfo.duration.toUpperCase()} SESSION](${planInfo.calendlyLink})**\n\n` +
               `⏰ **Choose your preferred time slot**\n` +
               `📧 **You'll receive a confirmation email**\n` +
               `🎮 **Session will be conducted right here in Discord**`,
        inline: false
      },
      {
        name: '⚡ Before Our Session:',
        value: '• **Share your OP.GG profile link** in this channel\n' +
               '• **Prepare specific questions** about your gameplay\n' +
               '• **Test your Discord voice/mic** to ensure quality\n' +
               '• **Have recent replays** ready for review',
        inline: false
      }
    ];

    return embed;
  }

  private createConsolidatedWelcomeEmbed(data: CustomerChannelData): DiscordEmbed {
    const embed: DiscordEmbed = {
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
          `**📁 Send me:** 1 game replay (.rofl file from League client)\n` +
          `**📝 You'll get:** Detailed written analysis within 24-48 hours\n\n` +
          `🔒 **Private channel** - only you and I can see this\n` +
          `⚡ I'll respond quickly - feel free to ask questions anytime!`;
        break;

      case 'medium':
        embed.title = '🔥 Medium Plan Activated!';
        embed.description = 
          `Hey **${data.customerName || 'Champion'}**! Time to level up your toplane mastery!\n\n` +
          `**📁 Send me:** Your OP.GG link + 2 game replays\n` +
          `**📝 You'll get:** Detailed analysis + champion pool advice within 24-48 hours\n\n` +
          `🔒 **Private channel** - only you and I can see this\n` +
          `⚡ I'll respond quickly - feel free to ask questions anytime!`;
        break;

      case 'premium':
        embed.title = '💎 Premium Plan Activated!';
        embed.description = 
          `Hey **${data.customerName || 'Champion'}**! Welcome to live coaching!\n\n` +
          `**🎤 Your 1-hour session includes:**\n` +
          `• Discord voice call with screen sharing\n` +
          `• Live OP.GG review + champion pool discussion\n` +
          `• Interactive replay analysis together\n\n` +
          `**📅 Next:** [Book your session](https://calendly.com/enzogireauds/toplane-coaching-1h)\n` +
          `**🔗 Share:** Your OP.GG profile link here for preparation\n\n` +
          `💡 **Can't find a suitable time on Calendly?** Just send me a DM here and we'll find a slot together!\n\n` +
          `🔒 **Private channel** - only you and I can see this`;
        break;

      case 'premium-plus':
        embed.title = '👑 Premium+ Plan Activated!';
        embed.description = 
          `Hey **${data.customerName || 'Champion'}**! Welcome to the ultimate coaching experience!\n\n` +
          `**🎤 Your 1.5-hour session includes:**\n` +
          `• Extended Discord voice call with screen sharing\n` +
          `• Deep OP.GG analysis + champion pool optimization\n` +
          `• Multiple replay reviews together\n` +
          `• **LIVE game spectating** (I watch you play real-time!)\n\n` +
          `**📅 Next:** [Book your premium session](https://calendly.com/enzogireauds/premium-plan-1h30)\n` +
          `**🔗 Share:** Your OP.GG profile link here for preparation\n\n` +
          `💡 **Can't find a suitable time on Calendly?** Just send me a DM here and we'll find a slot together!\n\n` +
          `🔒 **Private channel** - only you and I can see this`;
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
