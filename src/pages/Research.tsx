import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, Users, Zap, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Research() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/logo-cuzata.png" 
                alt="Cuzata" 
                className="h-10 object-contain"
              />
              <h1 className="text-2xl font-bold text-orange-600 ml-3">Research</h1>
            </div>
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Landing
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cuzata vs. Popular Catalog Management Platforms
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A detailed comparison for small businesses managing 500-1,000 products, 
            focusing on simplicity, mobile-friendliness, and cost-effectiveness.
          </p>
        </div>

        {/* Executive Summary */}
        <Card className="mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Cuzata Advantages</h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Ultra-simple workflow: No training required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Mobile-first: Ideal for furniture/decor companies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Zero file clutter: Always up-to-date selections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                    <span>Instant feedback: See customer preferences immediately</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Ideal Use Cases</h3>
                <ul className="space-y-2 text-sm text-orange-700">
                  <li>• Furniture & decor retailers</li>
                  <li>• Contractors with small catalogs</li>
                  <li>• Product reps needing quick selections</li>
                  <li>• Small businesses frustrated with "catalog chaos"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Comparison Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-900">Feature/Platform</th>
                    <th className="text-left p-3 font-semibold text-orange-600">Cuzata</th>
                    <th className="text-left p-3 font-semibold text-gray-600">Mydoma Studio</th>
                    <th className="text-left p-3 font-semibold text-gray-600">DesignFiles</th>
                    <th className="text-left p-3 font-semibold text-gray-600">Catalog Machine</th>
                    <th className="text-left p-3 font-semibold text-gray-600">Akeneo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Target User</td>
                    <td className="p-3 text-orange-600 font-medium">Small businesses, contractors, interior designers</td>
                    <td className="p-3 text-gray-600">Interior designers & decorators</td>
                    <td className="p-3 text-gray-600">Interior designers & decorators</td>
                    <td className="p-3 text-gray-600">General businesses, product managers</td>
                    <td className="p-3 text-gray-600">B2B, manufacturers, product teams</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Core Features</td>
                    <td className="p-3 text-orange-600 font-medium">Upload images/details, one master catalog, fast selection</td>
                    <td className="p-3 text-gray-600">Product intake, custom lists, mood boards, proposals</td>
                    <td className="p-3 text-gray-600">Mood boards, proposals, multiple catalog sources</td>
                    <td className="p-3 text-gray-600">Database, custom, branded catalogs, advanced inventory</td>
                    <td className="p-3 text-gray-600">Granular product selection/sharing, security controls</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Custom Selection</td>
                    <td className="p-3 text-orange-600 font-medium">Select any category, send only relevant products</td>
                    <td className="p-3 text-gray-600">Create custom product lists</td>
                    <td className="p-3 text-gray-600">Create custom product lists</td>
                    <td className="p-3 text-gray-600">Custom catalogs/proposals per customer</td>
                    <td className="p-3 text-gray-600">Custom online/PDF/Excel catalogs per recipient</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Sharing Method</td>
                    <td className="p-3 text-orange-600 font-medium">Web link, customer enters name, instant feedback</td>
                    <td className="p-3 text-gray-600">Client portal, proposals, invoices, feedback</td>
                    <td className="p-3 text-gray-600">Online view, mood boards, click approvals</td>
                    <td className="p-3 text-gray-600">Online catalogs, PDF/Excel, proposals</td>
                    <td className="p-3 text-gray-600">Secure portal or downloadable catalogs</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Mobile Friendliness</td>
                    <td className="p-3 text-orange-600 font-medium">Yes, optimized for quick browsing</td>
                    <td className="p-3 text-gray-600">Yes, mobile client portal</td>
                    <td className="p-3 text-gray-600">Yes, mobile/web-based</td>
                    <td className="p-3 text-gray-600">Yes, web-based but complex</td>
                    <td className="p-3 text-gray-600">Yes, web-based</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Simplicity</td>
                    <td className="p-3 text-orange-600 font-medium">Very simple (3 steps, no fluff, easy UI)</td>
                    <td className="p-3 text-gray-600">More features, more steps, can feel complex</td>
                    <td className="p-3 text-gray-600">More features, multiple modules, requires onboarding</td>
                    <td className="p-3 text-gray-600">Most complex (inventory, integration, setup)</td>
                    <td className="p-3 text-gray-600">Most complex (roles, permissions, config)</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">Tracking/Feedback</td>
                    <td className="p-3 text-orange-600 font-medium">See likes instantly per customer, easy tracking</td>
                    <td className="p-3 text-gray-600">Track proposals, feedback, project status</td>
                    <td className="p-3 text-gray-600">Track selections, approvals per customer</td>
                    <td className="p-3 text-gray-600">Basic tracking, advanced with integrations</td>
                    <td className="p-3 text-gray-600">Advanced tracking, permissions</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">File Format Issues</td>
                    <td className="p-3 text-orange-600 font-medium">No file clutter, only web links</td>
                    <td className="p-3 text-gray-600">Use portals, may send PDFs for invoices</td>
                    <td className="p-3 text-gray-600">Primarily web, some PDF export</td>
                    <td className="p-3 text-gray-600">Mixed (PDF, Excel, web)</td>
                    <td className="p-3 text-gray-600">Mostly web/PDF/Excel exports</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Comparison */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Pricing Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-800 mb-2">Cuzata</h3>
                <div className="text-2xl font-bold text-orange-600">$10-40</div>
                <div className="text-sm text-orange-600">per month</div>
                <div className="text-xs text-orange-600 mt-2">per business</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Mydoma Studio</h3>
                <div className="text-2xl font-bold text-gray-600">$55-85</div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-600 mt-2">per user</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">DesignFiles</h3>
                <div className="text-2xl font-bold text-gray-600">$35-65</div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-600 mt-2">per user</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Catalog Machine</h3>
                <div className="text-2xl font-bold text-gray-600">$29-99</div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-600 mt-2">depends on features</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Akeneo</h3>
                <div className="text-2xl font-bold text-gray-600">$75-150+</div>
                <div className="text-sm text-gray-600">per month</div>
                <div className="text-xs text-gray-600 mt-2">enterprise</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Cuzata Pros */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Cuzata Pros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>No file chaos - everything stays organized</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>1-click shares - instant catalog delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Instant feedback - see customer preferences immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Simple, mobile-friendly interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                  <span>Minimal setup required</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cuzata Cons */}
          <Card className="bg-red-50 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Cuzata Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-red-700">
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                  <span>No advanced inventory tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                  <span>Limited third-party integrations</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                  <span>Basic analytics and reporting</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                  <span>No advanced project management</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                  <span>Limited branding customization</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Analysis & Recommendations */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Analysis & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-blue-800">
              <div>
                <h3 className="font-semibold mb-2">Cuzata Advantages</h3>
                <p className="text-sm">
                  Ultra-simple workflow with no training required. Mobile-first design ideal for furniture/decor companies. 
                  Zero file clutter ensures customers always get up-to-date selections. Instant feedback streamlines sales.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing Position</h3>
                <p className="text-sm">
                  Given Cuzata's simplicity and focus on straightforward sharing, $10–$40/month per business is competitive 
                  for companies with 500–1,000 products who want an easy, mobile catalog solution without advanced features.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">When to Choose Alternatives</h3>
                <p className="text-sm">
                  If customers demand robust project management, workflow automation, or deep reporting, 
                  point them to more advanced products (with higher prices and complexity).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-orange-800 mb-4">
                Ready to End Your Catalog Chaos?
              </h2>
              <p className="text-orange-700 mb-6">
                Join the companies that have already streamlined their catalog management with Cuzata.
              </p>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                <Zap className="h-5 w-5" />
                Get Started with Cuzata
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
