"use client";

import { useEffect, useRef, useState } from "react";
import CompanyForm from "@/components/company/CompanyForm";
import CompanyList from "@/components/company/CompanyList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import StatCard from "@/components/shared/StatCard";
import { supabase } from "@/lib/supabaseClient";
import type { Company, NewCompanyInput } from "@/types/company";

export default function CompaniesPage() {
  const formPanelRef = useRef<HTMLDivElement | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-6 text-white md:px-8">
      <section className="w-full">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              PipelineIQ CRM
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Companies
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage and track your companies in your pipeline.
            </p>
          </div>

          <button
            type="button"
            onClick={handleScrollToForm}
            className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            + Add Company
          </button>
        </div>

        {error && <ErrorState message={error} />}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <LoadingState message="Loading companies..." />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
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

              {companies.length === 0 ? (
                <EmptyState
                  title="No companies yet"
                  description="Add your first company from the right panel to start building your CRM pipeline."
                />
              ) : (
                <CompanyList
                  companies={filteredCompanies}
                  totalCompanies={companies.length}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}

              {companies.length > 0 && filteredCompanies.length === 0 && (
                <EmptyState
                  title="No matching companies"
                  description="Try a different search term or clear the search field."
                />
              )}
            </div>

            <aside ref={formPanelRef} className="xl:sticky xl:top-24">
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