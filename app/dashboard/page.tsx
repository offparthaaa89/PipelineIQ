"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        router.push("/login");
        return;
      }

      setUserEmail(data.session.user.email || "");
      setLoading(false);
    }

    checkSession();
  }, [router]);

  async function handleLogout() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setUserEmail("");
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-slate-300">Checking authentication...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-bold">PipelineIQ Dashboard</h1>

        {message && (
          <p className="mb-4 rounded-xl bg-slate-950 p-3 text-sm text-red-300">
            {message}
          </p>
        )}

        <p className="mb-6 text-slate-300">
          You are logged in as{" "}
          <span className="font-semibold text-blue-400">{userEmail}</span>
        </p>

        <div className="mb-6 rounded-xl border border-slate-800 bg-slate-950 p-6">
          <h2 className="mb-2 text-xl font-semibold">CRM Dashboard</h2>
          <p className="text-slate-400">
            Authentication is working. Later, this page will show leads, deals,
            companies, tasks, and follow-ups.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500"
        >
          Logout
        </button>
      </section>
    </main>
  );
}