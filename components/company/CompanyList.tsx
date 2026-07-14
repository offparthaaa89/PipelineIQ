import type { Company } from "@/types/company";

type CompanyListProps = {
  companies: Company[];
};

export default function CompanyList({ companies }: CompanyListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Companies</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage the organizations in your sales pipeline.
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
          {companies.length} total
        </span>
      </div>

      <div className="grid gap-4">
        {companies.map((company) => (
          <article
            key={company.id}
            className="rounded-xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/50"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {company.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {company.industry || "Industry not added"}
                </p>
              </div>

              <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                {company.status}
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-3">
              <div>
                <p className="text-slate-500">Website</p>
                <p className="mt-1 break-all">
                  {company.website || "Not added"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Size</p>
                <p className="mt-1">{company.size || "Not added"}</p>
              </div>

              <div>
                <p className="text-slate-500">Location</p>
                <p className="mt-1">{company.location || "Not added"}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}