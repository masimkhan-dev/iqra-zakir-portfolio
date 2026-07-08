import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    navigate({ to: "/admin", replace: true });
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (res.error) toast.error((res.error as Error).message);
  };

  return (
    <div className="min-h-screen mesh-bg grid place-items-center px-4 py-16">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" /> Back to site</Link>
        <div className="glass rounded-3xl p-8">
          <h1 className="font-display text-3xl">Admin sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your portfolio content.</p>
          <form onSubmit={signIn} className="mt-6 space-y-3">
            <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            <Button type="submit" className="w-full h-11 rounded-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
          <Button variant="outline" className="w-full h-11 rounded-full" onClick={google}>Continue with Google</Button>
          <p className="mt-6 text-xs text-muted-foreground text-center">Public sign-ups are disabled. Contact the site owner for access.</p>
        </div>
      </div>
    </div>
  );
}