import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ImageDebugger } from '@/components/ImageDebugger';

export const StripeTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testStripeConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Testing Stripe API connection...');
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          planId: 'starter',
          userId: user?.id || 'test-user',
          couponCode: null
        })
      });

      addResult(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        addResult(`Error response: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      addResult(`Success! Response: ${JSON.stringify(data, null, 2)}`);
      
      toast({
        title: 'Success',
        description: 'Stripe API is working correctly',
      });
      
    } catch (error: any) {
      addResult(`Error: ${error.message}`);
      console.error('Stripe test error:', error);
      
      toast({
        title: 'Test Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testEnvironment = () => {
    addResult('Testing environment...');
    addResult(`User authenticated: ${!!user}`);
    addResult(`User ID: ${user?.id || 'Not available'}`);
    addResult(`Current URL: ${window.location.href}`);
    addResult(`API endpoint: /api/create-checkout-session`);
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stripe Test */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-brown">Stripe Integration Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Button 
                onClick={testEnvironment}
                variant="outline"
                className="w-full"
              >
                Test Environment
              </Button>
              
              <Button 
                onClick={testStripeConnection}
                disabled={isLoading || !user}
                className="w-full"
              >
                {isLoading ? 'Testing...' : 'Test Stripe API'}
              </Button>
            </div>

            {testResults.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Test Results:</Label>
                <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">Troubleshooting:</Label>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• <strong>404 Error:</strong> Cloudflare Pages Function not deployed</p>
                <p>• <strong>500 Error:</strong> STRIPE_SECRET_KEY not set in environment variables</p>
                <p>• <strong>Network Error:</strong> Check internet connection</p>
                <p>• <strong>User not authenticated:</strong> Please log in first</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Next Steps:</Label>
              <div className="text-sm text-gray-600 space-y-1">
                <p>1. Deploy your app to Cloudflare Pages</p>
                <p>2. Set STRIPE_SECRET_KEY in Cloudflare Pages environment variables</p>
                <p>3. Run the Stripe setup script: <code>node scripts/setup-stripe-plans.js</code></p>
                <p>4. Test the checkout flow</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Image Debugger */}
        <ImageDebugger />
        </div>
      </div>
    </div>
  );
};
