"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import StatCard from "@/components/shared/StatCard";
import PipelineBoard from "@/components/pipeline/PipelineBoard";
import { supabase } from "@/lib/supabaseClient";
import type { DealStage, DealStatus, DealWithRelations } from "@/types/deal";

const allowedStages: DealStage[] = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

const getStatusFromStage = (stage: DealStage): DealStatus => {
  if (stage === "won") {
    return "won";
  }

  if (stage === "lost") {
    return "lost";
  }

  return "open";
};

const formatStageLabel = (stage: DealStage) => {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
};

const isDealOverdue = (deal: DealWithRelations) => {
  if (!deal.expected_close_date || deal.status !== "open") {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closeDate = new Date(`${deal.expected_close_date}T00:00:00`);

  return closeDate < today;
};

export default function PipelinePage() {
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingDealId, setUpdatingDealId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const fetchPipelineDeals = useCallback(async () => {
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
      setError("You must be logged in to view the pipeline.");
      setIsLoading(false);
      return;
    }

    const { data, error: dealsError } = await supabase
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
      .order("created_at", { ascending: false });

    if (dealsError) {
      setError(dealsError.message);
      setIsLoading(false);
      return;
    }

    setDeals((data || []) as DealWithRelations[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPipelineDeals();
  }, [fetchPipelineDeals]);

  const handleStageChange = async (dealId: string, nextStage: DealStage) => {
    setError("");
    setSuccessMessage("");

    if (updatingDealId) {
      return;
    }

    if (!allowedStages.includes(nextStage)) {
      setError("Invalid pipeline stage selected.");
      return;
    }

    const targetDeal = deals.find((deal) => deal.id === dealId);

    if (!targetDeal) {
      setError("Deal not found in the current pipeline.");
      return;
    }

    if (targetDeal.stage === nextStage) {
      return;
    }

    const previousDeals = deals;
    const nextStatus = getStatusFromStage(nextStage);

    setUpdatingDealId(dealId);

    setDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === dealId
          ? {
              ...deal,
              stage: nextStage,
              status: nextStatus,
              updated_at: new Date().toISOString(),
            }
          : deal
      )
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setDeals(previousDeals);
      setError(userError.message);
      setUpdatingDealId(null);
      return;
    }

    if (!user) {
      setDeals(previousDeals);
      setError("You must be logged in to update a deal stage.");
      setUpdatingDealId(null);
      return;
    }

    const { data, error: updateError } = await supabase
      .from("deals")
      .update({
        stage: nextStage,
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dealId)
      .eq("owner_id", user.id)
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
      .single();

    if (updateError) {
      setDeals(previousDeals);
      setError(updateError.message);
      setUpdatingDealId(null);
      return;
    }

    setDeals((currentDeals) =>
      currentDeals.map((deal) =>
        deal.id === dealId ? (data as DealWithRelations) : deal
      )
    );

    setSuccessMessage(
      `"${targetDeal.title}" moved to ${formatStageLabel(nextStage)}.`
    );
    setUpdatingDealId(null);
  };

  const visibleDeals = deals.filter((deal) => deal.status !== "archived");
  const openDeals = visibleDeals.filter((deal) => deal.status === "open");
  const wonDeals = visibleDeals.filter((deal) => deal.status === "won");
  const lostDeals = visibleDeals.filter((deal) => deal.status === "lost");
  const overdueDeals = openDeals.filter(isDealOverdue);

  const activePipelineValue = openDeals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );

  const wonValue = wonDeals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );

  const closedDealsCount = wonDeals.length + lostDeals.length;
  const winRate =
    closedDealsCount === 0
      ? 0
      : Math.round((wonDeals.length / closedDealsCount) * 100);

  return (
    <main className="crm-page-reveal min-h-screen px-5 py-8 text-white md:px-10">
      <section className="mx-auto max-w-[1800px]">
        <div className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
          <section className="crm-surface rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Pipeline Workspace
                </p>

                <h1 className="mt-4 max-w-4xl text-3xl font-black tracking-tight text-white md:text-5xl">
                  Move opportunities from first signal to closed outcome.
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
                  This board shows where every deal currently sits. Use it to
                  spot stuck opportunities, overdue closes, and the next stage
                  each deal should move into.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/dashboard/deals"
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  Add / Manage Deals
                </Link>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
                >
                  Back to Overview
                </Link>
              </div>
            </div>
          </section>

          <aside className="crm-surface rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Pipeline signal
            </p>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-sm font-bold text-white">Win rate</p>
                <p className="mt-2 text-3xl font-black text-cyan-300">
                  {winRate}%
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Based on won vs lost closed deals.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-sm font-bold text-white">Needs attention</p>
                <p
                  className={`mt-2 text-3xl font-black ${
                    overdueDeals.length > 0 ? "text-amber-300" : "text-emerald-300"
                  }`}
                >
                  {overdueDeals.length}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Open deals past expected close date.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {error && <ErrorState message={error} />}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <LoadingState message="Loading pipeline..." />
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                label="Total Deals"
                value={visibleDeals.length}
                helperText="Visible opportunities"
              />

              <StatCard
                label="Open Deals"
                value={openDeals.length}
                helperText="Active pipeline"
              />

              <StatCard
                label="Active Pipeline"
                value={formatCurrency(activePipelineValue)}
                helperText="Open deal value"
              />

              <StatCard
                label="Won Value"
                value={formatCurrency(wonValue)}
                helperText="Closed successfully"
              />
            </div>

            <section className="crm-surface rounded-[2rem] p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Board rule
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Use stages to show progress, not random labels. Every move
                    should reflect a real sales step.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Open focus
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    New, qualified, proposal, and negotiation are active
                    pipeline stages.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                    Outcome stages
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Won and lost are closed outcomes, but you can still move a
                    deal back if it was marked incorrectly.
                  </p>
                </div>
              </div>
            </section>

            {visibleDeals.length === 0 ? (
              <section className="crm-surface rounded-[2rem] p-6">
                <EmptyState
                  title="No pipeline deals yet"
                  description="Create your first deal from the Deals page to start building your pipeline."
                />

                <div className="mt-5 flex justify-center">
                  <Link
                    href="/dashboard/deals"
                    className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                  >
                    Create First Deal
                  </Link>
                </div>
              </section>
            ) : (
              <PipelineBoard
                deals={visibleDeals}
                updatingDealId={updatingDealId}
                onStageChange={handleStageChange}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}