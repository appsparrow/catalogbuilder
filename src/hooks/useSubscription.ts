import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
    maxImages: 50,
    maxCatalogs: 5,
    features: [
      'Upload up to 50 images',
      'Create up to 5 catalogs',
      'Basic customer feedback',
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
    maxImages: 1000,
    maxCatalogs: 25,
    features: [
      'Upload up to 1000 images',
      'Create up to 25 catalogs',
      'Advanced customer feedback',
      'Basic analytics',
      'Priority support',
      'Custom branding'
    ],
    stripePriceId: 'price_starter_monthly' // Will be set when Stripe is configured
  }
];

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user subscription from Supabase (handle missing table gracefully)
      let subData = null;
      try {
        const { data, error: subError } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (subError && subError.code !== 'PGRST116') {
          console.warn('Subscription table not found, using default free plan:', subError.message);
        } else {
          subData = data;
        }
      } catch (tableError) {
        console.warn('Subscription table not found, using default free plan:', tableError);
      }

      setSubscription(subData || null);

      // Fetch usage stats
      const [imagesResult, catalogsResult] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('catalogs').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      const currentPlan = subData ? PLANS.find(p => p.id === subData.plan_id) : PLANS[0];
      
      setUsage({
        imageCount: imagesResult.count || 0,
        catalogCount: catalogsResult.count || 0,
        maxImages: currentPlan?.maxImages || 50,
        maxCatalogs: currentPlan?.maxCatalogs || 5
      });

    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Don't show error toast for missing tables, just use defaults
      if (!error.message?.includes('relation') && !error.message?.includes('does not exist')) {
        toast({
          title: 'Error',
          description: 'Failed to load subscription information',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const createCheckoutSession = async (planId: string, couponCode?: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId,
          userId: user.id,
          couponCode: couponCode || null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: 'Error',
        description: 'Failed to start checkout process',
        variant: 'destructive'
      });
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

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      toast({
        title: 'Success',
        description: 'Subscription canceled successfully'
      });

      // Refresh subscription data
      await fetchSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const getCurrentPlan = (): SubscriptionPlan => {
    if (!subscription) return PLANS[0]; // Default to free plan
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

