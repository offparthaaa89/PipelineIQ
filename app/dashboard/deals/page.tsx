"use client";

import { useEffect, useState } from "react";
import DealForm from "@/components/deal/DealForm";
import DealList from "@/components/deal/DealList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import PageHeader from "@/components/shared/PageHeader";
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
     // eslint-disable-next-line react-hooks/set-state-in-effect
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

    setDeals((currentDeals) => [data as DealWithRelations, ...currentDeals]);

    setIsSubmitting(false);
    return true;
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <section className="mx-auto max-w-6xl">
        <PageHeader
          title="Deal Management"
          description="Track sales opportunities, connect them to companies and contacts, and move them through your pipeline."
        />

        {error && <ErrorState message={error} />}

        {isLoading ? (
          <LoadingState message="Loading deals data..." />
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
                <EmptyState
                  title="No deals yet"
                  description="Add your first deal to start tracking your sales pipeline."
                />
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