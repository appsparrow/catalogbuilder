import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, Share2, MessageSquare, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Cuzata Branding */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/logo-cuzata.png" 
                alt="Cuzata" 
                className="h-12 object-contain"
              />
              <h1 className="text-3xl font-bold text-orange-600 ml-3"></h1>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                to="/research" 
                className="text-orange-700 hover:text-orange-800 font-medium transition-colors"
              >
                Research & Comparison
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              End the Catalog Chaos
            </h1>
            <p className="mt-6 text-xl leading-8 text-gray-600">
              No more WhatsApp PDFs, PowerPoints, or endless email threads. 
              Manage one master catalog, create custom selections for customers, 
              and get instant responses - all in one place.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-6 text-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

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

      {/* CTA Section */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to end the catalog chaos?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the companies that have already streamlined their catalog management with Cuzata.
          </p>
          <Button 
            size="lg"
            onClick={handleGetStarted}
            className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-6 text-lg"
          >
            Start Managing Catalogs Better
          </Button>
        </div>
      </div>

      {/* Removed PIN dialog; using Supabase auth on /login */}
    </div>
  );
}
