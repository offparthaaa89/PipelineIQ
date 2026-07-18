"use client";

import { useState } from "react";
import type { NewCompanyInput } from "@/types/company";

type CompanyFormProps = {
  onSubmit: (company: NewCompanyInput) => Promise<boolean>;
  isSubmitting: boolean;
};

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

  const handleChange = (field: keyof NewCompanyInput, value: string) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-slate-950/20"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Add Company</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Create a new company record.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Example: Digital Heroes"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Website
          </label>
          <input
            type="text"
            value={formData.website}
            onChange={(event) => handleChange("website", event.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Industry
          </label>
          <input
            type="text"
            value={formData.industry}
            onChange={(event) => handleChange("industry", event.target.value)}
            placeholder="Example: SaaS"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company Size
          </label>
          <input
            type="text"
            value={formData.size}
            onChange={(event) => handleChange("size", event.target.value)}
            placeholder="Example: 1-10"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(event) => handleChange("location", event.target.value)}
            placeholder="Example: Delhi, India"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating Company..." : "Create Company"}
      </button>
    </form>
  );
}