# Stripe Testing Guide

## Quick Setup for Testing

### 1. Get Stripe Test Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 2. Set Up Plans
Run the setup script to create test plans:
```bash
STRIPE_SECRET_KEY=sk_test_your_key_here node scripts/setup-stripe-plans.js
```

### 3. Configure Cloudflare Pages
1. Go to Cloudflare Pages → Your Project → Settings
2. Add Environment Variables:
   - `STRIPE_SECRET_KEY`: `sk_test_your_key_here`
3. Deploy the function

### 4. Test Cards
Use these test card numbers:

| Card Number | Brand | Result |
|-------------|-------|--------|
| `4242 4242 4242 4242` | Visa | ✅ Success |
| `4000 0000 0000 0002` | Visa | ❌ Declined |
| `5555 5555 5555 4444` | Mastercard | ✅ Success |
| `4000 0000 0000 9995` | Visa | ❌ Insufficient funds |

**For all test cards:**
- Use any future date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

### 5. Test Flow
1. Go to `/billing` page
2. Click "Add Code" to enter a coupon (optional)
3. Click "Upgrade to Starter" on the Starter plan
4. Use test card `4242 4242 4242 4242`
5. Complete checkout
6. Check Stripe Dashboard for successful payment

### 6. Test Coupons
Use these test coupon codes:

| Coupon Code | Discount | Description |
|-------------|----------|-------------|
| `WELCOME10` | 10% off | Welcome discount |
| `SAVE20` | 20% off | First month discount |
| `EARLYBIRD` | $5 off | Early bird special |

**Note:** Coupons are applied at checkout and will show the discount in Stripe's checkout session.

### 7. Webhook Testing (Optional)
For production, you'll want to set up webhooks:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe-webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`

## Troubleshooting

### Common Issues
- **"Invalid API key"**: Check your `STRIPE_SECRET_KEY` starts with `sk_test_`
- **"No such price"**: Run the setup script to create plans
- **"Function not found"**: Deploy your Cloudflare Pages function
- **CORS errors**: Make sure you're testing on the deployed domain, not localhost

### Debug Steps
1. Check Cloudflare Pages function logs
2. Verify environment variables are set
3. Test with Stripe CLI: `stripe listen --forward-to localhost:3000`

## Production Checklist
- [ ] Switch to live Stripe keys (`sk_live_`)
- [ ] Update webhook endpoints
- [ ] Test with real payment methods
- [ ] Set up monitoring and alerts

