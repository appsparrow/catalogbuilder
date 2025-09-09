import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Login() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const navigate = useNavigate();

  const doSignIn = async () => {
    setLoading(true);
    setError('');
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate('/app');
    }
  };

  const doSignUp = async () => {
    setLoading(true);
    setError('');
    const { error } = await signUpWithEmail(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      // Depending on email confirmation settings, user may need to confirm
      navigate('/app');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/app`,
    });

    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      setForgotPasswordSent(true);
      toast.success('Password reset email sent! Check your inbox.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="/logo-cuzata.png" 
                alt="Cuzata" 
                className="h-12 w-auto"
              />
            </div>
            <CardTitle className="text-2xl">Welcome to Cuzata</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  {forgotPasswordSent && (
                    <p className="text-sm text-green-600">
                      Password reset email sent! Check your inbox.
                    </p>
                  )}
                  <Button className="w-full" onClick={doSignIn} disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  <Button 
                    variant="link" 
                    className="w-full text-sm" 
                    onClick={handleForgotPassword}
                    disabled={loading}
                  >
                    Forgot your password?
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <Button className="w-full" onClick={doSignUp} disabled={loading}>
                    {loading ? 'Creating account...' : 'Create Account'}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


