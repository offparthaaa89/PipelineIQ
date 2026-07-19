"use client";

import DeleteDealButton from "@/components/deal/DeleteDealButton";
import DealEditForm from "@/components/deal/DealEditForm";
import ErrorState from "@/components/shared/ErrorState";
import LoadingState from "@/components/shared/LoadingState";
import StatusBadge from "@/components/shared/StatusBadge";
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

const formatStage = (stage: string) => {
  return stage.replaceAll("_", " ");
};

const getContactName = (deal: DealWithRelations | null) => {
  if (!deal?.contacts) {
    return "No contact selected";
  }

  return [deal.contacts.first_name, deal.contacts.last_name]
    .filter(Boolean)
    .join(" ");
};

const getCloseDateSignal = (deal: DealWithRelations) => {
  if (!deal.expected_close_date) {
    return {
      label: "No target",
      helper: "No expected close date set.",
      className: "border-slate-500/30 bg-slate-500/10 text-slate-400",
    };
  }

  if (deal.status !== "open") {
    return {
      label: "Closed",
      helper: "This deal is no longer active.",
      className: "border-slate-500/30 bg-slate-500/10 text-slate-400",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closeDate = new Date(deal.expected_close_date);
  closeDate.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil(
    (closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return {
      label: "Overdue",
      helper: `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} overdue.`,
      className: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    };
  }

  if (daysLeft === 0) {
    return {
      label: "Due today",
      helper: "Expected to close today.",
      className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    };
  }

  if (daysLeft <= 7) {
    return {
      label: "Due soon",
      helper: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left.`,
      className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    };
  }

  if (daysLeft <= 30) {
    return {
      label: "This month",
      helper: `${daysLeft} days left.`,
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    };
  }

  return {
    label: "Planned",
    helper: `${daysLeft} days left.`,
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  };
};

const getDealReadiness = (deal: DealWithRelations) => {
  const checks = [
    Boolean(deal.companies?.name),
    Boolean(deal.contacts),
    Boolean(deal.expected_close_date),
    Number(deal.value || 0) > 0,
  ];

  const score = checks.filter(Boolean).length;
  const percentage = Math.round((score / checks.length) * 100);

  if (score === checks.length) {
    return {
      score,
      percentage,
      label: "Strong context",
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (score >= 3) {
    return {
      score,
      percentage,
      label: "Good context",
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    };
  }

  return {
    score,
    percentage,
    label: "Needs context",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  };
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

      const { data, error: dealError } = await supabase
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

    setError("");
    setSuccessMessage("");

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

  const contactName = getContactName(deal);
  const closeSignal = deal ? getCloseDateSignal(deal) : null;
  const readiness = deal ? getDealReadiness(deal) : null;

  return (
    <main className="crm-page-reveal min-h-screen px-5 py-6 text-white md:px-8">
      <section className="w-full">
        <div className="mb-6 grid gap-5 xl:grid-cols-[1.35fr_0.75fr]">
          <section className="crm-surface rounded-[2rem] p-6 md:p-8">
            <Link
              href="/dashboard/deals"
              className="inline-flex w-fit items-center rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200"
            >
              ← Back to deals
            </Link>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  Deal Detail
                </p>

                <h1 className="mt-4 max-w-4xl break-words text-3xl font-black tracking-tight text-white md:text-5xl">
                  {deal?.title || "Loading deal..."}
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
                  Review value, stage, relationship context, ownership, and
                  close-date urgency for this opportunity.
                </p>
              </div>

              {deal && !isEditing && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200"
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
          </section>

          <aside className="crm-surface rounded-[2rem] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Deal signal
            </p>

            {deal && closeSignal && readiness ? (
              <>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-4xl font-black text-white">
                      {readiness.percentage}%
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      readiness score
                    </p>
                  </div>

                  <span
                    className={`rounded-2xl border px-3 py-2 text-xs font-bold ${readiness.className}`}
                  >
                    {readiness.label}
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{ width: `${readiness.percentage}%` }}
                  />
                </div>

                <div className="crm-divider my-5" />

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${closeSignal.className}`}
                >
                  {closeSignal.label}
                </span>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {closeSignal.helper}
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-400">
                Loading deal signal...
              </p>
            )}
          </aside>
        </div>

        {error && <ErrorState message={error} />}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-300 shadow-lg shadow-emerald-950/20">
            {successMessage}
          </div>
        )}

        {isLoading && <LoadingState message="Loading deal detail..." />}

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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="min-w-0 space-y-6">
              <section className="crm-surface overflow-hidden rounded-[2rem]">
                <div className="border-b border-white/10 px-6 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        Opportunity overview
                      </p>

                      <h2 className="mt-2 break-words text-2xl font-black text-white">
                        {deal.title}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        {deal.companies?.name || "Company not found"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={formatStage(deal.stage)} />
                      <StatusBadge status={deal.status} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-6 md:grid-cols-2 2xl:grid-cols-4">
                  <div className="crm-card-hover rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Deal Value
                    </p>
                    <p className="mt-3 text-3xl font-black text-white">
                      {formatCurrency(deal.value, deal.currency)}
                    </p>
                  </div>

                  <div className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-500">Expected Close</p>
                    <p className="mt-2 text-lg font-black text-white">
                      {formatDate(deal.expected_close_date)}
                    </p>
                  </div>

                  <div className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-500">Pipeline Stage</p>
                    <p className="mt-2 text-lg font-black capitalize text-white">
                      {formatStage(deal.stage)}
                    </p>
                  </div>

                  <div className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="mt-2 text-lg font-black capitalize text-white">
                      {deal.status}
                    </p>
                  </div>
                </div>
              </section>

              <section className="crm-surface rounded-[2rem] p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                      Connected records
                    </p>

                    <h2 className="mt-2 text-xl font-black text-white">
                      Relationship context
                    </h2>
                  </div>

                  <p className="max-w-lg text-sm leading-6 text-slate-400">
                    This shows which company and person are connected to the
                    opportunity.
                  </p>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Company
                    </p>
                    <p className="mt-3 break-words text-lg font-black text-white">
                      {deal.companies?.name || "Company not found"}
                    </p>
                  </div>

                  <div className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Contact
                    </p>
                    <p className="mt-3 break-words text-lg font-black text-white">
                      {contactName}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside className="space-y-6 xl:sticky xl:top-24">
              <section className="crm-surface rounded-[2rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Ownership
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm text-slate-500">Owner</p>
                    <p className="mt-1 break-words font-bold text-white">
                      {ownerEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Currency</p>
                    <p className="mt-1 font-bold text-white">
                      {deal.currency}
                    </p>
                  </div>

                  {readiness && (
                    <div>
                      <p className="text-sm text-slate-500">Context score</p>
                      <p className="mt-1 font-bold text-white">
                        {readiness.score}/4 checks complete
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="crm-surface rounded-[2rem] p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                  Metadata
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-sm text-slate-500">Created</p>
                    <p className="mt-1 font-bold text-white">
                      {formatDateTime(deal.created_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Last Updated</p>
                    <p className="mt-1 font-bold text-white">
                      {formatDateTime(deal.updated_at)}
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}