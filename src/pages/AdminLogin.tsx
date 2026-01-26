import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, isAdmin, loading, user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (isAdmin) {
        navigate('/admin', { replace: true });
      } else if (user) {
        // User is logged in but NOT admin
        // We do not auto-signout anymore to allow debugging
        // Just show the error state in the UI
      }
    }
  }, [loading, isAdmin, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Login Successful',
          description: 'Redirecting...'
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'An unexpected error occurred',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-background rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
            <p className="font-body text-muted-foreground mt-2">Sign in to manage your site</p>
            {user && !isAdmin && !loading && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                Signed in as {user.email} but unauthorized.<br/>
                Please check your admin role.
                <Button variant="link" onClick={() => signOut()} className="p-0 h-auto ml-1 text-destructive font-bold">Sign Out</Button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-2 block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-body uppercase tracking-widest bg-accent text-accent-foreground hover:bg-accent/90 py-6"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="font-body text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              ← Back to site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
