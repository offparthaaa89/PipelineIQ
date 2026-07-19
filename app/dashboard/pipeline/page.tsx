"use client";

import { useEffect, useState } from "react";
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

  const fetchPipelineDeals = async () => {
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
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPipelineDeals();
  }, []);

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

    setSuccessMessage("Deal stage updated successfully.");
    setUpdatingDealId(null);
  };

  const openDeals = deals.filter((deal) => deal.status === "open");
  const wonDeals = deals.filter((deal) => deal.status === "won");

  const activePipelineValue = openDeals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );

  const wonValue = wonDeals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-6 text-white md:px-8">
      <section className="w-full">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            PipelineIQ CRM
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
            Sales Pipeline
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Visualize opportunities by stage, review pipeline value, and track
            how deals move from new opportunities to closed outcomes.
          </p>
        </div>

        {error && <ErrorState message={error} />}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
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
                value={deals.length}
                helperText="All opportunities"
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

            {deals.length === 0 ? (
              <EmptyState
                title="No pipeline deals yet"
                description="Create your first deal from the Deals page to start building your pipeline."
              />
            ) : (
              <PipelineBoard
                deals={deals}
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