# 🔧 Webhook Testing Guide

## Quick Webhook Test

After deploying to Vercel, you can test your webhooks manually:

### **Method 1: Use Stripe CLI (Recommended)**
```bash
# Install Stripe CLI if not already installed
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Test webhook with your production endpoint
stripe trigger checkout.session.completed --override checkout.session.url=https://your-site.vercel.app/success
```

### **Method 2: Use cURL to Test Webhook Endpoint**
```bash
curl -X POST https://your-site.vercel.app/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "id": "evt_test_webhook",
    "object": "event",
    "type": "checkout.session.completed",
    "data": {
      "object": {
        "id": "cs_test_session",
        "object": "checkout_session",
        "payment_status": "paid"
      }
    }
  }'
```

### **Method 3: Real Test Purchase**
1. Go to your live site
2. Select any plan
3. Use test card: `4242 4242 4242 4242`
4. Complete purchase
5. Check Vercel function logs for webhook events

## Expected Results

✅ **Successful webhook** should show:
- Status 200 in Stripe Dashboard
- "Payment successful!" log in Vercel functions
- Redirect to success page after payment

❌ **Failed webhook** might show:
- Status 400/500 in Stripe Dashboard  
- Error logs in Vercel functions
- Check `STRIPE_WEBHOOK_SECRET` environment variable

## Webhook Payload Example

Your webhook will receive events like this:
```json
{
  "id": "evt_1234567890",
  "object": "event", 
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1b2c3",
      "amount_total": 1500,
      "currency": "eur", 
      "metadata": {
        "plan_id": "simple",
        "plan_name": "Simple Plan"
      },
      "payment_status": "paid"
    }
  }
}
```

This is where you'll add future logic for:
- Sending coaching instructions emails
- Integrating with Calendly for live sessions
- Updating customer records

## Debug Tips

1. **Check Vercel Function Logs**: Dashboard > Functions > View Function Logs
2. **Check Stripe Webhook Logs**: Dashboard > Webhooks > View Details
3. **Test Environment First**: Use test keys before going live
4. **Webhook Secret**: Must match exactly in Vercel environment

Your webhook is the key to automating your coaching business! 🎯
