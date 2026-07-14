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
    console.log("Was company created?", wasCreated);
  
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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Add Company</h2>
        <p className="mt-1 text-sm text-slate-400">
          Create a company record to start tracking contacts and deals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="Example: Digital Heroes"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            placeholder="Example: SaaS, Agency, Finance"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            placeholder="Example: 1-10, 11-50, 51-200"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {isSubmitting ? "Saving Company..." : "Add Company"}
      </button>
    </form>
  );
}