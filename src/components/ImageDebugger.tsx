import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getOptimizedImageUrl, getThumbnailUrl } from '@/utils/imageUtils';

export const ImageDebugger = () => {
  const [testUrl, setTestUrl] = useState('https://pub-7c230797c7d1464c96a7c30a40dc8a4a.r2.dev/unprocessed/unprocessed_1757275048105.jpg');
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testImageUrl = async (url: string, label: string) => {
    try {
      addResult(`Testing ${label}: ${url}`);
      
      const response = await fetch(url, { method: 'HEAD' });
      
      if (response.ok) {
        addResult(`✅ ${label}: SUCCESS (${response.status})`);
        addResult(`   Content-Type: ${response.headers.get('content-type')}`);
        addResult(`   Content-Length: ${response.headers.get('content-length')}`);
      } else {
        addResult(`❌ ${label}: FAILED (${response.status} ${response.statusText})`);
      }
    } catch (error: any) {
      addResult(`❌ ${label}: ERROR - ${error.message}`);
    }
  };

  const runTests = async () => {
    setResults([]);
    addResult('Starting image URL tests...');
    
    // Test original URL
    await testImageUrl(testUrl, 'Original URL');
    
    // Test optimized URL
    const optimizedUrl = getOptimizedImageUrl(testUrl);
    await testImageUrl(optimizedUrl, 'Optimized URL');
    
    // Test thumbnail URL
    const thumbnailUrl = getThumbnailUrl(testUrl);
    await testImageUrl(thumbnailUrl, 'Thumbnail URL');
    
    // Test direct R2 URL (without CDN)
    const directUrl = testUrl.replace('pub-7c230797c7d1464c96a7c30a40dc8a4a.r2.dev', 'pub-7c230797c7d1464c96a7c30a40dc8a4a.r2.cloudflarestorage.com');
    await testImageUrl(directUrl, 'Direct R2 URL');
    
    addResult('Tests completed!');
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-brown">Image URL Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-url">Test Image URL:</Label>
          <Input
            id="test-url"
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
            placeholder="Enter image URL to test"
            className="w-full"
          />
        </div>
        
        <Button onClick={runTests} className="w-full">
          Run Image Tests
        </Button>
        
        {results.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Test Results:</Label>
            <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-700 mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Common Issues:</Label>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• <strong>404 on optimized URLs:</strong> Cloudflare Image Resizing not enabled</p>
            <p>• <strong>404 on original URLs:</strong> Image doesn't exist in R2 bucket</p>
            <p>• <strong>CORS errors:</strong> R2 bucket CORS policy needs updating</p>
            <p>• <strong>403 errors:</strong> R2 bucket permissions issue</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-medium">Solutions:</Label>
          <div className="text-sm text-gray-600 space-y-1">
            <p>1. <strong>Enable Cloudflare Image Resizing:</strong> Go to Cloudflare Dashboard → Speed → Optimization → Image Resizing</p>
            <p>2. <strong>Check R2 bucket:</strong> Verify images exist at the expected paths</p>
            <p>3. <strong>Update CORS policy:</strong> Allow your domain in R2 bucket CORS settings</p>
            <p>4. <strong>Use direct URLs:</strong> Temporarily use original URLs until Image Resizing is fixed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
