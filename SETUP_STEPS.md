# 🚀 Complete Setup Steps to Fix 500 Error

## 📝 **Step 1: Create Environment File**

Create a `.env.local` file in your project root with:

```env
STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 🔑 **Step 2: Get Your Stripe Keys**

### **A) Sign up for Stripe:**
1. Go to [stripe.com](https://stripe.com) 
2. Create a free account
3. Complete verification (you can use test mode immediately)

### **B) Get your Test API Keys:**
1. In Stripe Dashboard, go to **Developers → API Keys**
2. Copy your **Secret Key** (starts with `sk_test_...`)
3. Replace `sk_test_REPLACE_WITH_YOUR_STRIPE_SECRET_KEY` in `.env.local`

### **C) Get Webhook Secret (Optional for now):**
1. Go to **Developers → Webhooks** 
2. Click **Add endpoint**
3. URL: `http://localhost:3000/api/stripe/webhook`
4. Events: Select `checkout.session.completed` and `payment_intent.succeeded`
5. Copy the webhook secret (starts with `whsec_...`)
6. Replace `whsec_REPLACE_WITH_YOUR_WEBHOOK_SECRET` in `.env.local`

## 🧪 **Step 3: Test the Setup**

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Try purchasing a plan** - it should now work!

3. **Use Stripe test card numbers:**
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)

## ⚠️ **If Still Getting 500 Error:**

Check the terminal/console for specific error messages. Common issues:

- **Invalid API key format** → Double-check you copied the full key
- **Missing STRIPE_SECRET_KEY** → Make sure `.env.local` is in project root
- **Key from wrong environment** → Use test keys that start with `sk_test_`

## ✅ **Once Working:**

Your payment flow will be:
1. Customer clicks plan → Stripe checkout
2. After payment → Redirect to success page
3. You manually follow up with coaching (for now)

**Next phase:** Set up Calendly for live sessions and email automation for replay submissions.

---
**Need help?** Check the browser console and terminal for specific error messages!
