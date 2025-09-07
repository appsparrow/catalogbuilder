import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm border rounded-lg p-6 bg-white shadow-sm">
        <h1 className="text-xl font-semibold mb-4 text-center">Sign in</h1>
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
          <Button className="w-full" onClick={doSignIn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
          <Button className="w-full" variant="outline" onClick={doSignUp} disabled={loading}>
            Create account
          </Button>
        </div>
      </div>
    </div>
  );
}


