"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { Company } from "@/types/company";
import type { NewContactInput } from "@/types/contact";

type ContactFormProps = {
  companies: Company[];
  onSubmit: (contact: NewContactInput) => Promise<boolean>;
  isSubmitting: boolean;
};

const inputClass =
  "crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60";

export default function ContactForm({
  companies,
  onSubmit,
  isSubmitting,
}: ContactFormProps) {
  const [formData, setFormData] = useState<NewContactInput>({
    company_id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    job_title: "",
  });

  const availableCompanies = companies.filter(
    (company) => company.status !== "archived"
  );

  const selectedCompany = availableCompanies.find(
    (company) => company.id === formData.company_id
  );

  const completedFields = Object.values(formData).filter(
    (value) => value.trim().length > 0
  ).length;

  const progressPercentage = Math.round((completedFields / 6) * 100);

  const handleChange = (field: keyof NewContactInput, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const wasCreated = await onSubmit(formData);

    if (wasCreated) {
      setFormData({
        company_id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        job_title: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crm-surface rounded-[2rem] p-5">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          New relationship
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">Add Contact</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Add the person under the correct company so future deals stay linked
          to the right relationship.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-white">Record completeness</p>

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
          Company and first name are required. Role, email, and phone make
          follow-ups easier later.
        </p>
      </div>

      {companies.length === 0 && (
        <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p className="text-sm font-black text-amber-300">
            Create a company first
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Contacts should be connected to a company. Add a company before
            creating contact records.
          </p>

          <Link
            href="/dashboard/companies"
            className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-200"
          >
            Add Company
          </Link>
        </div>
      )}

      {companies.length > 0 && availableCompanies.length === 0 && (
        <div className="mb-5 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p className="text-sm font-black text-amber-300">
            No usable company available
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            All companies are archived. Restore a company before creating new
            contacts.
          </p>

          <Link
            href="/dashboard/companies"
            className="mt-4 inline-flex rounded-xl bg-amber-300 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-200"
          >
            Manage Companies
          </Link>
        </div>
      )}

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Company *
          </label>

          <select
            value={formData.company_id}
            onChange={(event) => handleChange("company_id", event.target.value)}
            disabled={isSubmitting || availableCompanies.length === 0}
            className={inputClass}
          >
            <option value="">Select a company</option>

            {availableCompanies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.status === "inactive"
                  ? `${company.name} (Inactive)`
                  : company.name}
              </option>
            ))}
          </select>

          {selectedCompany ? (
            <p className="mt-2 text-xs text-cyan-300">
              Contact will be linked to {selectedCompany.name}
              {selectedCompany.status === "inactive" ? " (inactive)." : "."}
            </p>
          ) : (
            <p className="mt-2 text-xs text-slate-500">
              Archived companies are hidden from new contact creation.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(event) => handleChange("first_name", event.target.value)}
            placeholder="Example: Shreyansh"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(event) => handleChange("last_name", event.target.value)}
            placeholder="Example: Singh"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="name@example.com"
            disabled={isSubmitting}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            Useful for proposal follow-ups and client communication.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Phone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            placeholder="+91 98765 43210"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Job Title
          </label>
          <input
            type="text"
            value={formData.job_title}
            onChange={(event) => handleChange("job_title", event.target.value)}
            placeholder="Example: Founder, Manager, Decision Maker"
            disabled={isSubmitting}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            Helps identify whether this person can influence the deal.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || availableCompanies.length === 0}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating Contact..." : "Create Contact"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Best flow: Company → Contact → Deal. Archived companies are protected
        from new work.
      </p>
    </form>
  );
}