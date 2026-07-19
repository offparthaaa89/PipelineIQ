"use client";

import { useState } from "react";
import type { Company } from "@/types/company";
import type { ContactWithCompany } from "@/types/contact";
import type { DealCurrency, DealStage, NewDealInput } from "@/types/deal";

type DealFormProps = {
  companies: Company[];
  contacts: ContactWithCompany[];
  onSubmit: (deal: NewDealInput) => Promise<boolean>;
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

const formatStageLabel = (stage: DealStage) => {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
};

export default function DealForm({
  companies,
  contacts,
  onSubmit,
  isSubmitting,
}: DealFormProps) {
  const [formData, setFormData] = useState<NewDealInput>({
    company_id: "",
    contact_id: "",
    title: "",
    value: "",
    currency: "INR",
    stage: "new",
    expected_close_date: "",
  });

  const handleChange = (field: keyof NewDealInput, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const selectedCompany = companies.find(
    (company) => company.id === formData.company_id
  );

  const filteredContacts = formData.company_id
    ? contacts.filter((contact) => contact.company_id === formData.company_id)
    : [];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const wasCreated = await onSubmit(formData);

    if (wasCreated) {
      setFormData({
        company_id: "",
        contact_id: "",
        title: "",
        value: "",
        currency: "INR",
        stage: "new",
        expected_close_date: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-slate-950/20"
    >
      <div className="mb-5 border-b border-white/10 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          New Opportunity
        </p>

        <h2 className="mt-2 text-xl font-bold text-white">Add Deal</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Create a sales opportunity and connect it to the correct company and
          contact.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company *
          </label>

          <select
            value={formData.company_id}
            onChange={(event) => {
              handleChange("company_id", event.target.value);
              handleChange("contact_id", "");
            }}
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <option value="">Select a company</option>

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          {companies.length === 0 && (
            <p className="mt-2 text-xs leading-5 text-amber-300">
              Create a company before adding deals.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Contact
          </label>

          <select
            value={formData.contact_id}
            onChange={(event) => handleChange("contact_id", event.target.value)}
            disabled={!formData.company_id || isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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

          {formData.company_id && selectedCompany && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Showing contacts linked to {selectedCompany.name}.
            </p>
          )}

          {formData.company_id && filteredContacts.length === 0 && (
            <p className="mt-2 text-xs leading-5 text-slate-500">
              No contacts found for this company. You can still create the deal
              without selecting a contact.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Deal Title *
          </label>

          <input
            type="text"
            value={formData.title}
            onChange={(event) => handleChange("title", event.target.value)}
            disabled={isSubmitting}
            placeholder="Example: CRM Trial Project"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[1fr_110px]">
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
              disabled={isSubmitting}
              placeholder="50000"
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
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
              disabled={isSubmitting}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Pipeline Stage
          </label>

          <select
            value={formData.stage}
            onChange={(event) =>
              handleChange("stage", event.target.value as DealStage)
            }
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dealStages.map((stage) => (
              <option key={stage} value={stage}>
                {formatStageLabel(stage)}
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
            disabled={isSubmitting}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || companies.length === 0}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving Deal..." : "Create Deal"}
      </button>
    </form>
  );
}