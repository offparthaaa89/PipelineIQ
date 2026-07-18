import SearchInput from "@/components/shared/SearchInput";
import StatusBadge from "@/components/shared/StatusBadge";
import type { Company } from "@/types/company";

type CompanyListProps = {
  companies: Company[];
  totalCompanies: number;
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

export default function CompanyList({
  companies,
  totalCompanies,
  searchQuery,
  onSearchChange,
}: CompanyListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-slate-950/20">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">All Companies</h2>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {totalCompanies} total
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Search, review, and manage company records in one workspace.
          </p>
        </div>

        <div className="w-full xl:w-[420px]">
          <SearchInput
            label="Search"
            value={searchQuery}
            placeholder="Search companies..."
            onChange={onSearchChange}
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr_0.9fr] gap-4 border-b border-white/10 bg-slate-900/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Company</span>
          <span>Industry</span>
          <span>Size</span>
          <span>Location</span>
          <span>Status</span>
          <span>Added On</span>
        </div>

        {companies.map((company) => (
          <div
            key={company.id}
            className="grid grid-cols-[1.4fr_1fr_0.8fr_1fr_0.8fr_0.9fr] items-center gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0 hover:bg-white/[0.03]"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">
                {company.name}
              </p>
              <p className="mt-1 truncate text-slate-500">
                {company.website || "Website not added"}
              </p>
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

            <p className="text-slate-400">{formatDate(company.created_at)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {companies.map((company) => (
          <article
            key={company.id}
            className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-white">
                  {company.name}
                </h3>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {company.website || "Website not added"}
                </p>
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
              <p>
                <span className="text-slate-500">Added: </span>
                {formatDate(company.created_at)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}