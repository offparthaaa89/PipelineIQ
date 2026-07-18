import SearchInput from "@/components/shared/SearchInput";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Company } from "@/types/company";
import type { ContactWithCompany } from "@/types/contact";

type ContactListProps = {
  contacts: ContactWithCompany[];
  totalContacts: number;
  companies: Company[];
  selectedCompanyId: string;
  onCompanyFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default function ContactList({
  contacts,
  totalContacts,
  companies,
  selectedCompanyId,
  onCompanyFilterChange,
  searchQuery,
  onSearchChange,
}: ContactListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-slate-950/20">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">All Contacts</h2>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {totalContacts} total
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Search, review, and manage people linked to your companies.
          </p>
        </div>

        <div className="grid w-full gap-3 xl:w-[520px] xl:grid-cols-[220px_minmax(0,1fr)]">
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-300">
      Company
    </label>

    <select
      value={selectedCompanyId}
      onChange={(event) => onCompanyFilterChange(event.target.value)}
      className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10"
    >
      <option value="">All companies</option>

      {companies.map((company) => (
        <option key={company.id} value={company.id}>
          {company.name}
        </option>
      ))}
    </select>
  </div>

  <SearchInput
    label="Search"
    value={searchQuery}
    placeholder="Search contacts..."
    onChange={onSearchChange}
  />
</div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.2fr_1.1fr_1fr_1fr_0.8fr_0.9fr] gap-4 border-b border-white/10 bg-slate-900/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Name</span>
          <span>Company</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Status</span>
          <span>Added On</span>
        </div>

        {contacts.map((contact) => {
          const fullName = [contact.first_name, contact.last_name]
            .filter(Boolean)
            .join(" ");

          return (
            <div
              key={contact.id}
              className="grid grid-cols-[1.2fr_1.1fr_1fr_1fr_0.8fr_0.9fr] items-center gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0 hover:bg-white/[0.03]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {fullName}
                </p>
                <p className="mt-1 truncate text-slate-500">
                  {contact.job_title || "Job title not added"}
                </p>
              </div>

              <p className="truncate text-slate-300">
                {contact.companies?.name || "Company not found"}
              </p>

              <p className="truncate text-slate-300">
                {contact.email || "Not added"}
              </p>

              <p className="truncate text-slate-300">
                {contact.phone || "Not added"}
              </p>

              <StatusBadge status={contact.status} />

              <p className="text-slate-400">{formatDate(contact.created_at)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {contacts.map((contact) => {
          const fullName = [contact.first_name, contact.last_name]
            .filter(Boolean)
            .join(" ");

          return (
            <article
              key={contact.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-white">
                    {fullName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {contact.job_title || "Job title not added"}
                  </p>
                </div>

                <StatusBadge status={contact.status} />
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Company: </span>
                  {contact.companies?.name || "Company not found"}
                </p>
                <p className="break-all">
                  <span className="text-slate-500">Email: </span>
                  {contact.email || "Not added"}
                </p>
                <p>
                  <span className="text-slate-500">Phone: </span>
                  {contact.phone || "Not added"}
                </p>
                <p>
                  <span className="text-slate-500">Added: </span>
                  {formatDate(contact.created_at)}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}