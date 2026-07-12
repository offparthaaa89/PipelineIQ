"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const router = useRouter();

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    console.log("Logged in user:", data.user);

    setMessage("Login successful ✅");
    setEmail("");
    setPassword("");
    setLoading(false);
    router.push("/dashboard");
  }
  

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-bold">Login to PipelineIQ</h1>
        <p className="mb-6 text-sm text-slate-400">
          Access your CRM dashboard and manage your sales pipeline.
        </p>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="mt-4 rounded-xl bg-slate-950 p-3 text-sm text-slate-300">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}