"use client";

import DeleteDealButton from "@/components/deal/DeleteDealButton";
import DealEditForm from "@/components/deal/DealEditForm";
import { supabase } from "@/lib/supabaseClient";
import type { Company } from "@/types/company";
import type { ContactWithCompany } from "@/types/contact";
import type { DealWithRelations, NewDealInput } from "@/types/deal";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: string | null) => {
  if (!date) {
    return "Not set";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function DealDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const dealId = params.id;

  const [deal, setDeal] = useState<DealWithRelations | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<ContactWithCompany[]>([]);
  const [ownerEmail, setOwnerEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchDealDetail = async () => {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");

      if (!dealId) {
        setError("Invalid deal id.");
        setIsLoading(false);
        return;
      }

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
        router.push("/login");
        return;
      }

      setOwnerEmail(user.email || "Current user");

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

      const { data, error: dealError } = await supabase
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
        .eq("id", dealId)
        .eq("owner_id", user.id)
        .single();

      if (dealError) {
        setError("Deal not found or you do not have access to it.");
        setIsLoading(false);
        return;
      }

      setCompanies((companiesData || []) as Company[]);
      setContacts((contactsData || []) as ContactWithCompany[]);
      setDeal(data as DealWithRelations);
      setIsLoading(false);
    };

    fetchDealDetail();
  }, [dealId, router]);

  const handleUpdateDeal = async (updatedDeal: NewDealInput) => {
    const trimmedCompanyId = updatedDeal.company_id.trim();
    const trimmedContactId = updatedDeal.contact_id.trim();
    const trimmedTitle = updatedDeal.title.trim();
    const trimmedValue = updatedDeal.value.trim();
    const parsedValue = Number(trimmedValue);

    const selectedCompany = companies.find(
      (company) => company.id === trimmedCompanyId
    );

    const selectedContact = trimmedContactId
      ? contacts.find((contact) => contact.id === trimmedContactId)
      : null;

    if (!dealId) {
      setError("Invalid deal id.");
      return false;
    }

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
      updatedDeal.expected_close_date &&
      Number.isNaN(new Date(updatedDeal.expected_close_date).getTime())
    ) {
      setError("Please select a valid expected close date.");
      return false;
    }

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

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
      router.push("/login");
      setIsSubmitting(false);
      return false;
    }

    const dealStatus =
      updatedDeal.stage === "won"
        ? "won"
        : updatedDeal.stage === "lost"
          ? "lost"
          : "open";

    const { data, error: updateError } = await supabase
      .from("deals")
      .update({
        company_id: trimmedCompanyId,
        contact_id: trimmedContactId || null,
        title: trimmedTitle,
        value: parsedValue,
        currency: updatedDeal.currency,
        stage: updatedDeal.stage,
        status: dealStatus,
        expected_close_date: updatedDeal.expected_close_date || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dealId)
      .eq("owner_id", user.id)
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

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return false;
    }

    setDeal(data as DealWithRelations);
    setIsSubmitting(false);
    setIsEditing(false);
    setSuccessMessage("Deal updated successfully.");

    return true;
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    setSuccessMessage("");
  };

  const handleDeleteDeal = async () => {
    setIsDeleting(true);
    setError("");
    setSuccessMessage("");
  
    if (!dealId) {
      setError("Invalid deal id.");
      setIsDeleting(false);
      return false;
    }
  
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if (userError) {
      setError(userError.message);
      setIsDeleting(false);
      return false;
    }
  
    if (!user) {
      router.push("/login");
      setIsDeleting(false);
      return false;
    }
  
    const { error: deleteError } = await supabase
      .from("deals")
      .delete()
      .eq("id", dealId)
      .eq("owner_id", user.id);
  
    if (deleteError) {
      setError(deleteError.message);
      setIsDeleting(false);
      return false;
    }
  
    router.push("/dashboard/deals");
    return true;
  };
  const contactName = deal?.contacts
    ? [deal.contacts.first_name, deal.contacts.last_name]
        .filter(Boolean)
        .join(" ")
    : "No contact selected";

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-white md:px-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/dashboard/deals"
              className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
            >
              ← Back to deals
            </Link>

            <p className="mt-5 text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
              Deal Detail
            </p>

            <h1 className="mt-3 text-3xl font-bold md:text-5xl">
              {deal?.title || "Loading deal..."}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              View the complete sales opportunity, connected company, contact,
              owner, value, stage, and expected close date.
            </p>
          </div>

          {deal && !isEditing && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/50"
              >
                Edit Deal
              </button>

              <DeleteDealButton
                dealTitle={deal.title}
                onDelete={handleDeleteDeal}
                isDeleting={isDeleting}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-200">
            <h2 className="text-lg font-semibold">Unable to load deal</h2>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        )}

        {isLoading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-lg backdrop-blur">
            Loading deal detail...
          </div>
        )}

        {!isLoading && deal && isEditing && (
          <DealEditForm
            deal={deal}
            companies={companies}
            contacts={contacts}
            onSubmit={handleUpdateDeal}
            onCancel={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        )}

        {!isLoading && deal && !isEditing && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {deal.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {deal.companies?.name || "Company not found"}
                  </p>
                </div>

                <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
                  {deal.stage}
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-500">Deal Value</p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {formatCurrency(deal.value, deal.currency)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-500">Expected Close Date</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {formatDate(deal.expected_close_date)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-500">Status</p>
                  <p className="mt-2 text-lg font-semibold capitalize text-white">
                    {deal.status}
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm text-slate-500">Currency</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {deal.currency}
                  </p>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
                <h2 className="text-lg font-semibold text-white">
                  Relationships
                </h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Company</p>
                    <p className="mt-1 font-medium text-white">
                      {deal.companies?.name || "Company not found"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Contact</p>
                    <p className="mt-1 font-medium text-white">
                      {contactName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Owner</p>
                    <p className="mt-1 font-medium text-white">
                      {ownerEmail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
                <h2 className="text-lg font-semibold text-white">Metadata</h2>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500">Created</p>
                    <p className="mt-1 font-medium text-white">
                      {formatDateTime(deal.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Last Updated</p>
                    <p className="mt-1 font-medium text-white">
                      {formatDateTime(deal.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}