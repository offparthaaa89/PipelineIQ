"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState("Checking Supabase connection...");

  useEffect(() => {
    async function testConnection() {
      try {
        const { error } = await supabase.auth.getSession();

        if (error) {
          setConnectionStatus(`Supabase connection failed: ${error.message}`);
          return;
        }

        setConnectionStatus("Supabase connection successful ✅");
      } catch {
        setConnectionStatus("Supabase connection failed ❌");
      }
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-4">PipelineIQ</h1>
        <p className="text-slate-300">{connectionStatus}</p>
      </div>
    </main>
  );
}