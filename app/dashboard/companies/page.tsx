"use client";

import { useEffect, useState } from "react";
import CompanyForm from "@/components/company/CompanyForm";
import CompanyList from "@/components/company/CompanyList";
import { supabase } from "@/lib/supabaseClient";
import type { Company, NewCompanyInput } from "@/types/company";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

  const handleCreateCompany = async (company: NewCompanyInput) => {
    const trimmedName = company.name.trim();
    const trimmedWebsite = company.website.trim();
  
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
    setError("");
  
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
    setIsSubmitting(false);
    return true;
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            PipelineIQ CRM
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            Company Management
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Create and manage company records before connecting contacts and
            deals to your sales pipeline.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

         <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
         <div className="lg:sticky lg:top-8">
          <CompanyForm
           onSubmit={handleCreateCompany}
           isSubmitting={isSubmitting}
           />
          </div>

        <div>
          {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-lg backdrop-blur">
           Loading companies...
         </div>
            ) : companies.length === 0 ? (
           <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-xl font-semibold text-white">
              No companies yet
             </h2>
            <p className="mt-2 text-sm text-slate-400">
               Add your first company to start building your CRM pipeline.
             </p>
          </div>
         ) : (
          <CompanyList companies={companies} />
            )}
         </div>
     </div>
      </section>
    </main>
  );
}