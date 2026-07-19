"use client";

import Link from "next/link";
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

const contactWorkflowTips = [
  {
    title: "Connect to company",
    description: "Every contact should belong to the correct business account.",
  },
  {
    title: "Add role context",
    description: "Job title helps you understand who influences the deal.",
  },
  {
    title: "Keep reachability clear",
    description: "Email and phone help future follow-ups stay actionable.",
  },
];

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
  const [updatingContactId, setUpdatingContactId] = useState("");

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

  const completedContacts = contacts.filter(
    (contact) => contact.email && contact.phone && contact.job_title
  ).length;

  const completionRate =
    contacts.length > 0
      ? Math.round((completedContacts / contacts.length) * 100)
      : 0;

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

  const handleUpdateContactStatus = async (
    contactId: string,
    nextStatus: ContactWithCompany["status"]
  ) => {
    setError("");
    setSuccessMessage("");
    setUpdatingContactId(contactId);
  
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError) {
      setError(userError.message);
      setUpdatingContactId("");
      return;
    }
  
    if (!user) {
      setError("You must be logged in to update a contact.");
      setUpdatingContactId("");
      return;
    }
  
    const { data, error: updateError } = await supabase
      .from("contacts")
      .update({
        status: nextStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contactId)
      .eq("user_id", user.id)
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
  
    if (updateError) {
      setError(updateError.message);
      setUpdatingContactId("");
      return;
    }
  
    setContacts((currentContacts) =>
      currentContacts.map((contact) =>
        contact.id === contactId ? (data as ContactWithCompany) : contact
      )
    );
  
    setSuccessMessage(
      nextStatus === "archived"
        ? "Contact archived successfully."
        : nextStatus === "inactive"
          ? "Contact marked as inactive."
          : "Contact restored successfully."
    );
  
    setUpdatingContactId("");
  };

  return (
    <main className="crm-page-reveal min-h-screen px-5 py-6 text-white md:px-8">
      <section className="w-full">
        <div className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
          <section className="crm-surface rounded-[2rem] p-6 md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Contact Workspace
                </p>

                <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-white md:text-5xl">
                  Connect the right people to the right companies.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Contacts are the relationship layer of PipelineIQ. Add people
                  under the correct company so every deal has context, ownership,
                  and a clear follow-up path.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
                >
                  + Add Contact
                </button>

                <Link
                  href="/dashboard/deals"
                  className="rounded-xl border border-white/10 px-5 py-3 text-center text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
                >
                  Next: Deals
                </Link>
              </div>
            </div>
          </section>

          <aside className="crm-surface rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Relationship quality
            </p>

            <div className="mt-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-4xl font-black text-white">
                    {completionRate}%
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    contact records complete
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
                  {completedContacts}/{contacts.length}
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
              Always connect a contact to the correct company before creating a
              deal. This keeps your sales relationships clean.
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
          <LoadingState message="Loading contacts data..." />
        ) : (
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
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

              <section className="crm-surface rounded-[2rem] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Contact operating rules
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Keep relationship data useful
                    </h2>
                  </div>

                  <p className="max-w-xl text-sm leading-6 text-slate-400">
                    A contact becomes valuable when you know who they are, which
                    company they belong to, and how to reach them.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {contactWorkflowTips.map((tip) => (
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
                  title="Create a company first"
                  description="Contacts should belong to a company. Add your first company before creating contact records."
                  action={
                    <Link
                      href="/dashboard/companies"
                      className="inline-flex rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
                    >
                      Add Company
                    </Link>
                  }
                />
              ) : contacts.length === 0 ? (
                <EmptyState
                  title="No contacts yet"
                  description="Add your first contact from the right panel and connect them to the correct company."
                />
              ) : filteredContacts.length === 0 ? (
                <EmptyState
                  title="No matching contacts"
                  description="Try searching by name, email, phone, job title, or company."
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
                  updatingContactId={updatingContactId}
                  onStatusChange={handleUpdateContactStatus}
                />
              )}
            </div>

            <aside ref={formPanelRef} className="xl:sticky xl:top-24">
              <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-sm font-black text-cyan-200">
                  Relationship rule
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Add contacts only after selecting the right company. This
                  prevents wrong deal ownership later.
                </p>
              </div>

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