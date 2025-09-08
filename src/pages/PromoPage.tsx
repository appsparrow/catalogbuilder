import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Gift, Tag } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { isValidPromoCode, getPromoCodeDetails } from '@/utils/promoLinks';

export default function PromoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [couponCode, setCouponCode] = useState<string>('');
  const [isValidCoupon, setIsValidCoupon] = useState<boolean>(false);
  const [couponDetails, setCouponDetails] = useState<any>(null);

  useEffect(() => {
    // Get coupon code from URL parameter
    const code = searchParams.get('code');
    if (code) {
      setCouponCode(code.toUpperCase());
      validateCoupon(code.toUpperCase());
    }
  }, [searchParams]);

  const validateCoupon = async (code: string) => {
    // For now, we'll use a predefined list of valid coupons
    // In production, you'd validate against Stripe API
    const validCoupons = {
      'WELCOME10': { discount: '10%', description: 'Welcome Discount' },
      'SAVE20': { discount: '20%', description: 'First Month Discount' },
      'EARLYBIRD': { discount: '$5 off', description: 'Early Bird Special' },
      'TEST50': { discount: '50%', description: 'Test Discount' }
    };

    const coupon = validCoupons[code as keyof typeof validCoupons];
    if (coupon) {
      setIsValidCoupon(true);
      setCouponDetails(coupon);
      toast.success(`Valid coupon: ${coupon.description}`);
    } else {
      setIsValidCoupon(false);
      setCouponDetails(null);
      toast.error('Invalid or expired coupon code');
    }
  };

  const handleGoToBilling = () => {
    if (couponCode && isValidCoupon) {
      // Navigate to billing page with coupon pre-filled
      navigate(`/billing?coupon=${couponCode}`);
    } else {
      navigate('/billing');
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border shadow-lg">
        <CardContent className="p-8 text-center">
          {/* Header */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Special Offer
            </h1>
            <p className="text-muted-foreground">
              You've been invited to try Cuzata with an exclusive discount!
            </p>
          </div>

          {/* Coupon Display */}
          {couponCode && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Promo Code</span>
              </div>
              
              <div className={`p-4 rounded-lg border-2 ${
                isValidCoupon 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {couponCode}
                </div>
                
                {isValidCoupon && couponDetails ? (
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {couponDetails.discount} OFF
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {couponDetails.description}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-red-600">
                    Invalid or expired code
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">What you get:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Upload up to 1000 images</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Create up to 25 catalogs</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Advanced customer feedback</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Priority support</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleGoToBilling}
            className="w-full"
            size="lg"
          >
            {isValidCoupon ? 'Claim Your Discount' : 'View Plans'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Footer */}
          <div className="mt-6 text-xs text-muted-foreground">
            <p>This offer is valid for new customers only.</p>
            <p>Discount will be applied at checkout.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
