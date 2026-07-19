type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  const statusClass =
    normalizedStatus === "active" || normalizedStatus === "open"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : normalizedStatus === "won"
        ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
        : normalizedStatus === "lost"
          ? "border-red-400/30 bg-red-400/10 text-red-300"
          : normalizedStatus === "inactive" || normalizedStatus === "archived"
            ? "border-slate-500/30 bg-slate-500/10 text-slate-300"
            : normalizedStatus === "proposal" ||
                normalizedStatus === "negotiation"
              ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
              : normalizedStatus === "qualified"
                ? "border-blue-400/30 bg-blue-400/10 text-blue-300"
                : "border-purple-400/30 bg-purple-400/10 text-purple-300";

  const dotClass =
    normalizedStatus === "active" || normalizedStatus === "open"
      ? "bg-emerald-300"
      : normalizedStatus === "won"
        ? "bg-cyan-300"
        : normalizedStatus === "lost"
          ? "bg-red-300"
          : normalizedStatus === "inactive" || normalizedStatus === "archived"
            ? "bg-slate-300"
            : normalizedStatus === "proposal" ||
                normalizedStatus === "negotiation"
              ? "bg-amber-300"
              : normalizedStatus === "qualified"
                ? "bg-blue-300"
                : "bg-purple-300";

  const displayStatus = status.replace(/-/g, " ").replace(/_/g, " ");

  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold capitalize shadow-sm ${statusClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {displayStatus}
    </span>
  );
}