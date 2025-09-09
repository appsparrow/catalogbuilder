import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingFooter } from '@/components/LandingFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Share2, 
  MessageSquare, 
  CheckCircle, 
  Upload, 
  Users, 
  CreditCard,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Globe,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [showAllFAQs, setShowAllFAQs] = useState(false);
  
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo-cuzata.png" 
              alt="Cuzata" 
              className="h-8 w-auto"
            />
          </div>
          <nav className="flex items-center space-x-6">
            <Link 
              to="/faq" 
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              FAQ
            </Link>
            <Button 
              onClick={handleGetStarted}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 bg-orange-100 text-orange-800">
              <Zap className="mr-2 h-4 w-4" />
              New: Professional Catalog Management
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              End the Catalog
              <span className="text-orange-600"> Chaos</span>
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              No more WhatsApp PDFs, PowerPoints, or endless email threads. 
              Manage one master catalog, create custom selections for customers, 
              and get instant responses - all in one professional platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required to try
            </p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <div className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-red-600">
              The Old Way
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Managing catalogs was a nightmare
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <FileText className="h-5 w-5 text-red-500" />
                  Multiple Formats
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    PDFs, PowerPoints, WhatsApp files - customers get confused with different formats and versions.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Share2 className="h-5 w-5 text-red-500" />
                  File Sharing Chaos
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Large files clog up email, WhatsApp gets lost, and you're constantly chasing customers for responses.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MessageSquare className="h-5 w-5 text-red-500" />
                  Poor Tracking
                </dt>
                <dd className="mt-4 flex-auto text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    No way to know who saw what, when they responded, or what they actually liked.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Solution Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-green-600">
              The Cuzata Way
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, organized, and effective
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  One Master Catalog
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Maintain one comprehensive catalog. Select specific items to create custom catalogs for each customer.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Share2 className="h-5 w-5 text-green-500" />
                  Web-Based Sharing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Share via simple web links. No large files, no email attachments, no WhatsApp confusion.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  Instant Customer Response
                </dt>
                <dd className="mt-4 flex-auto text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Customers enter their name, select what they like, and you get immediate feedback. No more chasing.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-orange-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-orange-600">
              How It Works
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Just 3 simple steps
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white text-xl font-bold mb-4">
                  1
                </div>
                <dt className="text-lg font-semibold text-gray-900">Select Products</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Choose items from your master catalog to create a custom selection for your customer.
                </dd>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white text-xl font-bold mb-4">
                  2
                </div>
                <dt className="text-lg font-semibold text-gray-900">Share Link</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Send a simple web link. No files, no attachments, no confusion.
                </dd>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white text-xl font-bold mb-4">
                  3
                </div>
                <dt className="text-lg font-semibold text-gray-900">Get Response</dt>
                <dd className="mt-2 text-base text-gray-600">
                  Customer selects what they like and you get instant feedback. Done.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Quick answers to common questions about Cuzata Catalog Builder
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What happens to my data if I cancel?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your data is preserved! When you downgrade to the Free plan, items beyond the Free limits 
                  (4 images, 2 catalogs) are archived for 30 days. You can upgrade within this period to 
                  restore all your data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I delete products used in catalogs?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes, with safeguards. The system warns you that the product is used in specific catalogs. 
                  You can choose to either make it inactive or remove it from all catalogs before deletion.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's the difference between plans?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong>Free Plan:</strong> 4 processed images, 2 catalogs, email support.<br/>
                  <strong>Starter Plan ($10/month):</strong> 6 processed images, 4 catalogs, cancel anytime.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How do I share catalogs with customers?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  After creating a catalog, you get a shareable link. Send this to customers 
                  and they can view, browse products, and provide feedback without creating accounts.
                </p>
              </CardContent>
            </Card>

            {showAllFAQs && (
              <>
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
                    <CardTitle className="text-lg">How do I get started?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Simply sign up with your email, upload your product images, add details, and start creating catalogs. 
                      No credit card required to get started with our free plan.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline"
              onClick={() => setShowAllFAQs(!showAllFAQs)}
              className="text-orange-600 hover:text-orange-700"
            >
              {showAllFAQs ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  View All FAQs
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that fits your business needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-xl">Free Plan</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold">$0<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>4 processed images</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>2 catalogs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Customer feedback</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Starter Plan</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="text-3xl font-bold">$10<span className="text-lg text-gray-500">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>6 processed images</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>4 catalogs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-orange-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to end the catalog chaos?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join the companies that have already streamlined their catalog management with Cuzata.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-6 text-lg"
          >
            Start Your Free Trial
          </Button>
          <p className="mt-4 text-orange-200">
            No credit card required to try
          </p>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
