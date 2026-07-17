"use client";

import { useState } from "react";
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

  const handleChange = (field: keyof NewDealInput, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const filteredContacts = formData.company_id
    ? contacts.filter((contact) => contact.company_id === formData.company_id)
    : contacts;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 shadow-lg backdrop-blur"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Edit Deal</h2>
        <p className="mt-1 text-sm text-slate-400">
          Update the sales opportunity while keeping company and contact
          relationships consistent.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company *
          </label>

          <select
            value={formData.company_id}
            onChange={(event) => {
              handleChange("company_id", event.target.value);
              handleChange("contact_id", "");
            }}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            <option value="">Select a company</option>

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Contact
          </label>

          <select
            value={formData.contact_id}
            onChange={(event) => handleChange("contact_id", event.target.value)}
            disabled={!formData.company_id}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
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
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Deal Title *
          </label>

          <input
            type="text"
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
            placeholder="Example: CRM Trial Project"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Deal Value *
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(event) => handleChange("value", event.target.value)}
            placeholder="50000"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Currency
          </label>

          <select
            value={formData.currency}
            onChange={(event) =>
              handleChange("currency", event.target.value as DealCurrency)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Stage
          </label>

          <select
            value={formData.stage}
            onChange={(event) =>
              handleChange("stage", event.target.value as DealStage)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            {dealStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Expected Close Date
          </label>

          <input
            type="date"
            value={formData.expected_close_date}
            onChange={(event) =>
              handleChange("expected_close_date", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || companies.length === 0}
          className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Updating Deal..." : "Update Deal"}
        </button>
      </div>
    </form>
  );
}