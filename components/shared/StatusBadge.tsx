type StatusBadgeProps = {
    status: string;
  };
  
  export default function StatusBadge({ status }: StatusBadgeProps) {
    const normalizedStatus = status.toLowerCase();
  
    const statusClass =
      normalizedStatus === "active" || normalizedStatus === "open"
        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
        : normalizedStatus === "inactive" ||
            normalizedStatus === "archived" ||
            normalizedStatus === "lost"
          ? "border-slate-500/30 bg-slate-500/10 text-slate-300"
          : normalizedStatus === "won"
            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
            : "border-purple-400/30 bg-purple-400/10 text-purple-300";
  
    return (
      <span
        className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusClass}`}
      >
        {status}
      </span>
    );
  }