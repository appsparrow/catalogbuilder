import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Helper function to validate UUID
const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid || uuid === '') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  maxImages: number;
  maxCatalogs: number;
  features: string[];
  stripePriceId?: string;
  stripeProductId?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface UsageStats {
  imageCount: number;
  catalogCount: number;
  maxImages: number;
  maxCatalogs: number;
}

// Default plans
export const PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    description: 'Perfect for getting started with basic catalog management',
    price: 0,
    currency: 'usd',
    interval: 'month',
    maxImages: 4,
    maxCatalogs: 2,
    features: [
      'Upload up to 4 images',
      'Create up to 2 catalogs',
      'Customer feedback',
      'Email support'
    ]
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    description: 'For growing businesses that need multiple catalogs',
    price: 10,
    currency: 'usd',
    interval: 'month',
    maxImages: 6,
    maxCatalogs: 4,
    features: [
      'Upload up to 6 images',
      'Create up to 4 catalogs',
      'Customer feedback',
      'Email support'
    ],
    stripePriceId: 'price_starter_monthly' // Will be set when Stripe is configured
  }
];

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch current plan from user_plans (single source of truth)
      let subData = null;
      try {
        console.log('🔍 Fetching user plan for user:', user.id);
        const { data, error: subError } = await supabase
          .from('user_plans')
          .select('*')
          .eq('user_id', user.id)
          .single();

        console.log('🔍 Subscription query result:', { data, error: subError });

        if (subError && subError.code !== 'PGRST116') {
          console.warn('user_plans table not found, falling back to legacy:', subError.message);
        } else {
          subData = data;
          console.log('🔍 Found subscription:', subData);
        }
      } catch (tableError) {
        console.warn('user_plans table not found, using default free plan:', tableError);
      }

      // Map DB record (snake_case) to our interface (camelCase)
      let mappedSub: UserSubscription | null = null;
      if (subData) {
        mappedSub = {
          id: subData.user_id,
          userId: subData.user_id,
          planId: subData.plan_id,
          status: subData.status,
          currentPeriodStart: subData.current_period_start,
          currentPeriodEnd: subData.current_period_end,
          cancelAtPeriodEnd: !!subData.cancel_at_period_end,
          stripeSubscriptionId: subData.stripe_subscription_id || undefined,
          stripeCustomerId: subData.stripe_customer_id || undefined,
        } as UserSubscription;
      }

      setSubscription(mappedSub);

      // Fetch usage stats (only if user is authenticated)
      let imagesResult = { count: 0 };
      let catalogsResult = { count: 0 };
      let unprocessedResult = { count: 0 };
      
      if (isValidUUID(user?.id)) {
        const [imagesRes, catalogsRes, unprocessedRes] = await Promise.all([
          supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id).is('archived_at', null),
          supabase.from('catalogs').select('id', { count: 'exact' }).eq('user_id', user.id).is('archived_at', null),
          supabase.from('unprocessed_products').select('id', { count: 'exact' }).eq('user_id', user.id)
        ]);
        imagesResult = imagesRes;
        catalogsResult = catalogsRes;
        unprocessedResult = unprocessedRes;
      }

      const currentPlan = mappedSub ? PLANS.find(p => p.id === mappedSub.planId) : PLANS[0];
      console.log('🔍 Plan detection:', { 
        subData: mappedSub ? { plan_id: mappedSub.planId } : null, 
        currentPlan: currentPlan?.name,
        availablePlans: PLANS.map(p => ({ id: p.id, name: p.name }))
      });
      
      // Only count processed products as "used" images
      // Unprocessed images don't count against the limit until they're processed
      const processedImageCount = imagesResult.count || 0;
      
      setUsage({
        imageCount: processedImageCount,
        catalogCount: catalogsResult.count || 0,
        maxImages: currentPlan?.maxImages || 50,
        maxCatalogs: currentPlan?.maxCatalogs || 5
      });

      // Note: Archiving logic removed - limits are now enforced at the UI level
      // Users cannot exceed limits, so no archiving is needed

    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Don't show error toast for missing tables, just use defaults
      if (!error.message?.includes('relation') && !error.message?.includes('does not exist')) {
        toast.error('Failed to load subscription information');
      }
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (planId: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId,
          userId: user.id
        })
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session';
        let errorCode = null;
        
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
          errorCode = error.code;
        } catch (parseError) {
          // If response isn't JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error('Stripe API Error:', {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage,
          code: errorCode
        });
        
        // Create error object with code for specific handling
        const error = new Error(errorMessage);
        (error as any).code = errorCode;
        throw error;
      }

      const { url } = await response.json();
      if (!url) {
        throw new Error('No checkout URL returned from server');
      }
      
      window.location.href = url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to start checkout process';
      
      if (error.message?.includes('fetch')) {
        errorMessage = 'Unable to connect to payment server. Please check your internet connection.';
      } else if (error.message?.includes('404')) {
        errorMessage = 'Payment service not available. Please contact support.';
      } else if (error.message?.includes('500')) {
        errorMessage = 'Payment service error. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) {
      throw new Error('No active subscription to cancel');
    }

    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.stripeSubscriptionId })
      });

      // Some runtimes return 204 No Content on success
      if (response.status === 204) {
        toast.success('Subscription canceled successfully');
        await fetchSubscription();
        return;
      }

      if (!response.ok) {
        let message = 'Failed to cancel subscription';
        try {
          const error = await response.json();
          message = error?.message || message;
        } catch {
          // Non-JSON or empty body
          message = `${response.status} ${response.statusText}`.trim();
        }
        throw new Error(message);
      }

      toast.success('Subscription canceled successfully');

      // Refresh subscription data
      await fetchSubscription();

      // On cancel, set archive timers if over limit (done in fetchSubscription)
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error((error as any)?.message || 'Failed to cancel subscription');
      throw error;
    }
  };

  const getCurrentPlan = (): SubscriptionPlan => {
    if (!subscription) return PLANS[0];
    return PLANS.find(p => p.id === subscription.planId) || PLANS[0];
  };

  const canUploadImage = (): boolean => {
    if (!usage) return false;
    return usage.imageCount < usage.maxImages;
  };

  const canCreateCatalog = (): boolean => {
    if (!usage) return false;
    return usage.catalogCount < usage.maxCatalogs;
  };

  const getUsagePercentage = (type: 'images' | 'catalogs'): number => {
    if (!usage) return 0;
    const max = type === 'images' ? usage.maxImages : usage.maxCatalogs;
    const current = type === 'images' ? usage.imageCount : usage.catalogCount;
    return Math.min((current / max) * 100, 100);
  };


  useEffect(() => {
    fetchSubscription();
  }, [user]);

  return {
    subscription,
    usage,
    loading,
    plans: PLANS,
    currentPlan: getCurrentPlan(),
    createCheckoutSession,
    cancelSubscription,
    canUploadImage,
    canCreateCatalog,
    getUsagePercentage,
    refetch: fetchSubscription
  };
};

