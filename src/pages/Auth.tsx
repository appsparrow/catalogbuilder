import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Building, User, Upload, X } from "lucide-react";

interface CompanyProfileData {
  company_name: string;
  contact_person: string;
  email: string;
  logo_url?: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyProfile, setCompanyProfile] = useState<CompanyProfileData>({
    company_name: "",
    contact_person: "",
    email: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      cleanupAuthState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        window.location.href = '/';
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!companyProfile.company_name || !companyProfile.contact_person) {
        throw new Error("Please fill in all company information");
      }

      cleanupAuthState();

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            company_name: companyProfile.company_name,
            contact_person: companyProfile.contact_person,
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Upload logo if provided
        let logoUrl = "";
        if (logoFile) {
          logoUrl = await uploadLogo(logoFile);
        }

        // Create company profile
        const { error: profileError } = await supabase
          .from('company_profiles')
          .insert({
            user_id: data.user.id,
            company_name: companyProfile.company_name,
            contact_person: companyProfile.contact_person,
            email: email,
            logo_url: logoUrl,
          });

        if (profileError) {
          console.error('Error creating company profile:', profileError);
        }

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/lovable-uploads/6487a356-5d35-4050-a2ff-c0bb013f6c1c.png"
            alt="Cuzata logo"
            className="h-16 w-32 object-contain mx-auto mb-4"
          />
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Get Started"}
          </CardTitle>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Create your company account"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name *</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company-name"
                        type="text"
                        value={companyProfile.company_name}
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, company_name: e.target.value }))}
                        className="pl-10"
                        placeholder="Your company name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="contact-person">Contact Person *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact-person"
                        type="text"
                        value={companyProfile.contact_person}
                        onChange={(e) => setCompanyProfile(prev => ({ ...prev, contact_person: e.target.value }))}
                        className="pl-10"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="logo-upload">Company Logo (Optional)</Label>
                    {!logoPreview ? (
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center">
                        <Upload className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          Upload Logo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          Square logo recommended
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-20 h-20 object-contain mx-auto border rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={removeLogo}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}