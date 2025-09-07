import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface ProfileSettings {
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { uploadLogo } = useLogoUpload();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState<ProfileSettings>({
    companyName: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('profile-settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }
  }, []);

  const handleInputChange = (field: keyof ProfileSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Preview the logo
      const reader = new FileReader();
      reader.onload = (e) => {
        setSettings(prev => ({ ...prev, logoUrl: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let logoUrl = settings.logoUrl;
      
      // Upload logo if a new file was selected
      if (logoFile && settings.companyName) {
        logoUrl = await uploadLogo(logoFile, settings.companyName);
      }
      
      const finalSettings = { ...settings, logoUrl };
      
      // Save to localStorage
      localStorage.setItem('profile-settings', JSON.stringify(finalSettings));
      
      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated",
      });
      
      setSettings(finalSettings);
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b md:sticky md:top-0 z-50 mx-2.5 mt-2.5 rounded-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <img
                src="./logomark-cuzata.png"
                alt="Cuzata logo"
                className="h-10 w-10 rounded-md object-contain"
                loading="lazy"
              />
              <h1 className="text-2xl font-semibold text-brown">Settings</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/app')}
                className="hover:bg-accent"
              >
                Back to Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/billing')}
                className="hover:bg-accent"
              >
                Billing
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logo */}
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                {settings.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    alt="Company logo"
                    className="h-16 w-16 object-contain border rounded"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="mb-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    Upload a logo for your company
                  </p>
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={settings.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter your company name"
              />
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="Enter contact email"
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="Enter contact phone number"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
