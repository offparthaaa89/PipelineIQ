type LoadingStateProps = {
    message: string;
  };
  
  export default function LoadingState({ message }: LoadingStateProps) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 shadow-lg backdrop-blur">
        {message}
      </div>
    );
  }