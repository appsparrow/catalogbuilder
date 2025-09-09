import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                By accessing and using Cuzata Catalog Builder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Cuzata Catalog Builder is a web-based platform that allows users to create, manage, and share product catalogs. The service includes image upload, product management, catalog creation, and customer feedback collection features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Accounts and Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Creation</h3>
                <p className="text-sm text-gray-600">
                  You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Content Responsibility</h3>
                <p className="text-sm text-gray-600">
                  You are solely responsible for all content you upload, including product images, descriptions, and any other materials. You represent and warrant that you have all necessary rights to upload such content.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Content</h3>
                <p className="text-sm text-gray-600">
                  You may not upload content that is illegal, offensive, infringing on intellectual property rights, or violates any applicable laws or regulations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Availability and Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Service Availability</h3>
                <p className="text-sm text-gray-600">
                  We strive to maintain high service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Plan Limits</h3>
                <p className="text-sm text-gray-600">
                  Your use of the service is subject to the limits of your chosen plan. Exceeding these limits may result in restricted access until you upgrade or reduce your usage.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Loss</h3>
                <p className="text-sm text-gray-600">
                  While we implement backup and security measures, we cannot guarantee against data loss. You are responsible for maintaining backups of important data.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment and Billing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Subscription Fees</h3>
                <p className="text-sm text-gray-600">
                  Paid plans are billed monthly in advance. All fees are non-refundable except as required by law.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cancellation</h3>
                <p className="text-sm text-gray-600">
                  You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Price Changes</h3>
                <p className="text-sm text-gray-600">
                  We may change our pricing with 30 days' notice. Existing subscribers will be notified of any changes.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Termination by You</h3>
                <p className="text-sm text-gray-600">
                  You may terminate your account at any time by contacting us or using the account deletion feature.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Termination by Us</h3>
                <p className="text-sm text-gray-600">
                  We reserve the right to suspend or terminate your account immediately, without notice, for:
                </p>
                <ul className="space-y-1 text-sm text-gray-600 ml-4 mt-2">
                  <li>• Violation of these terms of service</li>
                  <li>• Uploading prohibited content</li>
                  <li>• Abuse of the service or other users</li>
                  <li>• Non-payment of fees</li>
                  <li>• Any other reason at our sole discretion</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Effect of Termination</h3>
                <p className="text-sm text-gray-600">
                  Upon termination, your access to the service will cease immediately. We may delete your account and data after a reasonable period, typically 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, CUZATA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
              </p>
              <p className="text-sm text-gray-600">
                Our total liability to you for any claims arising from or relating to the service shall not exceed the amount you paid us for the service in the 12 months preceding the claim.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                You agree to indemnify and hold harmless Cuzata from any claims, damages, or expenses arising from your use of the service, violation of these terms, or infringement of any third-party rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Your continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these terms or your use of the service shall be resolved through binding arbitration.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                If you have any questions about these terms of service, please contact us at:
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
