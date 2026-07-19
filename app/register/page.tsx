"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const benefits = [
  "Track companies, contacts, and deals in one workspace.",
  "Move deals through a clean visual pipeline.",
  "Avoid scattered spreadsheets and missed follow-ups.",
];

const workflowPreview = [
  {
    label: "Companies",
    value: "Accounts",
  },
  {
    label: "Contacts",
    value: "People",
  },
  {
    label: "Deals",
    value: "Opportunities",
  },
];

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const passwordStrength =
    password.length >= 12
      ? "Strong"
      : password.length >= 8
        ? "Good"
        : password.length > 0
          ? "Weak"
          : "Not started";

  const passwordStrengthWidth =
    passwordStrength === "Strong"
      ? "w-full"
      : passwordStrength === "Good"
        ? "w-2/3"
        : passwordStrength === "Weak"
          ? "w-1/3"
          : "w-0";

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    setLoading(true);
    setMessage("");
    setMessageType("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setMessage("Please enter your email address.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setMessageType("error");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    if (error) {
      setMessage(error.message);
      setMessageType("error");
      setLoading(false);
      return;
    }

    setMessage("Account created successfully. Redirecting to login...");
    setMessageType("success");
    setEmail("");
    setPassword("");
    setLoading(false);

    window.setTimeout(() => {
      router.push("/login");
    }, 900);
  }

  return (
    <main className="auth-grid-bg min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none fixed left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-400/20 blur-[130px]" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-600/20 blur-[130px]" />
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[130px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute h-8 w-8 rotate-45 rounded-lg border-2 border-cyan-400/80" />
              <div className="absolute h-4 w-4 rotate-45 rounded bg-cyan-400/20" />
              <span className="relative text-xs font-black text-cyan-300">
                PI
              </span>
            </div>

            <div>
              <p className="text-base font-black uppercase tracking-wide">
                PipelineIQ
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                CRM
              </p>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
          >
            Login
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[1fr_460px]">
          <div className="auth-reveal max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              Start your CRM workspace
            </p>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Build a cleaner sales pipeline from day one.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              Create your PipelineIQ account and start organizing companies,
              contacts, deals, and pipeline stages without messy spreadsheets or
              scattered notes.
            </p>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {workflowPreview.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 text-sm leading-6 text-slate-300"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-400 text-xs font-black text-slate-950">
                    ✓
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

            <div className="auth-float mt-10 hidden max-w-xl rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl lg:block">
              <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Pipeline preview
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      New workspace structure
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    Ready
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          Website CRM Proposal
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Acme Technologies · Qualified
                        </p>
                      </div>

                      <p className="font-black text-cyan-300">₹85,000</p>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="auth-pulse-bar h-full w-2/3 rounded-full bg-cyan-400" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-500">New</p>
                      <p className="mt-1 font-bold text-white">3 deals</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-500">Proposal</p>
                      <p className="mt-1 font-bold text-white">2 deals</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs text-slate-500">Won</p>
                      <p className="mt-1 font-bold text-white">1 deal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleRegister}
            className="auth-glow-card auth-reveal rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl md:p-8"
          >
            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Register
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                Create your account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Start using PipelineIQ to manage your sales workflow with clean,
                connected CRM records.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label className="block text-sm font-semibold text-slate-300">
                    Password
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-xs font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  minLength={8}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full bg-cyan-400 transition-all ${passwordStrengthWidth}`}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Password strength:{" "}
                    <span className="font-semibold text-slate-300">
                      {passwordStrength}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-7 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {message && (
              <p
                aria-live="polite"
                className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                  messageType === "success"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {message}
              </p>
            )}

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-cyan-300 transition hover:text-cyan-200"
              >
                Login
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-slate-600">
              By creating an account, you start a private CRM workspace protected
              by authentication and user-scoped records.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}