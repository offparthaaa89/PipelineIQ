type ErrorStateProps = {
    title?: string;
    message: string;
  };
  
  export default function ErrorState({
    title = "Something went wrong",
    message,
  }: ErrorStateProps) {
    return (
      <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
        <p className="font-semibold">{title}</p>
        <p className="mt-1">{message}</p>
      </div>
    );
  }