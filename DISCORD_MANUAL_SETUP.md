# Discord Manual Setup Guide 🎮

## What You Need to Do Manually

### 1. Get Your Discord Server ID
1. **Enable Developer Mode**:
   - Open Discord → Settings → Advanced → Enable Developer Mode

2. **Get Server ID**:
   - Right-click your server name → Copy Server ID
   - Update `.env.local`: `DISCORD_GUILD_ID=YOUR_SERVER_ID_HERE`

### 2. Invite Bot to Your Server
1. **Create Invite Link**:
   ```
   https://discord.com/api/oauth2/authorize?client_id=1408720511571066903&permissions=268445712&scope=bot
   ```
   *(Replace client_id with your bot's ID if different)*

2. **Required Permissions**:
   - ✅ Manage Channels
   - ✅ Manage Roles  
   - ✅ Send Messages
   - ✅ Read Message History
   - ✅ Use External Emojis
   - ✅ Embed Links

### 3. Server Structure Setup
Create these channels manually:

#### Basic Channels:
```
📋 GENERAL
├── #welcome
├── #announcements  
└── #notifications (for admin alerts)
```

#### Voice Channels for Premium Sessions:
```
🎯 COACHING
├── 🎤 Premium Session 1
├── 🎤 Premium Session 2
└── 🎤 Premium+ Session
```

**Note**: Customer channels are auto-created by the bot!

### 4. Calendly Links Setup
Update these links in `lib/discord/bot.ts`:

```typescript
// Line ~135 - Premium Plan
value: '**[📅 Click here to book your session](https://calendly.com/YOUR-CALENDLY-LINK/1h-coaching)**'

// Line ~160 - Premium+ Plan  
value: '**[📅 Click here to book your premium session](https://calendly.com/YOUR-CALENDLY-LINK/1h30-premium-coaching)**'
```

### 5. Optional: Upload Storm Icon
1. Upload a storm/lightning icon to Discord
2. Copy the image URL
3. Update `lib/discord/bot.ts` line ~120:
   ```typescript
   .setThumbnail('YOUR_STORM_ICON_URL_HERE')
   ```

### 6. Testing the Bot
1. **Deploy your app** to Vercel with new environment variables
2. **Test payment flow**:
   - Make test purchase → Check if channel is created
   - Verify customer gets proper instructions
   - Check if you receive admin notifications

### 7. Production Considerations

#### Security:
- ✅ Keep bot token secret
- ✅ Regularly rotate tokens
- ✅ Monitor bot activity logs

#### Scaling:
- Current setup uses `setTimeout` for channel deletion
- For production, consider using:
  - **Bull Queue** for job scheduling
  - **Database** to track channel lifecycles
  - **Cron jobs** for cleanup

#### Customer Support:
- Monitor `#notifications` channel for new customers
- Respond to customer uploads in private channels
- Use Discord's search to find customer conversations

### 8. What Happens Automatically ✨

After setup, the bot will:

1. **Payment Success** → **Private Channel Created**
2. **Welcome Message** → **Plan-Specific Instructions** 
3. **Admin Notification** → **Customer Details Sent to You**
4. **Auto-Cleanup** → **Channel Deletes After Period**

### Troubleshooting

#### Bot Not Creating Channels:
- Check `DISCORD_GUILD_ID` is correct
- Verify bot has permissions
- Check Vercel logs for errors

#### Bot Not Responding:
- Bot needs to be online (Vercel keeps it alive)
- Check Discord Developer Portal for status
- Verify webhook is receiving events

#### Missing Admin Notifications:
- Create `#notifications` channel
- Bot will auto-find it by name

---

## Ready to Go Live! 🚀

Once you've completed these steps:
1. Test with Stripe test mode first
2. Switch to live Stripe keys on Vercel
3. Make a real test purchase to verify everything works
4. Start coaching and dominating! ⚡

**Your customers will now get instant Discord access after payment with clear instructions for their specific plan!**
