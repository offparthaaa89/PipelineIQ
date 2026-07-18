"use client";

import { useEffect, useRef, useState } from "react";
import ContactForm from "@/components/contact/ContactForm";
import ContactList from "@/components/contact/ContactList";
import EmptyState from "@/components/shared/EmptyState";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import StatCard from "@/components/shared/StatCard";
import { supabase } from "@/lib/supabaseClient";
import type { Company } from "@/types/company";
import type { ContactWithCompany, NewContactInput } from "@/types/contact";

export default function ContactsPage() {
  const formPanelRef = useRef<HTMLDivElement | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<ContactWithCompany[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchContactsPageData = async () => {
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
      setError("You must be logged in to view contacts.");
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

    setCompanies((companiesData || []) as Company[]);
    setContacts((contactsData || []) as ContactWithCompany[]);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContactsPageData();
  }, []);

  const filteredContacts = contacts.filter((contact) => {
    if (selectedCompanyId && contact.company_id !== selectedCompanyId) {
      return false;
    }
  
    const fullName = [contact.first_name, contact.last_name]
      .filter(Boolean)
      .join(" ");
  
    const searchableText = [
      fullName,
      contact.email,
      contact.phone,
      contact.job_title,
      contact.status,
      contact.companies?.name,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  
    return searchableText.includes(searchQuery.toLowerCase().trim());
  });

  const activeContacts = contacts.filter(
    (contact) => contact.status === "active"
  ).length;

  const companiesRepresented = new Set(
    contacts.map((contact) => contact.company_id).filter(Boolean)
  ).size;

  const contactsMissingInfo = contacts.filter(
    (contact) => !contact.email || !contact.phone || !contact.job_title
  ).length;

  const handleScrollToForm = () => {
    formPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCreateContact = async (contact: NewContactInput) => {
    const trimmedCompanyId = contact.company_id.trim();
    const trimmedFirstName = contact.first_name.trim();
    const trimmedLastName = contact.last_name.trim();
    const trimmedEmail = contact.email.trim();
    const trimmedPhone = contact.phone.trim();
    const trimmedJobTitle = contact.job_title.trim();

    setError("");
    setSuccessMessage("");

    if (!trimmedCompanyId) {
      setError("Please select a company.");
      return false;
    }

    if (!trimmedFirstName) {
      setError("First name is required.");
      return false;
    }

    if (trimmedFirstName.length < 2) {
      setError("First name must be at least 2 characters.");
      return false;
    }

    if (trimmedEmail) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(trimmedEmail)) {
        setError("Please enter a valid email address.");
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
      setError("You must be logged in to add a contact.");
      setIsSubmitting(false);
      return false;
    }

    const { data, error: insertError } = await supabase
      .from("contacts")
      .insert([
        {
          user_id: user.id,
          company_id: trimmedCompanyId,
          first_name: trimmedFirstName,
          last_name: trimmedLastName || null,
          email: trimmedEmail || null,
          phone: trimmedPhone || null,
          job_title: trimmedJobTitle || null,
        },
      ])
      .select(
        `
        *,
        companies (
          id,
          name
        )
      `
      )
      .single();

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return false;
    }

    setContacts((currentContacts) => [
      data as ContactWithCompany,
      ...currentContacts,
    ]);

    setSuccessMessage("Contact created successfully.");
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
              Contacts
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage people, connect them to companies, and prepare them for
              deal tracking.
            </p>
          </div>

          <button
            type="button"
            onClick={handleScrollToForm}
            className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            + Add Contact
          </button>
        </div>

        {error && <ErrorState message={error} />}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
            {successMessage}
          </div>
        )}

        {isLoading ? (
          <LoadingState message="Loading contacts data..." />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0 space-y-5">
              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                <StatCard
                  label="Total Contacts"
                  value={contacts.length}
                  helperText="People in your CRM"
                />

                <StatCard
                  label="Active Contacts"
                  value={activeContacts}
                  helperText="Currently active"
                />

                <StatCard
                  label="Companies Linked"
                  value={companiesRepresented}
                  helperText="Related accounts"
                />

                <StatCard
                  label="Missing Info"
                  value={contactsMissingInfo}
                  helperText="Need email, phone or role"
                />
              </div>

              {contacts.length === 0 ? (
                <EmptyState
                  title="No contacts yet"
                  description="Add your first contact from the right panel and connect them to a company."
                />
              ) : (
                <ContactList
                  contacts={filteredContacts}
                  totalContacts={contacts.length}
                  companies={companies}
                  selectedCompanyId={selectedCompanyId}
                  onCompanyFilterChange={setSelectedCompanyId}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}

              {contacts.length > 0 && filteredContacts.length === 0 && (
                <EmptyState
                  title="No matching contacts"
                  description="Try searching by name, email, phone, job title or company."
                />
              )}
            </div>

            <aside ref={formPanelRef} className="xl:sticky xl:top-24">
              <ContactForm
                companies={companies}
                onSubmit={handleCreateContact}
                isSubmitting={isSubmitting}
              />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}