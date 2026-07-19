type ErrorStateProps = {
  title?: string;
  message: string;
};

export default function ErrorState({
  title = "Something went wrong",
  message,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="mb-6 rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200 shadow-lg shadow-red-950/20"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-red-400/15 text-xs font-black text-red-300">
          !
        </div>

        <div>
          <p className="font-bold text-red-100">{title}</p>
          <p className="mt-1 leading-6 text-red-200/90">{message}</p>
        </div>
      </div>
    </div>
  );
}