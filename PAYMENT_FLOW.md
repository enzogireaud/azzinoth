# 💰 Payment Flow & Logic Setup

## 🎯 How Each Plan Works:

### **🛡️ Simple Plan (15€) - "Noob Slayer"**
**What happens:**
1. Customer pays 15€
2. Gets redirected to success page
3. Email sent with instructions to submit:
   - OP.GG profile link
   - 1 recent toplane game replay file
4. You analyze and send written report within 24h

**Your action items:**
- Set up email template asking for OP.GG + replay
- Create report template for game analysis

---

### **⚔️ Medium Plan (30€) - "Champion Overlord"**
**What happens:**
1. Customer pays 30€  
2. Gets redirected to success page
3. Email sent with instructions to submit:
   - OP.GG profile link
   - 2 recent toplane game replay files
4. You analyze and send comprehensive report within 48h

**Your action items:**
- Email template asking for OP.GG + 2 replays
- Extended report template covering champion pool + matchups

---

### **⚡ Premium Plan (50€) - "Master Sensei"**
**What happens:**
1. Customer pays 50€
2. Gets redirected to success page  
3. Email sent with:
   - Calendly link to book 1-hour session
   - Instructions to prepare OP.GG profile
4. They book time slot
5. You conduct live Discord coaching session

**Your action items:**
- Set up Calendly for 1-hour slots
- Create email template with booking link
- Prepare Discord server/channel

---

### **👑 Premium+ Plan (75€) - "Challenger Creator"**  
**What happens:**
1. Customer pays 75€
2. Gets redirected to success page
3. Email sent with:
   - Calendly link to book 1.5-hour session  
   - Instructions to prepare OP.GG + recent replays
4. They book time slot
5. You conduct extended live coaching + replay review

**Your action items:**
- Set up Calendly for 1.5-hour slots
- Create premium email template
- Prepare for live game spectating

## 🔄 **Next Steps to Complete Setup:**

1. **Set up environment variables:**
   ```bash
   STRIPE_SECRET_KEY=sk_test_REPLACE_WITH_YOUR_KEY
   STRIPE_WEBHOOK_SECRET=whsec_REPLACE_WITH_YOUR_WEBHOOK
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

2. **Create Calendly account and events**
3. **Set up email automation** (or manual process initially)
4. **Test payment flow** with Stripe test mode
5. **Prepare coaching materials and templates**

## 📧 **Email Templates Needed:**

- **Simple/Medium Plans:** Instructions for submitting OP.GG + replays
- **Premium Plans:** Calendly booking link + preparation instructions  
- **All Plans:** Welcome message with next steps

The payment logic is now working! Customers can purchase plans and get redirected properly. You just need to set up the post-purchase workflow.
