import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  CreditCard, 
  Upload, 
  Trash2, 
  Archive, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Lock,
  Database,
  Server,
  Shield
} from 'lucide-react';

export default function Info() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === '2031') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid passcode');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle>Access Information</CardTitle>
            <CardDescription>
              Enter the passcode to access detailed product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="text-center"
              />
              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Access Information
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Product Information & Technical Details</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive technical documentation and user flow details
        </p>
      </div>

      {/* Research & Comparison Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Research & Comparison
          </CardTitle>
          <CardDescription>
            Market research and competitive analysis for catalog management solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Market Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Target Market</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Small to medium furniture retailers</li>
                    <li>• Interior design professionals</li>
                    <li>• Home decor businesses</li>
                    <li>• B2B furniture suppliers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Market Size</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Global furniture market: $700B+</li>
                    <li>• Digital catalog segment: $50B+</li>
                    <li>• Growing 15% annually</li>
                    <li>• High demand for digital solutions</li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold mb-4">Competitive Analysis</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Direct Competitors</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium">Furniture-specific platforms</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• High specialization</li>
                        <li>• Limited customization</li>
                        <li>• High cost ($50-200/month)</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Generic catalog tools</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Low specialization</li>
                        <li>• Complex setup</li>
                        <li>• Poor furniture-specific features</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Our Competitive Advantages</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-medium">Pricing</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Free tier available</li>
                        <li>• $10/month starter plan</li>
                        <li>• No setup fees</li>
                        <li>• Cancel anytime</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium">Features</h5>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Furniture-specific fields</li>
                        <li>• Easy image processing</li>
                        <li>• Customer feedback collection</li>
                        <li>• Shareable catalog links</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed User Flows */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Detailed User Flows & Use Cases</h2>

        {/* Flow 1: New User Journey */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Flow 1: New User Journey (Free Plan)
            </CardTitle>
            <CardDescription>
              Complete workflow from signup to creating first catalog
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">Sign Up & Login</h4>
                  <p className="text-sm text-muted-foreground">
                    User creates account with email/password. Automatically assigned to Free Plan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">Upload Images</h4>
                  <p className="text-sm text-muted-foreground">
                    User drags & drops up to 4 images. Images appear in "Ready to Process" section.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold">Add Product Details</h4>
                  <p className="text-sm text-muted-foreground">
                    For each image, user adds: Product Name, Code, Category, Supplier. 
                    Images move to "Process Images" section.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold">Process Images</h4>
                  <p className="text-sm text-muted-foreground">
                    User clicks "Process Images" button. Images are moved to Products Library.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">5</Badge>
                <div>
                  <h4 className="font-semibold">Create Catalog</h4>
                  <p className="text-sm text-muted-foreground">
                    User selects 2+ products, adds catalog name, and creates catalog. 
                    Catalog appears in Catalog Management section.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">6</Badge>
                <div>
                  <h4 className="font-semibold">Share Catalog</h4>
                  <p className="text-sm text-muted-foreground">
                    User gets shareable link to send to customers. Customers can view and provide feedback.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow 2: Upgrade Journey */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5" />
              Flow 2: Upgrade to Paid Plan
            </CardTitle>
            <CardDescription>
              User upgrades from Free to Starter plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">Hit Free Plan Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    User tries to upload 5th image or create 3rd catalog. System shows upgrade message.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">Click Upgrade Button</h4>
                  <p className="text-sm text-muted-foreground">
                    User clicks "Upgrade to Starter" button. Redirected to Stripe checkout.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold">Complete Payment</h4>
                  <p className="text-sm text-muted-foreground">
                    User enters payment details and completes purchase. Stripe webhook updates user plan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold">Access Expanded Limits</h4>
                  <p className="text-sm text-muted-foreground">
                    User can now upload up to 6 images and create up to 4 catalogs.
                    Any archived items from previous downgrades are restored.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow 3: Downgrade Journey */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5" />
              Flow 3: Downgrade from Paid to Free
            </CardTitle>
            <CardDescription>
              User cancels subscription and downgrades to Free plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-semibold">Cancel Subscription</h4>
                  <p className="text-sm text-muted-foreground">
                    User goes to Billing page and clicks "Cancel Subscription" button.
                    Subscription is set to cancel at period end.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-semibold">Grace Period</h4>
                  <p className="text-sm text-muted-foreground">
                    User retains full access until current billing period ends.
                    Can still use all paid features during this time.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-semibold">Plan Downgrade</h4>
                  <p className="text-sm text-muted-foreground">
                    At period end, user is downgraded to Free plan. 
                    Excess items (beyond Free limits) are archived with 30-day grace period.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-semibold">Limited Access</h4>
                  <p className="text-sm text-muted-foreground">
                    User sees only first 4 images and 2 catalogs. 
                    Upgrade banner shows: "Showing first X of Y items. Upgrade to view all."
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1">5</Badge>
                <div>
                  <h4 className="font-semibold">Archived Items Deletion</h4>
                  <p className="text-sm text-muted-foreground">
                    After 30 days, archived items are permanently deleted.
                    User can upgrade within 30 days to restore all items.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow 4: Product Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Flow 4: Product Management Scenarios
            </CardTitle>
            <CardDescription>
              Different scenarios for managing products and catalogs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Scenario A: Delete Product Not in Any Catalog</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Product can be deleted immediately</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Confirmation dialog appears: "This product is not used in any catalogs"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Product is permanently removed from database</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Scenario B: Delete Product Used in Catalogs</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">System checks if product is used in any catalogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Warning dialog appears: "This product is used in X catalog(s): [Catalog Names]"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">User can choose: "Make Inactive" or "Delete from All Catalogs"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Product is removed from all catalogs and then deleted</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Scenario C: Upload Images Without Processing</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Images remain in "Ready to Process" section</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">User can add details later and process when ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Details are preserved between sessions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">User can delete unprocessed images with X button</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Scenario D: Create Catalog with Insufficient Products</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">"Create Catalog" button is disabled if less than 2 products selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Button becomes active when 2+ products are selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">User must provide catalog name and can add company branding</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow 5: Limit Enforcement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Flow 5: Limit Enforcement & Over-Limit Scenarios
            </CardTitle>
            <CardDescription>
              How the system prevents users from exceeding their plan limits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Image Upload Limits</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Free Plan: Upload blocked after 4 images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Starter Plan: Upload blocked after 6 images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">System shows: "Image limit reached. Upgrade to process X product(s)"</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Catalog Creation Limits</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Free Plan: Creation blocked after 2 catalogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Starter Plan: Creation blocked after 4 catalogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">System shows: "Catalog limit reached. Upgrade to create more catalogs"</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Downgrade Visibility Limits</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Free Plan: Shows only first 4 images and 2 catalogs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Excess items are hidden but not deleted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Upgrade banner: "Showing first X of Y items. Upgrade to view all."</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Flow 6: Data Isolation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Flow 6: Data Isolation & Security
            </CardTitle>
            <CardDescription>
              How user data is kept separate and secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Each user can only see their own products and catalogs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Row-Level Security (RLS) policies enforce data separation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">All database queries automatically filter by user_id</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Admin users have special access to system-wide analytics</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Details */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Technical Architecture</h2>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              System Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Frontend
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• React 18 + TypeScript</li>
                  <li>• Vite build system</li>
                  <li>• Tailwind CSS + Shadcn UI</li>
                  <li>• React Router for navigation</li>
                  <li>• Deployed on Cloudflare Pages</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  Backend
                </h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Supabase (PostgreSQL + Auth)</li>
                  <li>• Cloudflare R2 (Image Storage)</li>
                  <li>• Stripe (Payments & Subscriptions)</li>
                  <li>• Cloudflare Pages Functions (API)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-3">Authentication</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Supabase Auth with JWT tokens</li>
                  <li>• Email/password authentication</li>
                  <li>• Session management</li>
                  <li>• Protected routes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Data Security</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Row-Level Security (RLS) policies</li>
                  <li>• User data isolation</li>
                  <li>• Encrypted data transmission</li>
                  <li>• Secure image storage (R2)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Schema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Core Tables</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <code>users</code> - User authentication data</li>
                  <li>• <code>user_plans</code> - Current subscription plans</li>
                  <li>• <code>products</code> - Processed product images</li>
                  <li>• <code>catalogs</code> - User-created catalogs</li>
                  <li>• <code>catalog_products</code> - Product-catalog relationships</li>
                  <li>• <code>unprocessed_products</code> - Uploaded images pending processing</li>
                  <li>• <code>customer_responses</code> - Customer feedback on catalogs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Key Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Automatic user_id filtering on all queries</li>
                  <li>• Soft delete with archived_at timestamps</li>
                  <li>• 30-day grace period for plan downgrades</li>
                  <li>• Real-time usage tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
