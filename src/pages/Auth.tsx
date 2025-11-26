import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Backdoor admin login (dev only)
    if (email === "admin@admin.com" && password === "adminL@yssa123") {
      localStorage.setItem("isAdmin", "true");
      // redireciona para a rota principal (/) onde agora está o Profile
      navigate("/");
      return;
    }

    // Fluxo normal de autenticação (mantém código existente)
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        localStorage.removeItem("isAdmin");
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Login</h2>
        <label className="block mb-4">
          <span className="text-sm text-muted-foreground">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2" placeholder="seu@exemplo.com" />
        </label>
        <label className="block mb-4">
          <span className="text-sm text-muted-foreground">Senha</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2" placeholder="********" />
        </label>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[#fb9064] to-[#f78a39] text-white font-semibold py-2 rounded-lg">
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Para entrar como admin use <strong>admin@admin.com</strong> / <strong>adminL@yssa123</strong>
        </p>
      </form>
    </div>
  );
}
