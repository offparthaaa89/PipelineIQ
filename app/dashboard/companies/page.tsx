"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CompanyForm from "@/components/company/CompanyForm";
import CompanyList from "@/components/company/CompanyList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import StatCard from "@/components/shared/StatCard";
import { supabase } from "@/lib/supabaseClient";
import type { Company, NewCompanyInput } from "@/types/company";

const companyWorkflowTips = [
  {
    title: "Add company first",
    description: "Every contact and deal should connect back to a company.",
  },
  {
    title: "Keep details complete",
    description: "Website, industry, and location make records easier to use.",
  },
  {
    title: "Avoid duplicates",
    description: "Search before adding a company to keep your CRM clean.",
  },
];

export default function CompaniesPage() {
  const formPanelRef = useRef<HTMLDivElement | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingCompanyId, setUpdatingCompanyId] = useState("");

  const fetchCompanies = async () => {
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
      setError("You must be logged in to view companies.");
      setIsLoading(false);
      return;
    }

    const { data, error: companiesError } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (companiesError) {
      setError(companiesError.message);
      setIsLoading(false);
      return;
    }

    setCompanies((data || []) as Company[]);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const searchableText = [
      company.name,
      company.website,
      company.industry,
      company.size,
      company.location,
      company.status,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchQuery.toLowerCase().trim());
  });

  const activeCompanies = companies.filter(
    (company) => company.status === "active"
  ).length;

  const representedIndustries = new Set(
    companies
      .map((company) => company.industry?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const companiesMissingInfo = companies.filter(
    (company) => !company.website || !company.industry || !company.location
  ).length;

  const completedCompanies = companies.filter(
    (company) => company.website && company.industry && company.location
  ).length;

  const completionRate =
    companies.length > 0
      ? Math.round((completedCompanies / companies.length) * 100)
      : 0;

  const handleScrollToForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCreateCompany = async (company: NewCompanyInput) => {
    const trimmedName = company.name.trim();
    const trimmedWebsite = company.website.trim();

    setError("");
    setSuccessMessage("");

    if (!trimmedName) {
      setError("Company name is required.");
      return false;
    }

    if (trimmedName.length < 2) {
      setError("Company name must be at least 2 characters.");
      return false;
    }

    if (trimmedWebsite) {
      try {
        new URL(
          trimmedWebsite.startsWith("http")
            ? trimmedWebsite
            : `https://${trimmedWebsite}`
        );
      } catch {
        setError("Please enter a valid website.");
        return false;
      }
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
      setError("You must be logged in to add a company.");
      setIsSubmitting(false);
      return false;
    }

    const normalizedWebsite = trimmedWebsite
      ? trimmedWebsite.startsWith("http")
        ? trimmedWebsite
        : `https://${trimmedWebsite}`
      : null;

    const { data, error: insertError } = await supabase
      .from("companies")
      .insert([
        {
          user_id: user.id,
          name: trimmedName,
          website: normalizedWebsite,
          industry: company.industry.trim() || null,
          size: company.size.trim() || null,
          location: company.location.trim() || null,
        },
      ])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return false;
    }

    setCompanies((currentCompanies) => [data as Company, ...currentCompanies]);
    setSuccessMessage("Company created successfully.");
    setIsSubmitting(false);
    return true;
  };

  const handleUpdateCompanyStatus = async (
    companyId: string,
    nextStatus: Company["status"]
  ) => {
    setError("");
    setSuccessMessage("");
    setUpdatingCompanyId(companyId);
  
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError) {
      setError(userError.message);
      setUpdatingCompanyId("");
      return;
    }
  
    if (!user) {
      setError("You must be logged in to update a company.");
      setUpdatingCompanyId("");
      return;
    }
  
    const { data, error: updateError } = await supabase
      .from("companies")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", companyId)
      .eq("user_id", user.id)
      .select()
      .single();
  
    if (updateError) {
      setError(updateError.message);
      setUpdatingCompanyId("");
      return;
    }
  
    setCompanies((currentCompanies) =>
      currentCompanies.map((company) =>
        company.id === companyId ? (data as Company) : company
      )
    );
  
    setSuccessMessage(
      nextStatus === "archived"
        ? "Company archived successfully."
        : nextStatus === "inactive"
          ? "Company marked as inactive."
          : "Company restored successfully."
    );
  
    setUpdatingCompanyId("");
  };

  return (
    <main className="crm-page-reveal min-h-screen px-5 py-6 text-white md:px-8">
      <section className="w-full">
        <div className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
          <section className="crm-surface rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Company Workspace
                </p>

                <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                  Build the foundation of your CRM with clean company records.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Companies are the base layer of PipelineIQ. Add the business
                  first, then connect contacts and deals to keep your pipeline
                  organized and easy to understand.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  + Add Company
                </button>

                <Link
                  href="/dashboard/contacts"
                  className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
                >
                  Next: Contacts
                </Link>
              </div>
            </div>
          </section>

          <aside className="crm-surface rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Data quality
            </p>

            <div className="mt-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black text-white">
                    {completionRate}%
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    company records complete
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                  {completedCompanies}/{companies.length}
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-cyan-400 transition-all"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="crm-divider my-5" />

            <p className="text-sm font-bold text-white">Best practice</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Before creating contacts or deals, make sure the company record is
              clear enough for future follow-ups.
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
          <LoadingState message="Loading companies..." />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-5">
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                <StatCard
                  label="Total Companies"
                  value={companies.length}
                  helperText="Business accounts"
                />

                <StatCard
                  label="Active Companies"
                  value={activeCompanies}
                  helperText="Currently active"
                />

                <StatCard
                  label="Industries"
                  value={representedIndustries}
                  helperText="Represented markets"
                />

                <StatCard
                  label="Missing Info"
                  value={companiesMissingInfo}
                  helperText="Need key details"
                />
              </div>

              <section className="crm-surface rounded-[2rem] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Company operating rules
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Keep your account data clean
                    </h2>
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-slate-400">
                    Clean company records reduce confusion when contacts and
                    deals start growing.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {companyWorkflowTips.map((tip) => (
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

              {companies.length === 0 ? (
                <EmptyState
                  title="No companies yet"
                  description="Add your first company from the right panel. This becomes the base record for contacts and deals."
                />
              ) : filteredCompanies.length === 0 ? (
                <EmptyState
                  title="No matching companies"
                  description="Try a different search term or clear the search field."
                />
              ) : (
                <CompanyList
                  companies={filteredCompanies}
                  totalCompanies={companies.length}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  updatingCompanyId={updatingCompanyId}
                  onStatusChange={handleUpdateCompanyStatus}
                />
              )}
            </div>

            <aside ref={formPanelRef} className="xl:sticky xl:top-24">
              <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-black text-cyan-200">
                  Recommended first step
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Add a company before creating contacts or deals. This keeps
                  your CRM relationship structure clean.
                </p>
              </div>

              <CompanyForm
                onSubmit={handleCreateCompany}
                isSubmitting={isSubmitting}
              />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}