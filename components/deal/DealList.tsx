import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import type { DealWithRelations } from "@/types/deal";

type DealListProps = {
  deals: DealWithRelations[];
};

const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date: string | null) => {
  if (!date) {
    return "No close date";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStage = (stage: string) => {
  return stage.replaceAll("_", " ");
};

export default function DealList({ deals }: DealListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-slate-950/20">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">All Deals</h2>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
              {deals.length} total
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-400">
            Review sales opportunities linked to companies and contacts.
          </p>
        </div>

        <Link
          href="/dashboard/pipeline"
          className="w-fit rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
        >
          Open Pipeline →
        </Link>
      </div>

      <div className="hidden lg:block">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_0.9fr_0.9fr_0.9fr_0.7fr] gap-4 border-b border-white/10 bg-slate-900/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>Deal</span>
          <span>Company</span>
          <span>Contact</span>
          <span>Value</span>
          <span>Stage</span>
          <span>Close Date</span>
          <span>Action</span>
        </div>

        {deals.map((deal) => {
          const contactName = deal.contacts
            ? [deal.contacts.first_name, deal.contacts.last_name]
                .filter(Boolean)
                .join(" ")
            : "No contact";

          return (
            <div
              key={deal.id}
              className="grid grid-cols-[1.3fr_1fr_1fr_0.9fr_0.9fr_0.9fr_0.7fr] items-center gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0 hover:bg-white/[0.03]"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {deal.title}
                </p>
                <p className="mt-1 capitalize text-slate-500">
                  {deal.status}
                </p>
              </div>

              <p className="truncate text-slate-300">
                {deal.companies?.name || "Company not found"}
              </p>

              <p className="truncate text-slate-300">{contactName}</p>

              <p className="font-semibold text-cyan-300">
                {formatCurrency(deal.value, deal.currency)}
              </p>

              <StatusBadge status={formatStage(deal.stage)} />

              <p className="text-slate-400">
                {formatDate(deal.expected_close_date)}
              </p>

              <Link
                href={`/dashboard/deals/${deal.id}`}
                className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-cyan-400/50 hover:text-cyan-200"
              >
                View
              </Link>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {deals.map((deal) => {
          const contactName = deal.contacts
            ? [deal.contacts.first_name, deal.contacts.last_name]
                .filter(Boolean)
                .join(" ")
            : "No contact selected";

          return (
            <article
              key={deal.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-white">
                    {deal.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {deal.companies?.name || "Company not found"}
                  </p>
                </div>

                <StatusBadge status={formatStage(deal.stage)} />
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Value: </span>
                  <span className="font-semibold text-cyan-300">
                    {formatCurrency(deal.value, deal.currency)}
                  </span>
                </p>

                <p>
                  <span className="text-slate-500">Contact: </span>
                  {contactName}
                </p>

                <p>
                  <span className="text-slate-500">Close Date: </span>
                  {formatDate(deal.expected_close_date)}
                </p>

                <p className="capitalize">
                  <span className="text-slate-500">Status: </span>
                  {deal.status}
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href={`/dashboard/deals/${deal.id}`}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/50 hover:text-cyan-200"
                >
                  View Details
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}