"use client";

import { useState } from "react";
import type { Company } from "@/types/company";
import type { NewContactInput } from "@/types/contact";

type ContactFormProps = {
  companies: Company[];
  onSubmit: (contact: NewContactInput) => Promise<boolean>;
  isSubmitting: boolean;
};

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

  const handleChange = (field: keyof NewContactInput, value: string) => {
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
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-slate-950/20"
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Add Contact</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Create a contact and connect them to a company.
        </p>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company *
          </label>

          <select
            value={formData.company_id}
            onChange={(event) =>
              handleChange("company_id", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          >
            <option value="">Select a company</option>

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          {companies.length === 0 && (
            <p className="mt-2 text-xs text-amber-300">
              Create a company first before adding contacts.
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            First Name *
          </label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(event) =>
              handleChange("first_name", event.target.value)
            }
            placeholder="Example: Shreyansh"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Last Name
          </label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(event) =>
              handleChange("last_name", event.target.value)
            }
            placeholder="Example: Singh"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => handleChange("email", event.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Phone
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
            placeholder="+91 98765 43210"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Job Title
          </label>
          <input
            type="text"
            value={formData.job_title}
            onChange={(event) =>
              handleChange("job_title", event.target.value)
            }
            placeholder="Example: Founder"
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || companies.length === 0}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating Contact..." : "Create Contact"}
      </button>
    </form>
  );
}