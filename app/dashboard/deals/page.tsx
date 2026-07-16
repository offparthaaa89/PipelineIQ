"use client";

import { useEffect, useState } from "react";
import DealForm from "@/components/deal/DealForm";
import DealList from "@/components/deal/DealList";
import { supabase } from "@/lib/supabaseClient";
import type { Company } from "@/types/company";
import type { ContactWithCompany } from "@/types/contact";
import type { DealWithRelations, NewDealInput } from "@/types/deal";

export default function DealsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<ContactWithCompany[]>([]);
  const [deals, setDeals] = useState<DealWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchDealsPageData = async () => {
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
      .select(`
        *,
        companies (
          id,
          name
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (contactsError) {
      setError(contactsError.message);
      setIsLoading(false);
      return;
    }

    const { data: dealsData, error: dealsError } = await supabase
      .from("deals")
      .select(`
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
      `)
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
    fetchDealsPageData();
  }, []);

  const handleCreateDeal = async (deal: NewDealInput) => {
    const trimmedCompanyId = deal.company_id.trim();
    const trimmedContactId = deal.contact_id.trim();
    const trimmedTitle = deal.title.trim();
    const trimmedValue = deal.value.trim();
    const parsedValue = Number(trimmedValue);
  
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
  
    if (
      selectedContact &&
      selectedContact.company_id !== trimmedCompanyId
    ) {
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
      setError("You must be logged in to add a deal.");
      setIsSubmitting(false);
      return false;
    }
  
    const dealStatus =
      deal.stage === "won"
        ? "won"
        : deal.stage === "lost"
          ? "lost"
          : "open";
  
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
      .select(`
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
      `)
      .single();
  
    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return false;
    }
  
    setDeals((currentDeals) => [
      data as DealWithRelations,
      ...currentDeals,
    ]);
  
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
            Deal Management
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Track sales opportunities, connect them to companies and contacts,
            and move them through your pipeline.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-lg backdrop-blur">
            Loading deals data...
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-8">
              <DealForm
                companies={companies}
                contacts={contacts}
                onSubmit={handleCreateDeal}
                isSubmitting={isSubmitting}
              />
            </div>

            <div>
              {deals.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
                  <h2 className="text-xl font-semibold text-white">
                    No deals yet
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Add your first deal to start tracking your sales pipeline.
                  </p>
                </div>
              ) : (
                <DealList deals={deals} />
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}