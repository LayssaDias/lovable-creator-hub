import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase, checkUserRole, checkSubscriptionStatus } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        redirectUser(session.user.id);
      }
    });
  }, []);

  const redirectUser = async (userId: string) => {
    const role = await checkUserRole(userId);
    
    if (role === 'admin') {
      navigate('/admin');
      return;
    }

    if (role === 'subscriber') {
      const isActive = await checkSubscriptionStatus(userId);
      if (isActive) {
        navigate('/dashboard');
      } else {
        navigate('/expired');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user) {
      await redirectUser(data.user.id);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Login</h2>

        <label className="block mb-4">
          <span className="text-sm text-muted-foreground">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="seu@exemplo.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-muted-foreground">Senha</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-orange-300"
            placeholder="********"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#fb9064] to-[#f78a39] text-white font-semibold py-2 rounded-lg shadow-sm hover:opacity-95 transition"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Para entrar como admin use <strong>admin@admin.com</strong> / <strong>adminL@yssa123</strong>
        </p>
      </form>
    </div>
  );
}
