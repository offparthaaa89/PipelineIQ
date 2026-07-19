import SearchInput from "@/components/shared/SearchInput";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Company } from "@/types/company";

type CompanyListProps = {
  companies: Company[];
  totalCompanies: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  updatingCompanyId: string;
  onStatusChange: (
    companyId: string,
    nextStatus: Company["status"]
  ) => Promise<void>;
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const getCompanyQuality = (company: Company) => {
  const fields = [
    company.website,
    company.industry,
    company.size,
    company.location,
  ];
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

export default function CompanyList({
  companies,
  totalCompanies,
  searchQuery,
  onSearchChange,
  updatingCompanyId,
  onStatusChange,
}: CompanyListProps) {
  return (
    <div className="crm-surface overflow-hidden rounded-[2rem]">
      <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Company directory
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black text-white">All Companies</h2>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              {companies.length} showing / {totalCompanies} total
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Archive old companies instead of deleting them. This keeps your CRM
            safer when contacts and deals are linked.
          </p>
        </div>

        <div className="w-full xl:w-[430px]">
          <SearchInput
            label="Search companies"
            value={searchQuery}
            placeholder="Search by name, website, industry, location..."
            onChange={onSearchChange}
          />
        </div>
      </div>

      <div className="hidden xl:block">
        <div className="grid grid-cols-[1.25fr_0.85fr_0.65fr_0.85fr_0.7fr_0.8fr_0.7fr_0.9fr] gap-4 border-b border-white/10 bg-slate-950/50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          <span>Company</span>
          <span>Industry</span>
          <span>Size</span>
          <span>Location</span>
          <span>Status</span>
          <span>Data Quality</span>
          <span>Added</span>
          <span>Actions</span>
        </div>

        {companies.map((company) => {
          const quality = getCompanyQuality(company);
          const isUpdating = updatingCompanyId === company.id;

          return (
            <div
              key={company.id}
              className="crm-table-row grid grid-cols-[1.25fr_0.85fr_0.65fr_0.85fr_0.7fr_0.8fr_0.7fr_0.9fr] items-center gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{company.name}</p>

                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-slate-500 transition hover:text-cyan-300"
                  >
                    {company.website}
                  </a>
                ) : (
                  <p className="mt-1 truncate text-amber-300/80">
                    Website not added
                  </p>
                )}
              </div>

              <p className="truncate text-slate-300">
                {company.industry || "Not added"}
              </p>

              <p className="truncate text-slate-300">
                {company.size || "Not added"}
              </p>

              <p className="truncate text-slate-300">
                {company.location || "Not added"}
              </p>

              <StatusBadge status={company.status} />

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${quality.className}`}
              >
                {quality.label}
              </span>

              <p className="text-slate-400">{formatDate(company.created_at)}</p>

              <div className="flex flex-wrap gap-2">
                {company.status !== "active" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onStatusChange(company.id, "active")}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Restore
                  </button>
                )}

                {company.status === "active" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onStatusChange(company.id, "inactive")}
                    className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Inactive
                  </button>
                )}

                {company.status !== "archived" && (
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => onStatusChange(company.id, "archived")}
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
        {companies.map((company) => {
          const quality = getCompanyQuality(company);
          const isUpdating = updatingCompanyId === company.id;

          return (
            <article
              key={company.id}
              className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">
                    {company.name}
                  </h3>

                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block break-all text-sm text-slate-500 transition hover:text-cyan-300"
                    >
                      {company.website}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-amber-300/80">
                      Website not added
                    </p>
                  )}
                </div>

                <StatusBadge status={company.status} />
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Industry: </span>
                  {company.industry || "Not added"}
                </p>

                <p>
                  <span className="text-slate-500">Size: </span>
                  {company.size || "Not added"}
                </p>

                <p>
                  <span className="text-slate-500">Location: </span>
                  {company.location || "Not added"}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${quality.className}`}
                  >
                    {quality.label}
                  </span>

                  <span className="text-xs text-slate-500">
                    Added {formatDate(company.created_at)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                  {company.status !== "active" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(company.id, "active")}
                      className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Restore
                    </button>
                  )}

                  {company.status === "active" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(company.id, "inactive")}
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Mark inactive
                    </button>
                  )}

                  {company.status !== "archived" && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => onStatusChange(company.id, "archived")}
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