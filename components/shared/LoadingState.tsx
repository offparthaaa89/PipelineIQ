type LoadingStateProps = {
  message: string;
};

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="crm-surface rounded-2xl p-6 text-slate-300">
      <div className="flex items-center gap-4">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />

        <div>
          <p className="text-sm font-bold text-white">{message}</p>
          <p className="mt-1 text-xs text-slate-500">
            Preparing your CRM workspace...
          </p>
        </div>
      </div>
    </div>
  );
}