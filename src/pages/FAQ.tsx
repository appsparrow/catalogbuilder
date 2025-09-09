import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff
} from 'lucide-react';

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-muted-foreground">
          Quick answers to common questions about Cuzata Catalog Builder
        </p>
      </div>

      {/* Subscription Plans Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Subscription Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Free Plan</h3>
              <ul className="space-y-1 text-sm">
                <li>• 4 processed images maximum</li>
                <li>• 2 catalogs maximum</li>
                <li>• Email support</li>
                <li>• Customer feedback collection</li>
                <li>• No credit card required</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Starter Plan - $10/month</h3>
              <ul className="space-y-1 text-sm">
                <li>• 6 processed images maximum</li>
                <li>• 4 catalogs maximum</li>
                <li>• Email support</li>
                <li>• Customer feedback collection</li>
                <li>• Cancel anytime</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Questions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens to my data if I cancel my subscription?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your data is preserved! When you downgrade to the Free plan, items beyond the Free limits 
              (4 images, 2 catalogs) are archived for 30 days. You can upgrade within this period to 
              restore all your data. After 30 days, archived items are permanently deleted.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Can I delete a product that's used in a catalog?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Yes, but with safeguards. The system will warn you that the product is used in specific catalogs. 
              You can choose to either make it inactive or remove it from all catalogs before deletion. 
              This prevents accidental data loss.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's the difference between unprocessed and processed images?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Unprocessed images:</strong> Just uploaded, no product details added yet. 
              These don't count toward your plan limits.<br/><br/>
              <strong>Processed images:</strong> Have product details (name, code, category, supplier) 
              and count toward your plan limits. These appear in your Products Library.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Can I upgrade and downgrade anytime?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Upgrade:</strong> Yes, immediate effect. You get access to higher limits right away.<br/><br/>
              <strong>Downgrade:</strong> Yes, but takes effect at the end of your current billing period. 
              You keep full access until then, giving you time to adjust your content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens if I exceed my plan limits?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The system prevents you from exceeding limits. You'll see upgrade prompts when you try to 
              upload more images or create more catalogs than your plan allows. On the Free plan, 
              you'll only see items within your limits with an upgrade banner for hidden content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How do I share my catalogs with customers?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              After creating a catalog, you'll get a shareable link. Send this link to your customers 
              and they can view the catalog, browse products, and provide feedback. The link works 
              without requiring customers to create accounts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How do I get detailed technical information?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              For detailed user flows, technical architecture, and comprehensive documentation, 
              visit our <a href="/info" className="text-orange-600 hover:text-orange-700 underline">technical information page</a> 
              with the passcode: <strong>2031</strong>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
