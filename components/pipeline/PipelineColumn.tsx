import PipelineDealCard from "@/components/pipeline/PipelineDealCard";
import type { DealStage, DealWithRelations } from "@/types/deal";

type PipelineColumnProps = {
  stage: DealStage;
  label: string;
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

export default function PipelineColumn({
  stage,
  label,
  deals,
  stages,
  updatingDealId,
  onStageChange,
}: PipelineColumnProps) {
  const stageValue = deals.reduce(
    (total, deal) => total + Number(deal.value || 0),
    0
  );

  return (
    <section className="flex min-h-[420px] w-[280px] shrink-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg shadow-slate-950/20">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-white">{label}</p>
            <p className="mt-1 text-xs text-slate-500">{stage}</p>
          </div>

          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
            {deals.length}
          </span>
        </div>

        <p className="mt-3 text-sm font-bold text-cyan-300">
          {formatCurrency(stageValue)}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {deals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/40 p-4 text-center text-sm text-slate-500">
            No deals in this stage
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