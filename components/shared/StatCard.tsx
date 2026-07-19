type StatCardProps = {
  label: string;
  value: string | number;
  helperText?: string;
};

export default function StatCard({ label, value, helperText }: StatCardProps) {
  return (
    <div className="crm-surface crm-card-hover rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
          <div className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-400/40" />
        </div>
      </div>

      {helperText && (
        <p className="mt-3 text-sm leading-5 text-slate-500">{helperText}</p>
      )}
    </div>
  );
}