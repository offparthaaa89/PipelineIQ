"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import PageHeader from "@/components/shared/PageHeader";
import { supabase } from "@/lib/supabaseClient";

const overviewCards = [
  {
    title: "Companies",
    description: "Manage business accounts before linking contacts and deals.",
    href: "/dashboard/companies",
  },
  {
    title: "Contacts",
    description: "Track people connected to your companies and opportunities.",
    href: "/dashboard/contacts",
  },
  {
    title: "Deals",
    description: "Create, view, edit, and manage your sales opportunities.",
    href: "/dashboard/deals",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      setError("");

      const { data, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        setIsLoading(false);
        return;
      }

      if (!data.session) {
        router.push("/login");
        return;
      }

      setUserEmail(data.session.user.email || "Logged-in user");
      setIsLoading(false);
    };

    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <section className="mx-auto max-w-6xl">
        <PageHeader
          title="PipelineIQ Dashboard"
          description="Your CRM command center for managing companies, contacts, and deals."
        />

        {error && <ErrorState message={error} />}

        {isLoading ? (
          <LoadingState message="Checking authentication..." />
        ) : (
          <div className="grid gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="mt-2 text-lg font-semibold text-cyan-300">
                {userEmail}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {overviewCards.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:border-cyan-400/50"
                >
                  <h2 className="text-xl font-semibold text-white">
                    {card.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {card.description}
                  </p>

                  <p className="mt-5 text-sm font-semibold text-cyan-300">
                    Open {card.title} →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}