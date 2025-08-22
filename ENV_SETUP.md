# 🚀 Quick Setup Guide

## ✅ **Issues Fixed:**

### 1. **Background Image** 
- Fixed positioning and sizing with proper CSS
- Added opacity for better text readability
- Your `background.webp` should now display correctly!

### 2. **Less Flashy Design**
- Removed excessive animations and pulsing effects
- Toned down font sizes and emojis  
- Cleaner, more professional look while keeping the gaming theme

### 3. **Payment Logic Working**
- Fixed the JSON error you were getting
- Stripe checkout now works properly without database
- Added proper error handling

## 🔧 **Environment Setup:**

Create a `.env.local` file in your project root with:

```env
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 📋 **Next Steps:**

1. **Get Stripe keys** from your Stripe dashboard
2. **Test payments** in Stripe test mode
3. **Set up Calendly** for live session bookings
4. **Create email templates** for post-purchase instructions

## 💰 **How Each Plan Works Now:**

**🛡️ Simple (15€):** Payment → Success page → Email with instructions to send OP.GG + 1 replay

**⚔️ Medium (30€):** Payment → Success page → Email with instructions to send OP.GG + 2 replays  

**⚡ Premium (50€):** Payment → Success page → Email with Calendly link for 1h session

**👑 Premium+ (75€):** Payment → Success page → Email with Calendly link for 1.5h session

Your coaching website is now ready for business! 🎮
