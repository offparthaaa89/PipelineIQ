import PipelineDealCard from "@/components/pipeline/PipelineDealCard";
import type { DealStage, DealWithRelations } from "@/types/deal";

type PipelineColumnProps = {
  stage: DealStage;
  label: string;
  description: string;
  deals: DealWithRelations[];
  stages: DealStage[];
  updatingDealId: string | null;
  onStageChange: (dealId: string, nextStage: DealStage) => Promise<void>;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

const getStageTone = (stage: DealStage) => {
  if (stage === "won") {
    return {
      border: "border-emerald-400/20",
      badge: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
      value: "text-emerald-300",
    };
  }

  if (stage === "lost") {
    return {
      border: "border-red-400/20",
      badge: "border-red-400/30 bg-red-400/10 text-red-300",
      value: "text-red-300",
    };
  }

  return {
    border: "border-cyan-400/18",
    badge: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
    value: "text-cyan-300",
  };
};

export default function PipelineColumn({
  stage,
  label,
  description,
  deals,
  stages,
  updatingDealId,
  onStageChange,
}: PipelineColumnProps) {
  const stageValue = deals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );

  const tone = getStageTone(stage);
  const isOutcomeStage = stage === "won" || stage === "lost";

  return (
    <section
      className={`flex min-h-[560px] w-[310px] shrink-0 flex-col rounded-[1.7rem] border ${tone.border} bg-slate-950/55 shadow-xl shadow-slate-950/30`}
    >
      <div className="border-b border-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-base font-black text-white">{label}</p>

              {isOutcomeStage && (
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Closed
                </span>
              )}
            </div>

            <p className="mt-1 text-xs font-medium text-slate-500">
              {description}
            </p>
          </div>

          <span
            className={`rounded-full border px-3 py-1 text-xs font-black ${tone.badge}`}
          >
            {deals.length}
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Stage value
          </p>

          <p className={`mt-1 text-lg font-black ${tone.value}`}>
            {formatCurrency(stageValue)}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {deals.length === 0 ? (
          <div className="flex min-h-[150px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-center">
            <div>
              <p className="text-sm font-bold text-slate-400">
                No deals here
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {isOutcomeStage
                  ? "Closed outcomes will appear in this column."
                  : "Move active opportunities into this stage when ready."}
              </p>
            </div>
          </div>
        ) : (
          deals.map((deal) => (
            <PipelineDealCard
              key={deal.id}
              deal={deal}
              stages={stages}
              isUpdating={updatingDealId === deal.id}
              onStageChange={onStageChange}
            />
          ))
        )}
      </div>
    </section>
  );
}