type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    description: string;
    action?: React.ReactNode;
  };
  
  export default function PageHeader({
    eyebrow = "PipelineIQ CRM",
    title,
    description,
    action,
  }: PageHeaderProps) {
    return (
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300">
            {eyebrow}
          </p>
  
          <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">
            {title}
          </h1>
  
          <p className="mt-3 max-w-2xl text-slate-400">{description}</p>
        </div>
  
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }