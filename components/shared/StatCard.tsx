type StatCardProps = {
    label: string;
    value: string | number;
    helperText?: string;
  };
  
  export default function StatCard({ label, value, helperText }: StatCardProps) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-slate-950/20">
        <p className="text-sm font-medium text-slate-400">{label}</p>
  
        <p className="mt-3 text-3xl font-bold tracking-tight text-white">
          {value}
        </p>
  
        {helperText && (
          <p className="mt-2 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }