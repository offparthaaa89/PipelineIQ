import PipelineColumn from "@/components/pipeline/PipelineColumn";
import type { DealStage, DealWithRelations } from "@/types/deal";

type PipelineBoardProps = {
  deals: DealWithRelations[];
  updatingDealId: string | null;
  onStageChange: (dealId: string, nextStage: DealStage) => Promise<void>;
};

const pipelineStages: { stage: DealStage; label: string }[] = [
  { stage: "new", label: "New" },
  { stage: "qualified", label: "Qualified" },
  { stage: "proposal", label: "Proposal" },
  { stage: "negotiation", label: "Negotiation" },
  { stage: "won", label: "Won" },
  { stage: "lost", label: "Lost" },
];

export default function PipelineBoard({
  deals,
  updatingDealId,
  onStageChange,
}: PipelineBoardProps) {
  const stages = pipelineStages.map((stageConfig) => stageConfig.stage);

  return (
    <div className="overflow-x-auto pb-4">
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
              deals={stageDeals}
              stages={stages}
              updatingDealId={updatingDealId}
              onStageChange={onStageChange}
            />
          );
        })}
      </div>
    </div>
  );
}