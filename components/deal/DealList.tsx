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

const getContactName = (deal: DealWithRelations) => {
  return deal.contacts
    ? [deal.contacts.first_name, deal.contacts.last_name].filter(Boolean).join(" ")
    : "No contact";
};

const getCloseDateSignal = (deal: DealWithRelations) => {
  if (!deal.expected_close_date) {
    return {
      label: "No target",
      className: "border-slate-500/30 bg-slate-500/10 text-slate-400",
    };
  }

  if (deal.status !== "open") {
    return {
      label: "Closed",
      className: "border-slate-500/30 bg-slate-500/10 text-slate-400",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closeDate = new Date(deal.expected_close_date);
  closeDate.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil(
    (closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysLeft < 0) {
    return {
      label: "Overdue",
      className: "border-rose-400/30 bg-rose-400/10 text-rose-300",
    };
  }

  if (daysLeft <= 7) {
    return {
      label: "Due soon",
      className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    };
  }

  if (daysLeft <= 30) {
    return {
      label: "This month",
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    };
  }

  return {
    label: "Planned",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  };
};

const getDealQuality = (deal: DealWithRelations) => {
  const hasCompany = Boolean(deal.companies?.name);
  const hasContact = Boolean(deal.contacts);
  const hasCloseDate = Boolean(deal.expected_close_date);
  const hasValue = Number(deal.value || 0) > 0;

  const score = [hasCompany, hasContact, hasCloseDate, hasValue].filter(Boolean)
    .length;

  if (score === 4) {
    return {
      label: "Strong",
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (score >= 3) {
    return {
      label: "Good",
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    };
  }

  return {
    label: "Needs context",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  };
};

export default function DealList({ deals }: DealListProps) {
  return (
    <div className="crm-surface overflow-hidden rounded-[2rem]">
      <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Deal directory
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black text-white">All Deals</h2>

            <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              {deals.length} showing
            </span>
          </div>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review opportunities by value, stage, company, contact context, and
            close-date urgency.
          </p>
        </div>

        <Link
          href="/dashboard/pipeline"
          className="w-fit rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:-translate-y-0.5 hover:bg-cyan-400/20"
        >
          Open Pipeline →
        </Link>
      </div>

      <div className="hidden xl:block">
        <div className="grid grid-cols-[1.25fr_0.95fr_0.9fr_0.8fr_0.75fr_0.85fr_0.85fr_0.55fr] gap-4 border-b border-white/10 bg-slate-950/50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          <span>Deal</span>
          <span>Company</span>
          <span>Contact</span>
          <span>Value</span>
          <span>Stage</span>
          <span>Close Signal</span>
          <span>Quality</span>
          <span>Action</span>
        </div>

        {deals.map((deal) => {
          const contactName = getContactName(deal);
          const closeSignal = getCloseDateSignal(deal);
          const quality = getDealQuality(deal);

          return (
            <div
              key={deal.id}
              className="crm-table-row grid grid-cols-[1.25fr_0.95fr_0.9fr_0.8fr_0.75fr_0.85fr_0.85fr_0.55fr] items-center gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-white">{deal.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={deal.status} />
                </div>
              </div>

              <p className="truncate text-slate-300">
                {deal.companies?.name || "Company not found"}
              </p>

              <p className="truncate text-slate-300">{contactName}</p>

              <p className="font-black text-cyan-300">
                {formatCurrency(deal.value, deal.currency)}
              </p>

              <span className="w-fit rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold capitalize text-slate-300">
                {formatStage(deal.stage)}
              </span>

              <div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${closeSignal.className}`}
                >
                  {closeSignal.label}
                </span>
                <p className="mt-2 text-xs text-slate-500">
                  {formatDate(deal.expected_close_date)}
                </p>
              </div>

              <span
                className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${quality.className}`}
              >
                {quality.label}
              </span>

              <Link
                href={`/dashboard/deals/${deal.id}`}
                className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200"
              >
                View
              </Link>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 p-4 xl:hidden">
        {deals.map((deal) => {
          const contactName = getContactName(deal);
          const closeSignal = getCloseDateSignal(deal);
          const quality = getDealQuality(deal);

          return (
            <article
              key={deal.id}
              className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/55 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-black text-white">
                    {deal.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {deal.companies?.name || "Company not found"}
                  </p>
                </div>

                <StatusBadge status={deal.status} />
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Deal Value
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  {formatCurrency(deal.value, deal.currency)}
                </p>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-slate-300">
                <p>
                  <span className="text-slate-500">Contact: </span>
                  {contactName}
                </p>

                <p className="capitalize">
                  <span className="text-slate-500">Stage: </span>
                  {formatStage(deal.stage)}
                </p>

                <p>
                  <span className="text-slate-500">Close Date: </span>
                  {formatDate(deal.expected_close_date)}
                </p>

                <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${closeSignal.className}`}
                  >
                    {closeSignal.label}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${quality.className}`}
                  >
                    {quality.label}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link
                  href={`/dashboard/deals/${deal.id}`}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200"
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