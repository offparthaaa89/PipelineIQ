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
  updatingContactId: string;
  onStatusChange: (
    contactId: string,
    nextStatus: ContactWithCompany["status"]
  ) => Promise<void>;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getContactQuality = (contact: ContactWithCompany) => {
  const fields = [contact.email, contact.phone, contact.job_title];
  const completedFields = fields.filter(Boolean).length;

  if (completedFields === fields.length) {
    return {
      label: "Complete",
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (completedFields >= 2) {
    return {
      label: "Good",
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    };
  }

  return {
    label: "Needs info",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  };
};

const getFullName = (contact: ContactWithCompany) => {
  return [contact.first_name, contact.last_name].filter(Boolean).join(" ");
};

export default function ContactList({
  contacts,
  totalContacts,
  companies,
  selectedCompanyId,
  onCompanyFilterChange,
  searchQuery,
  onSearchChange,
  updatingContactId,
  onStatusChange,
}: ContactListProps) {
  const selectedCompany = companies.find(
    (company) => company.id === selectedCompanyId
  );

  return (
    <div className="crm-surface overflow-hidden rounded-[2rem]">
      <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Contact directory
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black text-white">All Contacts</h2>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              {contacts.length} showing / {totalContacts} total
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Archive old contacts instead of deleting them immediately. This
            keeps relationship history safer when deals are linked.
          </p>
        </div>

        <div className="grid w-full gap-3 xl:w-[560px] xl:grid-cols-[230px_minmax(0,1fr)]">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-300">
              Company
            </label>

            <select
              value={selectedCompanyId}
              onChange={(event) => onCompanyFilterChange(event.target.value)}
              className="crm-focus-ring w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition"
            >
              <option value="">All companies</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>

            {selectedCompany && (
              <p className="mt-2 truncate text-xs text-cyan-300">
                Filtering: {selectedCompany.name}
              </p>
            )}
          </div>

          <SearchInput
            label="Search contacts"
            value={searchQuery}
            placeholder="Search name, email, phone, role..."
            onChange={onSearchChange}
          />
        </div>
      </div>

      <div className="hidden xl:block">
        <div className="grid grid-cols-[1.05fr_0.95fr_1fr_0.8fr_0.7fr_0.75fr_0.7fr_0.9fr] gap-4 border-b border-white/10 bg-slate-950/50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          <span>Person</span>
          <span>Company</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Status</span>
          <span>Quality</span>
          <span>Added</span>
          <span>Actions</span>
        </div>

        {contacts.map((contact) => {
          const fullName = getFullName(contact);
          const quality = getContactQuality(contact);
          const isUpdating = updatingContactId === contact.id;

          return (
            <div
              key={contact.id}
              className="crm-table-row grid grid-cols-[1.05fr_0.95fr_1fr_0.8fr_0.7fr_0.75fr_0.7fr_0.9fr] items-center gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{fullName}</p>
                <p className="mt-1 truncate text-slate-500">
                  {contact.job_title || "Job title not added"}
                </p>
              </div>

              <p className="truncate text-slate-300">
                {contact.companies?.name || "Company not found"}
              </p>

              {contact.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="truncate text-slate-300 transition hover:text-cyan-300"
                >
                  {contact.email}
                </a>
              ) : (
                <p className="truncate text-amber-300/80">Email not added</p>
              )}

              {contact.phone ? (
                <a
                  href={`tel:${contact.phone}`}
                  className="truncate text-slate-300 transition hover:text-cyan-300"
                >
                  {contact.phone}
                </a>
              ) : (
                <p className="truncate text-amber-300/80">Phone not added</p>
              )}

              <StatusBadge status={contact.status} />

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${quality.className}`}
              >
                {quality.label}
              </span>

              <p className="text-slate-400">{formatDate(contact.created_at)}</p>

              <div className="flex flex-wrap gap-2">
                {contact.status !== "active" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onStatusChange(contact.id, "active")}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}

                {contact.status === "active" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onStatusChange(contact.id, "inactive")}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Inactive
                  </button>
                )}

                {contact.status !== "archived" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onStatusChange(contact.id, "archived")}
                    className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Archive
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 p-4 xl:hidden">
        {contacts.map((contact) => {
          const fullName = getFullName(contact);
          const quality = getContactQuality(contact);
          const isUpdating = updatingContactId === contact.id;

          return (
            <article
              key={contact.id}
              className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">
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
                  {contact.email ? (
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition hover:text-cyan-300"
                    >
                      {contact.email}
                    </a>
                  ) : (
                    "Not added"
                  )}
                </p>

                <p>
                  <span className="text-slate-500">Phone: </span>
                  {contact.phone ? (
                    <a
                      href={`tel:${contact.phone}`}
                      className="transition hover:text-cyan-300"
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    "Not added"
                  )}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${quality.className}`}
                  >
                    {quality.label}
                  </span>

                  <span className="text-xs text-slate-500">
                    Added {formatDate(contact.created_at)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  {contact.status !== "active" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(contact.id, "active")}
                      className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Restore
                    </button>
                  )}

                  {contact.status === "active" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(contact.id, "inactive")}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Mark inactive
                    </button>
                  )}

                  {contact.status !== "archived" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(contact.id, "archived")}
                      className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}