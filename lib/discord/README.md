# Discord Bot Setup Guide

## 🎮 Discord Bot Integration for Azzinoth Coaching

This Discord bot automatically creates private channels for customers after successful payment and provides plan-specific instructions.

### Bot Capabilities

- ✅ **Automatic Channel Creation**: Creates private channels per customer
- ✅ **Plan-Specific Messages**: Different instructions based on coaching plan
- ✅ **Auto-Deletion**: Channels self-delete after completion period
- ✅ **Rich Embeds**: Professional-looking messages with icons and formatting
- ✅ **Customer Notifications**: Welcome messages with clear next steps
- ✅ **Admin Notifications**: Alerts you when new customers purchase

### Channel Structure

```
🏠 Your Discord Server
├── 📋 General Channels
│   ├── #welcome
│   ├── #announcements
│   └── #notifications (bot sends admin alerts here)
├── 💰 Active Customers (auto-created category)
│   ├── #simple-customer-abc123 (7-day auto-delete)
│   ├── #medium-customer-def456 (7-day auto-delete)
│   └── #premium-customer-ghi789 (14-day auto-delete)
└── 🎯 Voice Channels
    ├── Premium Coaching 1
    └── Premium Coaching 2
```

### Plan-Specific Workflows

#### Simple Plan (€15)
1. Payment completed → Private channel created
2. Bot requests: 1 game replay file
3. Customer uploads .rofl file
4. You provide analysis within 24-48h
5. Channel auto-deletes after 7 days

#### Medium Plan (€30)
1. Payment completed → Private channel created
2. Bot requests: OP.GG link + 2 game replays
3. Customer provides both
4. You provide comprehensive analysis within 24h
5. Channel auto-deletes after 7 days

#### Premium Plan (€50)
1. Payment completed → Private channel created
2. Bot provides Calendly link for 1h session
3. Customer books session and shares OP.GG
4. You conduct live session via Discord voice
5. Channel auto-deletes after 14 days

#### Premium+ Plan (€75)
1. Payment completed → Private channel created
2. Bot provides Calendly link for 1.5h session
3. Customer books session and shares OP.GG
4. You conduct extended session + live game spectating
5. Channel auto-deletes after 14 days

### Environment Variables Required

```bash
DISCORD_BOT_TOKEN=your_bot_token_here
DISCORD_GUILD_ID=your_server_id_here
```

### Security Features

- Private channels only visible to you and the customer
- Automatic role management
- Secure token handling
- Error logging without exposing sensitive data

### Next Steps for Manual Setup

See DISCORD_MANUAL_SETUP.md for detailed manual configuration steps.
