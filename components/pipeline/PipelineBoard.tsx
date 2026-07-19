import PipelineColumn from "@/components/pipeline/PipelineColumn";
import type { DealStage, DealWithRelations } from "@/types/deal";

type PipelineBoardProps = {
  deals: DealWithRelations[];
  updatingDealId: string | null;
  onStageChange: (dealId: string, nextStage: DealStage) => Promise<void>;
};

const pipelineStages: {
  stage: DealStage;
  label: string;
  description: string;
}[] = [
  {
    stage: "new",
    label: "New",
    description: "Fresh opportunities",
  },
  {
    stage: "qualified",
    label: "Qualified",
    description: "Fit confirmed",
  },
  {
    stage: "proposal",
    label: "Proposal",
    description: "Offer shared",
  },
  {
    stage: "negotiation",
    label: "Negotiation",
    description: "Terms being discussed",
  },
  {
    stage: "won",
    label: "Won",
    description: "Closed successfully",
  },
  {
    stage: "lost",
    label: "Lost",
    description: "Closed unsuccessfully",
  },
];

export default function PipelineBoard({
  deals,
  updatingDealId,
  onStageChange,
}: PipelineBoardProps) {
  const stages = pipelineStages.map((stageConfig) => stageConfig.stage);

  return (
    <section className="crm-surface rounded-[2rem] p-4 md:p-5">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Kanban board
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            Pipeline Movement
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Move deals using the stage selector or previous / next buttons. The
            board updates instantly and rolls back if the database update fails.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Total cards
          </p>
          <p className="mt-1 text-2xl font-black text-cyan-300">
            {deals.length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="flex min-w-max gap-4">
          {pipelineStages.map((stageConfig) => {
            const stageDeals = deals.filter(
              (deal) => deal.stage === stageConfig.stage
            );

            return (
              <PipelineColumn
                key={stageConfig.stage}
                stage={stageConfig.stage}
                label={stageConfig.label}
                description={stageConfig.description}
                deals={stageDeals}
                stages={stages}
                updatingDealId={updatingDealId}
                onStageChange={onStageChange}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}