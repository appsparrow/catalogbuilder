import { useState } from 'react';
import { useSubscription, PLANS } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, Crown, Zap, Diamond, Smartphone, Github, GitBranch, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function Billing() {
  const { 
    subscription, 
    usage, 
    loading, 
    currentPlan, 
    createCheckoutSession, 
    cancelSubscription,
    getUsagePercentage 
  } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setIsUpgrading(true);
    try {
      await createCheckoutSession(planId, couponCode);
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You\'ll lose access to premium features at the end of your billing period.')) {
      return;
    }

    setIsCanceling(true);
    try {
      await cancelSubscription();
    } catch (error) {
      console.error('Cancel error:', error);
    } finally {
      setIsCanceling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-app-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 mx-auto mb-4 text-brown">⏳</div>
          <h3 className="text-lg font-semibold text-brown">Loading billing information...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b md:sticky md:top-0 z-50 mx-2.5 mt-2.5 rounded-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <img
                src="./logomark-cuzata.png"
                alt="Cuzata logo"
                className="h-10 w-10 rounded-md object-contain"
                loading="lazy"
              />
              <h1 className="text-2xl font-semibold text-brown">Plans & Billing</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/app')}
                className="hover:bg-accent"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/settings')}
                className="hover:bg-accent"
              >
                Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-1 flex shadow-sm">
            <button
              onClick={() => setBillingInterval('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'month'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === 'year'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Coupon Section */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 w-full max-w-md shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-foreground font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Promotional Code
              </h3>
              <button
                onClick={() => setShowCouponInput(!showCouponInput)}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {showCouponInput ? 'Hide' : 'Add Code'}
              </button>
            </div>
            
            {showCouponInput && (
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                />
                {couponCode && (
                  <div className="text-sm text-muted-foreground">
                    Coupon "{couponCode}" will be applied at checkout
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan.id;
            const isFree = plan.id === 'free';
            
            return (
              <Card key={plan.id} className="bg-white/70 backdrop-blur-sm border shadow-sm relative overflow-hidden">
                <CardContent className="p-8">
                  {/* Plan Title */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-foreground mb-1">
                      ${plan.price}
                      <span className="text-lg text-muted-foreground font-normal"> / month</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="text-center mb-8">
                    {isCurrentPlan ? (
                      <Button 
                        disabled 
                        variant="secondary"
                        className="w-full"
                      >
                        Current Active Plan
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isUpgrading}
                        className={`w-full ${
                          isFree 
                            ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        {isUpgrading ? 'Processing...' : isFree ? 'Downgrade to Free' : 'Upgrade to Starter'}
                      </Button>
                    )}
                    
                    {/* Show coupon info for paid plans */}
                    {!isFree && couponCode && (
                      <div className="mt-2 text-center">
                        <div className="text-xs text-muted-foreground">
                          Coupon "{couponCode}" will be applied
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                      {plan.features.map((feature, index) => {
                        // Map features to icons
                        let icon = <Check className="h-4 w-4 text-green-500" />;
                        if (feature.includes('images')) {
                          icon = <Diamond className="h-4 w-4 text-blue-500" />;
                        } else if (feature.includes('catalog')) {
                          icon = <Smartphone className="h-4 w-4 text-purple-500" />;
                        } else if (feature.includes('analytics')) {
                          icon = <Github className="h-4 w-4 text-gray-600" />;
                        } else if (feature.includes('support')) {
                          icon = <GitBranch className="h-4 w-4 text-orange-500" />;
                        }
                        
                        return (
                          <div key={index} className="flex items-center gap-3">
                            {icon}
                            <span className="text-muted-foreground text-sm">{feature}</span>
                          </div>
                        );
                      })}
                  </div>

                  {/* Usage Stats for Current Plan */}
                  {isCurrentPlan && usage && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="text-foreground font-medium mb-4">Current Usage</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Images</span>
                            <span>{usage.imageCount} / {usage.maxImages}</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getUsagePercentage('images')}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Catalogs</span>
                            <span>{usage.catalogCount} / {usage.maxCatalogs}</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getUsagePercentage('catalogs')}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cancel Subscription */}
                  {isCurrentPlan && !isFree && (
                    <div className="mt-6 pt-6 border-t">
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isCanceling}
                        className="w-full"
                      >
                        {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Test Stripe Section */}
        <div className="mt-12 text-center">
          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Test Stripe Integration</h3>
              <p className="text-muted-foreground mb-4">Use Stripe test cards to verify the payment flow</p>
              
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('/stripe-test', '_blank')}
                  className="mr-2"
                >
                  Debug Stripe API
                </Button>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-left">
                <p className="text-sm text-foreground mb-2"><strong>Test Card Numbers:</strong></p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• <code className="bg-background px-2 py-1 rounded">4242 4242 4242 4242</code> - Visa (Success)</p>
                  <p>• <code className="bg-background px-2 py-1 rounded">4000 0000 0000 0002</code> - Visa (Declined)</p>
                  <p>• <code className="bg-background px-2 py-1 rounded">5555 5555 5555 4444</code> - Mastercard (Success)</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Use any future date for expiry and any 3-digit CVC</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

