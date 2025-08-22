# 🚀 Complete Vercel Deployment & Stripe Setup Guide

## ✅ **Step 1: Vercel Deployment**

### **A) Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your GitHub repository: `enzogireaud/azzinoth`
4. Vercel will auto-detect Next.js settings
5. **Don't deploy yet** - we need to add environment variables first

### **B) Add Environment Variables in Vercel**
In your Vercel project settings, add these environment variables:

```bash
# Production Stripe Keys (get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_your_live_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key_here

# For testing, you can start with test keys:
STRIPE_SECRET_KEY=sk_test_your_test_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key_here

# Your production domain (will be provided by Vercel)
NEXT_PUBLIC_BASE_URL=https://your-project-name.vercel.app

# Webhook secret (will be set up in Step 2)
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

### **C) Deploy**
1. Click **"Deploy"** 
2. Your site will be available at `https://your-project-name.vercel.app`

---

## 🪝 **Step 2: Production Stripe Webhook Setup**

### **A) Create Production Webhook**
1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-project-name.vercel.app/api/stripe/webhook`
4. **Events to listen for**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
5. Click **"Add endpoint"**

### **B) Get Webhook Secret**
1. Click on your newly created webhook
2. Click **"Reveal signing secret"**
3. Copy the secret (starts with `whsec_...`)
4. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

### **C) Update Vercel with Webhook Secret**
1. In Vercel dashboard, go to your project
2. Go to **Settings > Environment Variables**
3. Add `STRIPE_WEBHOOK_SECRET` with the value from Step B
4. **Redeploy** your project (Settings > Deployments > Redeploy)

---

## 🧪 **Step 3: End-to-End Testing**

### **A) Test Payment Flow**
1. Visit your live site: `https://your-project-name.vercel.app`
2. Click on a coaching plan
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete the checkout
5. Should redirect to success page

### **B) Verify Webhook Reception**
1. Check Vercel deployment logs for webhook events
2. In Stripe Dashboard > Webhooks, check if events are being delivered
3. Look for `200` status codes (success)

### **C) Test Both Languages**
1. Test the website in English
2. Switch to French using the language toggle
3. Ensure checkout works in both languages

---

## 🚨 **Common Issues & Fixes**

### **Issue 1: Webhook 400/500 Errors**
- **Cause**: Incorrect webhook secret or signature verification
- **Fix**: Double-check `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### **Issue 2: Payment Not Processing**
- **Cause**: Wrong Stripe keys
- **Fix**: Ensure you're using the correct environment keys (test vs live)

### **Issue 3: Redirect After Payment Fails**
- **Cause**: Incorrect `NEXT_PUBLIC_BASE_URL`
- **Fix**: Update to your actual Vercel domain

---

## 🎯 **Next Steps After Testing**

1. **Switch to Live Mode**:
   - Update env vars with `sk_live_` and `pk_live_` keys
   - Create live webhook endpoint
   - Test with real card (small amount)

2. **Set up Email Automation**:
   - Add email service (Resend, SendGrid)
   - Send coaching instructions after payment

3. **Add Calendly Integration**:
   - Embed Calendly for Premium/Premium+ plans
   - Automatic booking link in success page

4. **Analytics & Monitoring**:
   - Add Google Analytics
   - Set up error monitoring (Sentry)

---

## 🔐 **Security Checklist**

✅ Stripe webhook signature verification enabled
✅ Environment variables properly set in Vercel
✅ No secrets committed to GitHub
✅ HTTPS enforced on production domain
✅ Test payment flow working

Your coaching website is ready for business! 🎮⚔️
