"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HeartHandshake, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const demoAccounts = [
  { role: "elderly", name: "Mrs. Lin", email: "elderly@demo.com", password: "carebridge123" },
  { role: "family", name: "David Lin", email: "family@demo.com", password: "carebridge123" },
  { role: "caregiver", name: "Anna Chen", email: "caregiver@demo.com", password: "carebridge123" },
  { role: "admin", name: "Admin User", email: "admin@demo.com", password: "carebridge123" },
];

const roleLabels = {
  elderly: "Elderly User",
  family: "Family Member",
  caregiver: "Caregiver",
  admin: "Administrator",
};

export default function AuthPage() {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("Mrs. Lin");
  const [email, setEmail] = useState("elderly@demo.com");
  const [password, setPassword] = useState("carebridge123");
  const [role, setRole] = useState<keyof typeof roleLabels>("elderly");
  const [error, setError] = useState("");
  const [showResetHelp, setShowResetHelp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const persistUserSession = (user: { name: string; email: string; role: string }) => {
    localStorage.setItem(
      "carebridge_user",
      JSON.stringify({
        name: user.name,
        email: user.email,
        role: user.role,
      })
    );
    router.push(`/dashboard/${user.role}`);
  };

  const handleDemoLogin = (account: (typeof demoAccounts)[number]) => {
    persistUserSession({
      name: account.name,
      email: account.email,
      role: account.role,
    });
  };

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const demoMatch = demoAccounts.find((account) => account.email === email && account.password === password);
      if (demoMatch) {
        handleDemoLogin(demoMatch);
        return;
      }

      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Email or password incorrect.");
      }

      const data = await response.json();
      const user = data.user ?? {
        full_name: name || "CareBridge User",
        email,
        role,
      };

      persistUserSession({
        name: user.full_name || name || user.email,
        email: user.email || email,
        role: user.role || role,
      });
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Unable to sign in. Please check your account details or create a new account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name || "New CareBridge User",
          email,
          password,
          role,
          preferred_language: "zh-Hant",
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "Registration failed. Please try again.");
      }

      const createdUser = await response.json();
      persistUserSession({
        name: createdUser.full_name || name || createdUser.email,
        email: createdUser.email || email,
        role: createdUser.role || role,
      });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : "Could not create this account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = (nextRole: keyof typeof roleLabels) => {
    setRole(nextRole);
    const account = demoAccounts.find((item) => item.role === nextRole);
    if (account) {
      setName(account.name);
      setEmail(account.email);
      setPassword(account.password);
    } else {
      setEmail("");
      setPassword("");
    }
    setError("");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f7fc] p-5 sm:p-8">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[540px] w-[540px] rounded-full bg-teal-200/40 blur-3xl" />
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-soft">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">CareBridge AI</p>
              <p className="text-sm text-slate-500">AI Elderly Care Coordination</p>
            </div>
          </div>

          <h1 className="max-w-xl text-4xl font-black tracking-[-0.04em] text-slate-900 md:text-6xl">
            Secure, simple access for care teams and families.
          </h1>
          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Designed for older adults, authorized family members, caregivers, and administrators to stay connected while protecting sensitive care information.
          </p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center gap-3 text-brand-700">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-semibold">Demo access</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {demoAccounts.map((account) => (
                <button
                  type="button"
                  key={account.role}
                  onClick={() => handleDemoLogin(account)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-brand-200 hover:bg-brand-50"
                >
                  <p className="font-semibold text-slate-900">{account.name}</p>
                  <p className="text-sm text-slate-500">{roleLabels[account.role as keyof typeof roleLabels]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <Card className="relative border-white/80 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <CardHeader>
            <CardTitle>{isRegistering ? "Create account" : "Welcome back"}</CardTitle>
            <p className="mt-2 text-sm text-slate-500">
              {isRegistering ? "Register a new caregiver, family, or elder profile." : "Sign in to your CareBridge workspace."}
            </p>
          </CardHeader>
          <CardContent>
            <div className="mb-5 flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${!isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${isRegistering ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Register
              </button>
            </div>

            <form className="space-y-5" onSubmit={isRegistering ? handleRegister : handleSignIn}>
              {isRegistering && (
                <div>
                  <label htmlFor="full-name" className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                  <input
                    id="full-name"
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none transition focus:border-brand-500"
                    placeholder="Jane Smith"
                  />
                </div>
              )}

              <div>
                <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(event) => handleRoleChange(event.target.value as keyof typeof roleLabels)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none transition focus:border-brand-500"
                >
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none transition focus:border-brand-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 outline-none transition focus:border-brand-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-500">
                {!isRegistering && (
                  <button type="button" onClick={() => setShowResetHelp(true)} className="font-medium text-brand-600 hover:text-brand-800">
                    Forgot password?
                  </button>
                )}
                <Link href="/" className="font-medium text-slate-600">Back home</Link>
              </div>

              {error && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (isRegistering ? "Creating account..." : "Signing in...") : isRegistering ? "Create account" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {showResetHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowResetHelp(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="reset-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h2 id="reset-title" className="text-xl font-bold text-slate-900">Password reset</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Password reset email is not configured in this demo. Use one of the demo account cards, or create a new account above.</p>
            <Button className="mt-5 w-full" onClick={() => setShowResetHelp(false)}>Got it</Button>
          </section>
        </div>
      )}
    </main>
  );
}
