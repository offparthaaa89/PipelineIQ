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
      className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur"
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-white">Add Contact</h2>
        <p className="mt-1 text-sm text-slate-400">
          Add a person and connect them to an existing company.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Company *
          </label>

          <select
            value={formData.company_id}
            onChange={(event) =>
              handleChange("company_id", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
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
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Job Title
          </label>
          <input
            type="text"
            value={formData.job_title}
            onChange={(event) =>
              handleChange("job_title", event.target.value)
            }
            placeholder="Example: Founder, HR Manager, Sales Lead"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || companies.length === 0}
        className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
      >
        {isSubmitting ? "Saving Contact..." : "Add Contact"}
      </button>
    </form>
  );
}