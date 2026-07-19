"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Company } from "@/types/company";
import type { ContactWithCompany } from "@/types/contact";
import type {
  DealCurrency,
  DealStage,
  DealWithRelations,
  NewDealInput,
} from "@/types/deal";

type DealEditFormProps = {
  deal: DealWithRelations;
  companies: Company[];
  contacts: ContactWithCompany[];
  onSubmit: (deal: NewDealInput) => Promise<boolean>;
  onCancel: () => void;
  isSubmitting: boolean;
};

const dealStages: DealStage[] = [
  "new",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

const currencies: DealCurrency[] = ["INR", "USD", "EUR", "GBP"];

const inputClass =
  "crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60";

const formatStageLabel = (stage: DealStage) => {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
};

const formatCurrencyPreview = (value: string, currency: DealCurrency) => {
  const numericValue = Number(value);

  if (!value || !Number.isFinite(numericValue)) {
    return "No value entered";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

export default function DealEditForm({
  deal,
  companies,
  contacts,
  onSubmit,
  onCancel,
  isSubmitting,
}: DealEditFormProps) {
  const [formData, setFormData] = useState<NewDealInput>({
    company_id: deal.company_id,
    contact_id: deal.contact_id || "",
    title: deal.title,
    value: String(deal.value),
    currency: deal.currency,
    stage: deal.stage,
    expected_close_date: deal.expected_close_date || "",
  });

  const handleChange = <K extends keyof NewDealInput>(
    field: K,
    value: NewDealInput[K]
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const selectedCompany = companies.find(
    (company) => company.id === formData.company_id
  );

  const selectedContact = contacts.find(
    (contact) => contact.id === formData.contact_id
  );

  const filteredContacts = formData.company_id
    ? contacts.filter((contact) => contact.company_id === formData.company_id)
    : [];

  const completedFields = [
    formData.company_id,
    formData.title,
    formData.value,
    formData.stage,
    formData.expected_close_date,
  ].filter((value) => value.trim().length > 0).length;

  const progressPercentage = Math.round((completedFields / 5) * 100);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="crm-surface rounded-[2rem] p-6">
      <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Edit opportunity
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">Edit Deal</h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Update the sales opportunity while keeping company, contact, value,
            stage, and close-date context consistent.
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Current value
          </p>
          <p className="mt-1 text-xl font-black text-white">
            {formatCurrencyPreview(formData.value, formData.currency)}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-white">Deal readiness</p>

          <span className="text-xs font-black text-cyan-300">
            {progressPercentage}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="mt-2 text-xs leading-5 text-slate-500">
          Strong deals have a company, title, value, stage, and expected close
          date.
        </p>
      </div>

      {companies.length === 0 && (
        <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p className="text-sm font-black text-amber-300">
            No companies available
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Deals must stay connected to a company. Add a company before
            updating this relationship.
          </p>

          <Link
            href="/dashboard/companies"
            className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-200"
          >
            Add Company
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Company *
          </label>

          <select
            value={formData.company_id}
            onChange={(event) => {
              handleChange("company_id", event.target.value);
              handleChange("contact_id", "");
            }}
            disabled={isSubmitting || companies.length === 0}
            className={inputClass}
          >
            <option value="">Select a company</option>

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          {selectedCompany ? (
            <p className="mt-2 text-xs text-cyan-300">
              Deal is linked to {selectedCompany.name}.
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              Choose the account this opportunity belongs to.
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Contact
          </label>

          <select
            value={formData.contact_id}
            onChange={(event) => handleChange("contact_id", event.target.value)}
            disabled={!formData.company_id || isSubmitting}
            className={inputClass}
          >
            <option value="">
              {formData.company_id
                ? "No contact selected"
                : "Select a company first"}
            </option>

            {filteredContacts.map((contact) => {
              const fullName = [contact.first_name, contact.last_name]
                .filter(Boolean)
                .join(" ");

              return (
                <option key={contact.id} value={contact.id}>
                  {fullName}
                </option>
              );
            })}
          </select>

          {selectedContact ? (
            <p className="mt-2 text-xs text-cyan-300">
              Follow-up contact: {selectedContact.first_name}
              {selectedContact.last_name ? ` ${selectedContact.last_name}` : ""}
            </p>
          ) : formData.company_id && filteredContacts.length === 0 ? (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              No contacts found for this company. The deal can still exist
              without a selected contact.
            </p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Optional, but useful for follow-up ownership.
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Deal Title *
          </label>

          <input
            type="text"
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
            disabled={isSubmitting}
            placeholder="Example: CRM Trial Project"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Deal Value *
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(event) => handleChange("value", event.target.value)}
            disabled={isSubmitting}
            placeholder="50000"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Currency
          </label>

          <select
            value={formData.currency}
            onChange={(event) =>
              handleChange("currency", event.target.value as DealCurrency)
            }
            disabled={isSubmitting}
            className={inputClass}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Stage
          </label>

          <select
            value={formData.stage}
            onChange={(event) =>
              handleChange("stage", event.target.value as DealStage)
            }
            disabled={isSubmitting}
            className={inputClass}
          >
            {dealStages.map((stage) => (
              <option key={stage} value={stage}>
                {formatStageLabel(stage)}
              </option>
            ))}
          </select>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Won and lost stages automatically update the deal status.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Expected Close Date
          </label>

          <input
            type="date"
            value={formData.expected_close_date}
            onChange={(event) =>
              handleChange("expected_close_date", event.target.value)
            }
            disabled={isSubmitting}
            className={inputClass}
          />

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Close date helps prioritize opportunities that need attention.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || companies.length === 0}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Updating Deal..." : "Update Deal"}
        </button>
      </div>
    </form>
  );
}