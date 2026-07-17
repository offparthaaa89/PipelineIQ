import Link from "next/link";
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

export default function DealList({ deals }: DealListProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Deals</h2>
          <p className="mt-1 text-sm text-slate-400">
            Track sales opportunities across your pipeline.
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
          {deals.length} total
        </span>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => {
          const contactName = deal.contacts
            ? [deal.contacts.first_name, deal.contacts.last_name]
                .filter(Boolean)
                .join(" ")
            : "No contact selected";

          return (
            <article
               key={deal.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/50"
>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
               <div>
              <h3 className="text-lg font-semibold text-white">
               {deal.title}
              </h3>

              <p className="mt-1 text-sm text-slate-400">
               {deal.companies?.name || "Company not found"}
              </p>
             </div>

             <span className="w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-300">
               {deal.stage}
             </span>
             </div>

           <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
             <div>
               <p className="text-slate-500">Value</p>
                <p className="mt-1 font-semibold text-white">
                  {formatCurrency(deal.value, deal.currency)}
                 </p>
              </div>

              <div>
                <p className="text-slate-500">Contact</p>
                <p className="mt-1">{contactName}</p>
               </div>

               <div>
                <p className="text-slate-500">Close Date</p>
                <p className="mt-1">{formatDate(deal.expected_close_date)}</p>
               </div>

               <div>
                 <p className="text-slate-500">Status</p>
                 <p className="mt-1 capitalize">{deal.status}</p>
                </div>
             </div>

              <div className="mt-5 flex justify-end">
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