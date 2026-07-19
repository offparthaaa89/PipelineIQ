"use client";

import { useState, type FormEvent } from "react";
import type { NewCompanyInput } from "@/types/company";

type CompanyFormProps = {
  onSubmit: (company: NewCompanyInput) => Promise<boolean>;
  isSubmitting: boolean;
};

const inputClass =
  "crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60";

export default function CompanyForm({
  onSubmit,
  isSubmitting,
}: CompanyFormProps) {
  const [formData, setFormData] = useState<NewCompanyInput>({
    name: "",
    website: "",
    industry: "",
    size: "",
    location: "",
  });

  const completedFields = Object.values(formData).filter(
    (value) => value.trim().length > 0
  ).length;

  const progressPercentage = Math.round((completedFields / 5) * 100);

  const handleChange = (field: keyof NewCompanyInput, value: string) => {
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
        name: "",
        website: "",
        industry: "",
        size: "",
        location: "",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="crm-surface rounded-[2rem] p-5"
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          New account
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">Add Company</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Create the base company record first. Contacts and deals will become
          easier to manage when this information is clean.
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
          Name is required. Website, industry, size, and location make the CRM
          more useful later.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Example: Digital Heroes"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Website
          </label>
          <input
            type="text"
            value={formData.website}
            onChange={(event) => handleChange("website", event.target.value)}
            placeholder="example.com or https://example.com"
            disabled={isSubmitting}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-slate-500">
            We will normalize it before saving if you skip https.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Industry
          </label>
          <input
            type="text"
            value={formData.industry}
            onChange={(event) => handleChange("industry", event.target.value)}
            placeholder="Example: SaaS, Education, Real Estate"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Company Size
          </label>
          <input
            type="text"
            value={formData.size}
            onChange={(event) => handleChange("size", event.target.value)}
            placeholder="Example: 1-10, 11-50, 50+"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-slate-300">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(event) => handleChange("location", event.target.value)}
            placeholder="Example: Delhi, India"
            disabled={isSubmitting}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating Company..." : "Create Company"}
      </button>

      <p className="mt-4 text-center text-xs leading-5 text-slate-500">
        Best flow: Company → Contact → Deal. Start clean here to avoid confusion
        later.
      </p>
    </form>
  );
}