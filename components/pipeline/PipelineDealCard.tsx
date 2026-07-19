import Link from "next/link";
import StatusBadge from "@/components/shared/StatusBadge";
import type { DealStage, DealWithRelations } from "@/types/deal";

type PipelineDealCardProps = {
  deal: DealWithRelations;
  stages: DealStage[];
  isUpdating: boolean;
  onStageChange: (dealId: string, nextStage: DealStage) => Promise<void>;
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

const formatStageLabel = (stage: DealStage) => {
  return stage.charAt(0).toUpperCase() + stage.slice(1);
};

export default function PipelineDealCard({
  deal,
  stages,
  isUpdating,
  onStageChange,
}: PipelineDealCardProps) {
  const currentStageIndex = stages.indexOf(deal.stage);
  const previousStage =
    currentStageIndex > 0 ? stages[currentStageIndex - 1] : null;
  const nextStage =
    currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;

  const contactName = deal.contacts
    ? [deal.contacts.first_name, deal.contacts.last_name]
        .filter(Boolean)
        .join(" ")
    : "No contact";

  return (
    <article className="rounded-xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/20 transition hover:border-cyan-400/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-bold leading-5 text-white">
            {deal.title}
          </h3>

          <p className="mt-1 truncate text-xs text-slate-500">
            {deal.companies?.name || "Company not found"}
          </p>
        </div>

        <StatusBadge status={deal.status} />
      </div>

      <div className="mt-4 space-y-3 text-xs text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Value</span>
          <span className="font-bold text-cyan-300">
            {formatCurrency(deal.value, deal.currency)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Close</span>
          <span className="text-right">
            {formatDate(deal.expected_close_date)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Contact</span>
          <span className="max-w-[150px] truncate text-right">
            {contactName}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <label className="mb-2 block text-xs font-semibold text-slate-500">
          Move stage
        </label>

        <select
          value={deal.stage}
          onChange={(event) =>
            onStageChange(deal.id, event.target.value as DealStage)
          }
          disabled={isUpdating}
          className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold capitalize text-white outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {stages.map((stage) => (
            <option key={stage} value={stage}>
              {formatStageLabel(stage)}
            </option>
          ))}
        </select>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!previousStage || isUpdating}
            onClick={() => {
              if (previousStage) {
                onStageChange(deal.id, previousStage);
              }
            }}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <button
            type="button"
            disabled={!nextStage || isUpdating}
            onClick={() => {
              if (nextStage) {
                onStageChange(deal.id, nextStage);
              }
            }}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        {isUpdating && (
          <p className="mt-2 text-xs font-medium text-cyan-300">
            Updating stage...
          </p>
        )}
      </div>

      <Link
        href={`/dashboard/deals/${deal.id}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-cyan-400/50 hover:text-cyan-200"
      >
        View Deal
      </Link>
    </article>
  );
}