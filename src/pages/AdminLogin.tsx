import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [granting, setGranting] = useState(false);
  const { signIn, isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin');
    }
  }, [loading, isAdmin, navigate]);

  const handleGrantAdmin = async () => {
    if (!user) return;
    setGranting(true);
    try {
      const { error } = await (supabase as any).rpc('grant_admin', { _user_id: user.id });
      if (error) {
        toast({ title: 'Grant failed', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Admin role granted', description: 'Reloading...' });
        window.location.reload();
      }
    } catch (e: any) {
      toast({ title: 'Grant failed', description: e?.message || 'Unknown error', variant: 'destructive' });
    } finally {
      setGranting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Login error:", error);
        toast({
          title: 'Login Failed',
          description: error.message || "Invalid credentials",
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Login Successful',
          description: 'Redirecting to dashboard...',
        });
        // Navigation happens automatically via the useEffect
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      toast({
        title: 'An error occurred',
        description: 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Initializing application...</p>
      </div>
    );
  }

  // If user is logged in but not admin, show specific message
  if (user && !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-destructive/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription>
              Your account ({user.email}) does not have administrator privileges.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Admin Role Missing</AlertTitle>
              <AlertDescription>
                You are logged in, but the system cannot verify your admin status.
              </AlertDescription>
            </Alert>
            <div className="text-xs font-mono bg-muted p-2 rounded overflow-auto max-h-32">
              User ID: {user.id}
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Please ensure you have run this SQL in the Supabase SQL Editor:
            </p>
            <div className="text-xs font-mono bg-muted p-2 rounded overflow-auto select-all">
              INSERT INTO public.user_roles (user_id, role) VALUES ('{user.id}', 'admin');
            </div>

            <div className="text-sm text-muted-foreground mt-4">
              <p className="font-semibold mb-1">Troubleshooting:</p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Check browser console (F12) for "AuthProvider" logs.</li>
                <li>Verify your User ID matches the one in `auth.users`.</li>
                <li>Ensure the `has_role` database function exists.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
             <Button variant="outline" onClick={() => navigate('/')}>
               Return to Home
             </Button>
             <Button variant="secondary" onClick={() => window.location.reload()}>
               Retry Check
             </Button>
             <Button variant="destructive" size="sm" onClick={() => supabase.auth.signOut()}>
               Sign Out
             </Button>
             <Button variant="default" size="sm" disabled={granting} onClick={handleGrantAdmin}>
               {granting ? 'Granting…' : 'Grant Admin Role'}
             </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10 backdrop-blur-sm bg-background/95">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-primary/5">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="h-11 bg-background/50"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="h-11 pr-10 bg-background/50"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 text-base font-medium shadow-md transition-all hover:shadow-lg mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-muted/20 p-4 rounded-b-xl">
          <Button variant="link" size="sm" className="text-muted-foreground" onClick={() => navigate('/')}>
            ← Back to Website
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
