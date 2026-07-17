type EmptyStateProps = {
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  
  export default function EmptyState({
    title,
    description,
    action,
  }: EmptyStateProps) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
  
        {action && <div className="mt-5">{action}</div>}
      </div>
    );
  }
  