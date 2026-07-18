"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import PageHeader from "@/components/shared/PageHeader";
import StatCard from "@/components/shared/StatCard";
import { supabase } from "@/lib/supabaseClient";
import type { Company } from "@/types/company";
import type { DealWithRelations } from "@/types/deal";

type DashboardStats = {
  totalCompanies: number;
  totalContacts: number;
  totalDeals: number;
  openPipelineValue: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    totalCompanies: 0,
    totalContacts: 0,
    totalDeals: 0,
    openPipelineValue: 0,
  });
  const [recentCompanies, setRecentCompanies] = useState<Company[]>([]);
  const [recentDeals, setRecentDeals] = useState<DealWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      setIsLoading(false);
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    setUserEmail(user.email || "Logged-in user");

    const [
      companiesResult,
      contactsResult,
      dealsResult,
      recentCompaniesResult,
      recentDealsResult,
    ] = await Promise.all([
      supabase
        .from("companies")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),

      supabase
        .from("deals")
        .select("id,value,status")
        .eq("owner_id", user.id),

      supabase
        .from("companies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),

      supabase
        .from("deals")
        .select(
          `
          *,
          companies (
            id,
            name
          ),
          contacts (
            id,
            first_name,
            last_name
          )
        `
        )
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    if (companiesResult.error) {
      setError(companiesResult.error.message);
      setIsLoading(false);
      return;
    }

    if (contactsResult.error) {
      setError(contactsResult.error.message);
      setIsLoading(false);
      return;
    }

    if (dealsResult.error) {
      setError(dealsResult.error.message);
      setIsLoading(false);
      return;
    }

    if (recentCompaniesResult.error) {
      setError(recentCompaniesResult.error.message);
      setIsLoading(false);
      return;
    }

    if (recentDealsResult.error) {
      setError(recentDealsResult.error.message);
      setIsLoading(false);
      return;
    }

    const deals = dealsResult.data || [];

    const openPipelineValue = deals
      .filter((deal) => deal.status === "open")
      .reduce((total, deal) => total + Number(deal.value || 0), 0);

    setStats({
      totalCompanies: companiesResult.count || 0,
      totalContacts: contactsResult.count || 0,
      totalDeals: deals.length,
      openPipelineValue,
    });

    setRecentCompanies((recentCompaniesResult.data || []) as Company[]);
    setRecentDeals((recentDealsResult.data || []) as DealWithRelations[]);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <section className="mx-auto max-w-7xl">
        <PageHeader
          title="PipelineIQ Dashboard"
          description="Your CRM command center for companies, contacts, deals, and open pipeline value."
          action={
            <Link
              href="/dashboard/deals"
              className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Open Deals
            </Link>
          }
        />

        {error && <ErrorState message={error} />}

        {isLoading ? (
          <LoadingState message="Loading dashboard data..." />
        ) : (
          <div className="grid gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-slate-950/20">
              <p className="text-sm text-slate-400">Signed in as</p>
              <p className="mt-2 break-all text-lg font-semibold text-cyan-300">
                {userEmail}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Total Companies"
                value={stats.totalCompanies}
                helperText="Business accounts in your CRM"
              />

              <StatCard
                label="Total Contacts"
                value={stats.totalContacts}
                helperText="People linked to companies"
              />

              <StatCard
                label="Total Deals"
                value={stats.totalDeals}
                helperText="Opportunities created"
              />

              <StatCard
                label="Open Pipeline"
                value={formatCurrency(stats.openPipelineValue)}
                helperText="Sum of open deal values"
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-slate-950/20">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Recent Companies
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Latest business accounts added to your workspace.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/companies"
                    className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    View all
                  </Link>
                </div>

                {recentCompanies.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm font-semibold text-white">
                      No companies yet
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Add your first company to start building your CRM.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {recentCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="rounded-xl border border-white/10 bg-slate-950/50 p-4"
                      >
                        <p className="font-semibold text-white">
                          {company.name}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          {company.industry || "Industry not added"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-slate-950/20">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Recent Deals
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Latest opportunities moving through your pipeline.
                    </p>
                  </div>

                  <Link
                    href="/dashboard/deals"
                    className="text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                  >
                    View all
                  </Link>
                </div>

                {recentDeals.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm font-semibold text-white">
                      No deals yet
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Create your first deal to track pipeline value.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {recentDeals.map((deal) => (
                      <Link
                        key={deal.id}
                        href={`/dashboard/deals/${deal.id}`}
                        className="rounded-xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-cyan-400/50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-white">
                              {deal.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              {deal.companies?.name || "Company not found"}
                            </p>
                          </div>

                          <p className="shrink-0 text-sm font-bold text-cyan-300">
                            {formatCurrency(Number(deal.value || 0))}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-slate-950/20">
              <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              <p className="mt-1 text-sm text-slate-400">
                Jump directly into the most common CRM workflows.
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <Link
                  href="/dashboard/companies"
                  className="rounded-xl border border-white/10 bg-slate-950/50 p-4 font-semibold text-white transition hover:border-cyan-400/50"
                >
                  Add Company →
                </Link>

                <Link
                  href="/dashboard/contacts"
                  className="rounded-xl border border-white/10 bg-slate-950/50 p-4 font-semibold text-white transition hover:border-cyan-400/50"
                >
                  Add Contact →
                </Link>

                <Link
                  href="/dashboard/deals"
                  className="rounded-xl border border-white/10 bg-slate-950/50 p-4 font-semibold text-white transition hover:border-cyan-400/50"
                >
                  Add Deal →
                </Link>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}