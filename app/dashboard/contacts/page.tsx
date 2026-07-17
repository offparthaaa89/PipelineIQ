"use client";

import { useEffect, useState } from "react";
import ContactForm from "@/components/contact/ContactForm";
import ContactList from "@/components/contact/ContactList";
import { supabase } from "@/lib/supabaseClient";
import type { Company } from "@/types/company";
import type { ContactWithCompany, NewContactInput } from "@/types/contact";

export default function ContactsPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<ContactWithCompany[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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

    setCompanies((companiesData || []) as Company[]);
    setContacts((contactsData || []) as ContactWithCompany[]);
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchContactsPageData();
  }, []);

  const handleCreateContact = async (contact: NewContactInput) => {
    const trimmedCompanyId = contact.company_id.trim();
    const trimmedFirstName = contact.first_name.trim();
    const trimmedLastName = contact.last_name.trim();
    const trimmedEmail = contact.email.trim();
    const trimmedPhone = contact.phone.trim();
    const trimmedJobTitle = contact.job_title.trim();
  
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
      .select(`
        *,
        companies (
          id,
          name
        )
      `)
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
            Contact Management
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Add people, connect them to companies, and prepare your CRM for
            deal tracking.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-lg backdrop-blur">
            Loading contacts data...
          </div>
        ) : (
          <div className="grid items-start gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="lg:sticky lg:top-8">
              <ContactForm
                companies={companies}
                onSubmit={handleCreateContact}
                isSubmitting={isSubmitting}
              />
            </div>

            <div>
              {contacts.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
                  <h2 className="text-xl font-semibold text-white">
                    No contacts yet
                  </h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Add your first contact and connect them to a company.
                  </p>
                </div>
              ) : (
                <ContactList contacts={contacts} />
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}