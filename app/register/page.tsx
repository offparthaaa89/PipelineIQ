"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    console.log("Registered user:", data.user);

    setMessage("Account created successfully. Redirecting to login...");
    setEmail("");
    setPassword("");
    setLoading(false);

    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="mb-2 text-3xl font-bold">Create your account</h1>
        <p className="mb-6 text-sm text-slate-400">
          Start using PipelineIQ to manage your sales pipeline.
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
            placeholder="Create a strong password"
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
          {loading ? "Creating account..." : "Create account"}
        </button>

        {message && (
          <p className="mt-4 rounded-xl bg-slate-950 p-3 text-sm text-slate-300">
            {message}
          </p>
        )}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
         <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300">
           Login
         </Link>
         </p>
      </form>
    </main>
  );
}