import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/logo-cuzata.png" 
              alt="Cuzata" 
              className="h-8 w-auto"
            />
          </div>
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Information</h3>
                <p className="text-sm text-gray-600">
                  We collect your email address and password when you create an account. 
                  This information is used to authenticate you and provide access to our services.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Product Data</h3>
                <p className="text-sm text-gray-600">
                  We store the product images, names, codes, categories, and suppliers you upload 
                  to create your catalogs. This data is private to your account and not shared with other users.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <p className="text-sm text-gray-600">
                  We track basic usage statistics (number of images, catalogs created) to enforce 
                  plan limits and provide customer support.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• To provide and maintain our catalog management services</li>
                <li>• To process payments and manage subscriptions</li>
                <li>• To enforce plan limits and prevent abuse</li>
                <li>• To provide customer support and respond to inquiries</li>
                <li>• To improve our services and develop new features</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                We implement appropriate security measures to protect your personal information:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All data is encrypted in transit and at rest</li>
                <li>• Access to your data is restricted to authorized personnel only</li>
                <li>• We use industry-standard security practices and regular security audits</li>
                <li>• Your data is isolated from other users through secure database policies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We retain your account information and product data as long as your account is active. 
                When you cancel your account, we will delete your personal data within 30 days, 
                except where we are required to retain it for legal or regulatory purposes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                By using our service, you agree to upload only appropriate, legal content:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Content must be related to legitimate business products</li>
                <li>• No illegal, offensive, or inappropriate content</li>
                <li>• No copyrighted material without permission</li>
                <li>• No content that violates any laws or regulations</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                We reserve the right to remove any content that violates these policies and 
                suspend or terminate accounts that repeatedly violate our terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Access your personal data</li>
                <li>• Correct inaccurate information</li>
                <li>• Delete your account and data</li>
                <li>• Export your data</li>
                <li>• Withdraw consent for data processing</li>
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                To exercise these rights, contact us at support@cuzata.com
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We may update this privacy policy from time to time. We will notify you of any 
                changes by posting the new policy on this page and updating the "Last updated" date. 
                Your continued use of our service after any changes constitutes acceptance of the new policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                If you have any questions about this privacy policy or our data practices, 
                please contact us at:
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Email: support@cuzata.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
