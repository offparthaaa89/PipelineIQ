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

const getCloseDateSignal = (
  date: string | null,
  status: DealWithRelations["status"]
) => {
  if (!date) {
    return {
      label: "No close date",
      className: "border-white/10 bg-white/[0.03] text-slate-400",
    };
  }

  if (status === "won") {
    return {
      label: `Won · ${formatDate(date)}`,
      className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    };
  }

  if (status === "lost") {
    return {
      label: `Lost · ${formatDate(date)}`,
      className: "border-red-400/30 bg-red-400/10 text-red-300",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closeDate = new Date(`${date}T00:00:00`);
  const diffInDays = Math.ceil(
    (closeDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffInDays < 0) {
    return {
      label: `Overdue · ${formatDate(date)}`,
      className: "border-amber-400/30 bg-amber-400/10 text-amber-300",
    };
  }

  if (diffInDays <= 7) {
    return {
      label: `Soon · ${formatDate(date)}`,
      className: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    };
  }

  return {
    label: `Due · ${formatDate(date)}`,
    className: "border-white/10 bg-white/[0.03] text-slate-400",
  };
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

  const progressPercentage = Math.round(
    ((currentStageIndex + 1) / stages.length) * 100
  );

  const closeSignal = getCloseDateSignal(
    deal.expected_close_date,
    deal.status
  );

  return (
    <article className="crm-card-hover rounded-2xl border border-white/10 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-black leading-5 text-white">
            {deal.title}
          </h3>

          <p className="mt-1 truncate text-xs font-semibold text-slate-500">
            {deal.companies?.name || "Company not found"}
          </p>
        </div>

        <StatusBadge status={deal.status} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Value
          </span>

          <span className="text-sm font-black text-cyan-300">
            {formatCurrency(deal.value, deal.currency)}
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Stage {currentStageIndex + 1} of {stages.length}
        </p>
      </div>

      <div className="mt-4 space-y-3 text-xs text-slate-300">
        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Close signal</span>

          <span
            className={`rounded-full border px-2 py-1 text-right text-[11px] font-bold ${closeSignal.className}`}
          >
            {closeSignal.label}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-slate-500">Contact</span>
          <span className="max-w-[150px] truncate text-right font-semibold text-slate-300">
            {contactName}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Move stage
        </label>

        <select
          value={deal.stage}
          onChange={(event) =>
            onStageChange(deal.id, event.target.value as DealStage)
          }
          disabled={isUpdating}
          className="crm-focus-ring w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-60"
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
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
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
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>

        {isUpdating && (
          <p className="mt-3 rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-300">
            Updating stage...
          </p>
        )}
      </div>

      <Link
        href={`/dashboard/deals/${deal.id}`}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200"
      >
        View Deal →
      </Link>
    </article>
  );
}