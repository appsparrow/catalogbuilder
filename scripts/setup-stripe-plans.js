// Simple Stripe setup script for $10/month Starter Plan
// Run with: node scripts/setup-stripe-plans.js

const Stripe = require('stripe');

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

async function setupPlans() {
  try {
    console.log('🚀 Setting up Stripe plans...');

    // Free Plan (already exists or create if needed)
    const freeProduct = await stripe.products.create({
      name: 'Free Plan',
      description: 'Upload up to 50 images and create up to 5 catalogs to share with your customers.',
      active: true,
      metadata: {
        max_images: '50',
        max_catalogs: '5',
        plan_type: 'free'
      }
    });

    const freePrice = await stripe.prices.create({
      product: freeProduct.id,
      currency: 'usd',
      recurring: { interval: 'month' },
      unit_amount: 0 // $0
    });

    console.log('✅ Free Plan created:', {
      productId: freeProduct.id,
      priceId: freePrice.id
    });

    // Starter Plan - $10/month
    const starterProduct = await stripe.products.create({
      name: 'Starter Plan',
      description: 'For growing businesses that need multiple catalogs. Upload up to 1000 images and create up to 25 catalogs.',
      active: true,
      metadata: {
        max_images: '1000',
        max_catalogs: '25',
        plan_type: 'starter'
      }
    });

    const starterPrice = await stripe.prices.create({
      product: starterProduct.id,
      currency: 'usd',
      recurring: { interval: 'month' },
      unit_amount: 1000 // $10.00
    });

    console.log('✅ Starter Plan created:', {
      productId: starterProduct.id,
      priceId: starterPrice.id
    });

    // Create test coupons
    const coupons = [
      {
        id: 'WELCOME10',
        percent_off: 10,
        duration: 'once',
        name: 'Welcome Discount'
      },
      {
        id: 'SAVE20',
        percent_off: 20,
        duration: 'once',
        name: 'First Month Discount'
      },
      {
        id: 'EARLYBIRD',
        amount_off: 500, // $5.00 in cents
        currency: 'usd',
        duration: 'once',
        name: 'Early Bird Special'
      }
    ];

    for (const couponData of coupons) {
      try {
        const coupon = await stripe.coupons.create(couponData);
        console.log(`✅ Coupon created: ${coupon.id} - ${couponData.name}`);
      } catch (error) {
        console.log(`⚠️  Coupon ${couponData.id} may already exist`);
      }
    }

    console.log('\n🎉 All plans and coupons created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your Cloudflare Pages environment variables:');
    console.log('   - STRIPE_SECRET_KEY: your_stripe_secret_key');
    console.log('2. Update the price IDs in your code:');
    console.log(`   - Free Plan Price ID: ${freePrice.id}`);
    console.log(`   - Starter Plan Price ID: ${starterPrice.id}`);
    console.log('3. Deploy your Cloudflare Pages function');
    console.log('4. Test the checkout flow with coupons!');
    console.log('\n🎫 Test Coupons:');
    console.log('   - WELCOME10: 10% off first payment');
    console.log('   - SAVE20: 20% off first payment');
    console.log('   - EARLYBIRD: $5 off first payment');

  } catch (error) {
    console.error('❌ Error setting up plans:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupPlans();

