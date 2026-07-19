"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DealForm from "@/components/deal/DealForm";
import DealList from "@/components/deal/DealList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import SearchInput from "@/components/shared/SearchInput";
import StatCard from "@/components/shared/StatCard";
import { supabase } from "@/lib/supabaseClient";
import type { Company } from "@/types/company";
import type { ContactWithCompany } from "@/types/contact";
import type {
  DealStage,
  DealStatus,
  DealWithRelations,
  NewDealInput,
} from "@/types/deal";

type SortOption =
  | "newest"
  | "highest-value"
  | "lowest-value"
  | "closest-close-date";

const stageFilters: { label: string; value: "all" | DealStage }[] = [
  { label: "All stages", value: "all" },
  { label: "New", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Proposal", value: "proposal" },
  { label: "Negotiation", value: "negotiation" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
];

const statusFilters: { label: string; value: "all" | DealStatus }[] = [
  { label: "All statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "Won", value: "won" },
  { label: "Lost", value: "lost" },
  { label: "Archived", value: "archived" },
];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest deal", value: "newest" },
  { label: "Highest value", value: "highest-value" },
  { label: "Lowest value", value: "lowest-value" },
  { label: "Closest close date", value: "closest-close-date" },
];

const dealWorkflowTips = [
  {
    title: "Attach the right company",
    description: "Every opportunity should belong to a clear business account.",
  },
  {
    title: "Select a real stage",
    description: "Stage shows where the opportunity sits in the sales process.",
  },
  {
    title: "Track close timing",
    description: "Expected close dates help you prioritize urgent deals.",
  },
];

export default function DealsPage() {
  const formPanelRef = useRef<HTMLDivElement | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<ContactWithCompany[]>([]);
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState<"all" | DealStage>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | DealStatus>(
    "all"
  );
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const fetchDealsPageData = async () => {
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
      setError("You must be logged in to view deals.");
      setIsLoading(false);
      return;
    }

    const { data: companiesData, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (companiesError) {
      setError(companiesError.message);
      setIsLoading(false);
      return;
    }

    const { data: contactsData, error: contactsError } = await supabase
      .from("contacts")
      .select(
        `
        *,
        companies (
          id,
          name
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (contactsError) {
      setError(contactsError.message);
      setIsLoading(false);
      return;
    }

    const { data: dealsData, error: dealsError } = await supabase
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

    setCompanies((companiesData || []) as Company[]);
    setContacts((contactsData || []) as ContactWithCompany[]);
    setDeals((dealsData || []) as DealWithRelations[]);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDealsPageData();
  }, []);

  const openDeals = deals.filter((deal) => deal.status === "open").length;
  const wonDeals = deals.filter((deal) => deal.status === "won").length;
  const lostDeals = deals.filter((deal) => deal.status === "lost").length;

  const totalPipelineValue = deals
    .filter((deal) => deal.status === "open")
    .reduce((total, deal) => total + Number(deal.value || 0), 0);

  const upcomingCloseDates = deals.filter((deal) => {
    if (!deal.expected_close_date || deal.status !== "open") {
      return false;
    }

    const closeDate = new Date(deal.expected_close_date);
    const today = new Date();
    const nextThirtyDays = new Date();
    nextThirtyDays.setDate(today.getDate() + 30);

    return closeDate >= today && closeDate <= nextThirtyDays;
  }).length;

  const winRate =
    wonDeals + lostDeals > 0
      ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100)
      : 0;

  const filteredDeals = [...deals]
    .filter((deal) => {
      const contactName = deal.contacts
        ? [deal.contacts.first_name, deal.contacts.last_name]
            .filter(Boolean)
            .join(" ")
        : "";

      const searchableText = [
        deal.title,
        deal.companies?.name,
        contactName,
        deal.stage,
        deal.status,
        deal.currency,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(searchQuery.toLowerCase().trim());
    })
    .filter((deal) => {
      if (selectedStage === "all") {
        return true;
      }

      return deal.stage === selectedStage;
    })
    .filter((deal) => {
      if (selectedStatus === "all") {
        return true;
      }

      return deal.status === selectedStatus;
    })
    .sort((firstDeal, secondDeal) => {
      if (sortBy === "highest-value") {
        return Number(secondDeal.value || 0) - Number(firstDeal.value || 0);
      }

      if (sortBy === "lowest-value") {
        return Number(firstDeal.value || 0) - Number(secondDeal.value || 0);
      }

      if (sortBy === "closest-close-date") {
        const firstDate = firstDeal.expected_close_date
          ? new Date(firstDeal.expected_close_date).getTime()
          : Number.POSITIVE_INFINITY;

        const secondDate = secondDeal.expected_close_date
          ? new Date(secondDeal.expected_close_date).getTime()
          : Number.POSITIVE_INFINITY;

        return firstDate - secondDate;
      }

      return (
        new Date(secondDeal.created_at).getTime() -
        new Date(firstDeal.created_at).getTime()
      );
    });

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedStage !== "all" ||
    selectedStatus !== "all" ||
    sortBy !== "newest";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedStage("all");
    setSelectedStatus("all");
    setSortBy("newest");
  };

  const handleScrollToForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCreateDeal = async (deal: NewDealInput) => {
    const trimmedCompanyId = deal.company_id.trim();
    const trimmedContactId = deal.contact_id.trim();
    const trimmedTitle = deal.title.trim();
    const trimmedValue = deal.value.trim();
    const parsedValue = Number(trimmedValue);

    setError("");
    setSuccessMessage("");

    const selectedCompany = companies.find(
      (company) => company.id === trimmedCompanyId
    );

    const selectedContact = trimmedContactId
      ? contacts.find((contact) => contact.id === trimmedContactId)
      : null;

    if (!trimmedCompanyId) {
      setError("Please select a company.");
      return false;
    }

    if (!selectedCompany) {
      setError("The selected company is not available.");
      return false;
    }

    if (!trimmedTitle) {
      setError("Deal title is required.");
      return false;
    }

    if (trimmedTitle.length < 3) {
      setError("Deal title must be at least 3 characters.");
      return false;
    }

    if (trimmedTitle.length > 120) {
      setError("Deal title must not exceed 120 characters.");
      return false;
    }

    if (!trimmedValue) {
      setError("Deal value is required.");
      return false;
    }

    if (!Number.isFinite(parsedValue)) {
      setError("Deal value must be a valid number.");
      return false;
    }

    if (parsedValue <= 0) {
      setError("Deal value must be greater than 0.");
      return false;
    }

    if (parsedValue > 9_999_999_999.99) {
      setError("Deal value is too large.");
      return false;
    }

    if (trimmedContactId && !selectedContact) {
      setError("The selected contact is not available.");
      return false;
    }

    if (selectedContact && selectedContact.company_id !== trimmedCompanyId) {
      setError("The selected contact does not belong to this company.");
      return false;
    }

    if (
      deal.expected_close_date &&
      Number.isNaN(new Date(deal.expected_close_date).getTime())
    ) {
      setError("Please select a valid expected close date.");
      return false;
    }

    setIsSubmitting(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      setIsSubmitting(false);
      return false;
    }

    if (!user) {
      setError("You must be logged in to add a deal.");
      setIsSubmitting(false);
      return false;
    }

    const dealStatus =
      deal.stage === "won" ? "won" : deal.stage === "lost" ? "lost" : "open";

    const { data, error: insertError } = await supabase
      .from("deals")
      .insert([
        {
          owner_id: user.id,
          company_id: trimmedCompanyId,
          contact_id: trimmedContactId || null,
          title: trimmedTitle,
          value: parsedValue,
          currency: deal.currency,
          stage: deal.stage,
          status: dealStatus,
          expected_close_date: deal.expected_close_date || null,
        },
      ])
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

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return false;
    }

    setDeals((currentDeals) => [data as DealWithRelations, ...currentDeals]);
    setSuccessMessage("Deal created successfully.");
    setIsSubmitting(false);
    return true;
  };

  return (
    <main className="crm-page-reveal min-h-screen px-5 py-6 text-white md:px-8">
      <section className="w-full">
        <div className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
          <section className="crm-surface rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Deal Workspace
                </p>

                <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                  Turn sales opportunities into a trackable pipeline.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Deals are where company relationships become business value.
                  Track value, stage, contact context, and expected close dates
                  before moving opportunities across the pipeline.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  + Add Deal
                </button>

                <Link
                  href="/dashboard/pipeline"
                  className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
                >
                  Open Pipeline
                </Link>
              </div>
            </div>
          </section>

          <aside className="crm-surface rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Pipeline health
            </p>

            <div className="mt-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black text-white">{winRate}%</p>
                  <p className="mt-1 text-sm text-slate-400">
                    win rate from closed deals
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                  {wonDeals} won / {lostDeals} lost
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${winRate}%` }}
                />
              </div>
            </div>

            <div className="crm-divider my-5" />

            <p className="text-sm font-bold text-white">Urgency signal</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {upcomingCloseDates} open deal
              {upcomingCloseDates === 1 ? "" : "s"} closing within the next 30
              days.
            </p>
          </aside>
        </div>

        {error && <ErrorState message={error} />}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300 shadow-lg shadow-emerald-950/20">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <LoadingState message="Loading deals data..." />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-5">
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                <StatCard
                  label="Total Deals"
                  value={deals.length}
                  helperText="All opportunities"
                />

                <StatCard
                  label="Open Deals"
                  value={openDeals}
                  helperText="Active pipeline"
                />

                <StatCard
                  label="Won Deals"
                  value={wonDeals}
                  helperText="Closed successfully"
                />

                <StatCard
                  label="Open Pipeline"
                  value={formatCurrency(totalPipelineValue)}
                  helperText={`${upcomingCloseDates} closing within 30 days`}
                />
              </div>

              <section className="crm-surface rounded-[2rem] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Deal operating rules
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Keep opportunity tracking clear
                    </h2>
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-slate-400">
                    A useful deal needs a company, a clear value, a stage, and a
                    close target.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {dealWorkflowTips.map((tip) => (
                    <div
                      key={tip.title}
                      className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/45 p-4"
                    >
                      <p className="text-sm font-black text-white">
                        {tip.title}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {deals.length > 0 && (
                <section className="crm-surface rounded-[2rem] p-5">
                  <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        Search and control
                      </p>

                      <h2 className="mt-2 text-xl font-black text-white">
                        Find the right opportunity fast
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        Showing {filteredDeals.length} of {deals.length} deals.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetFilters}
                      disabled={!hasActiveFilters}
                      className="w-fit rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Reset Filters
                    </button>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_180px_180px_220px]">
                    <SearchInput
                      label="Search deals"
                      value={searchQuery}
                      placeholder="Search title, company, contact, stage..."
                      onChange={setSearchQuery}
                    />

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Stage
                      </label>
                      <select
                        value={selectedStage}
                        onChange={(event) =>
                          setSelectedStage(event.target.value as "all" | DealStage)
                        }
                        className="crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition"
                      >
                        {stageFilters.map((stage) => (
                          <option key={stage.value} value={stage.value}>
                            {stage.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Status
                      </label>
                      <select
                        value={selectedStatus}
                        onChange={(event) =>
                          setSelectedStatus(
                            event.target.value as "all" | DealStatus
                          )
                        }
                        className="crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition"
                      >
                        {statusFilters.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-300">
                        Sort
                      </label>
                      <select
                        value={sortBy}
                        onChange={(event) =>
                          setSortBy(event.target.value as SortOption)
                        }
                        className="crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </section>
              )}

              {companies.length === 0 ? (
                <EmptyState
                  title="Create a company first"
                  description="Deals need to be connected to a company. Add your first company before creating deal records."
                  action={
                    <Link
                      href="/dashboard/companies"
                      className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                    >
                      Add Company
                    </Link>
                  }
                />
              ) : deals.length === 0 ? (
                <EmptyState
                  title="No deals yet"
                  description="Add your first deal from the right panel to start tracking sales movement."
                />
              ) : filteredDeals.length === 0 ? (
                <EmptyState
                  title="No matching deals"
                  description="Try a different search term, change your filters, or reset all filters."
                />
              ) : (
                <DealList deals={filteredDeals} />
              )}
            </div>

            <aside ref={formPanelRef} className="xl:sticky xl:top-24">
              <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-black text-cyan-200">
                  Deal creation rule
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Create deals only after selecting the correct company. Contact
                  selection is optional, but helpful for follow-up context.
                </p>
              </div>

              <DealForm
                companies={companies}
                contacts={contacts}
                onSubmit={handleCreateDeal}
                isSubmitting={isSubmitting}
              />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}