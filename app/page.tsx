import Link from "next/link";

const workflowSteps = [
  {
    step: "01",
    title: "Add Companies",
    description: "Create records for businesses, clients, and prospects.",
  },
  {
    step: "02",
    title: "Add Contacts",
    description: "Connect the right people to the right company.",
  },
  {
    step: "03",
    title: "Create Deals",
    description: "Track opportunity value, stage, and expected close date.",
  },
  {
    step: "04",
    title: "Move Pipeline",
    description: "Move deals from New to Won without losing context.",
  },
];

const benefits = [
  {
    title: "No scattered sales data",
    description:
      "Companies, contacts, and deals stay connected instead of being spread across notes, spreadsheets, and chats.",
  },
  {
    title: "Faster follow-up decisions",
    description:
      "Pipeline stages make it clear which deals need attention, which are close to closing, and which are already won or lost.",
  },
  {
    title: "Cleaner team workflow",
    description:
      "Everyone follows the same flow: company first, contact second, deal third, pipeline movement after that.",
  },
];

const mistakes = [
  "Creating a deal before adding the company.",
  "Selecting a contact that belongs to a different company.",
  "Forgetting to update deal stages after client conversations.",
  "Using spreadsheets after your sales pipeline becomes too large.",
];

const pipelinePreview = [
  {
    stage: "New",
    count: "3 deals",
    value: "₹1.2L",
  },
  {
    stage: "Qualified",
    count: "5 deals",
    value: "₹4.8L",
  },
  {
    stage: "Proposal",
    count: "2 deals",
    value: "₹2.1L",
  },
];

export default function HomePage() {
  return (
    <main className="landing-shell min-h-screen overflow-hidden bg-[#020617] text-white">
      <nav className="landing-nav sticky top-0 z-50 border-b border-white/10 bg-[#020617]/80 px-5 py-4 backdrop-blur-xl md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center">
              <div className="absolute h-8 w-8 rotate-45 rounded-lg border-2 border-cyan-400/80" />
              <div className="absolute h-4 w-4 rotate-45 rounded bg-cyan-400/20" />
              <span className="relative text-xs font-black text-cyan-300">
                PI
              </span>
            </div>

            <div>
              <p className="text-base font-black uppercase tracking-wide">
                PipelineIQ
              </p>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                CRM
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-300 md:flex">
            <a href="#workflow" className="transition hover:text-cyan-300">
              Workflow
            </a>
            <a href="#benefits" className="transition hover:text-cyan-300">
              Benefits
            </a>
            <a href="#guide" className="transition hover:text-cyan-300">
              Guide
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="home-grid-bg landing-hero relative px-5 py-20 md:px-10 md:py-28">
        <div className="pointer-events-none absolute left-[8%] top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-[6%] top-36 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="animate-reveal-up">
            <p className="mb-5 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              CRM for fast-moving sales teams
            </p>

            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              Close more deals with a pipeline that stays organized.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              PipelineIQ helps you manage companies, contacts, deals, and sales
              stages inside one focused CRM workspace — so every opportunity has
              context, value, and a clear next step.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-cyan-400 px-7 py-4 text-center font-bold text-slate-950 shadow-2xl shadow-cyan-400/20 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Get Started
              </Link>

              <a
                href="#workflow"
                className="rounded-xl border border-white/10 px-7 py-4 text-center font-bold text-slate-200 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-8 grid max-w-xl gap-3 text-sm text-slate-400 sm:grid-cols-3">
              <div className="landing-mini-card rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-bold text-white">Companies</p>
                <p className="mt-1">Organized accounts</p>
              </div>

              <div className="landing-mini-card rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-bold text-white">Deals</p>
                <p className="mt-1">Tracked by value</p>
              </div>

              <div className="landing-mini-card rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-bold text-white">Pipeline</p>
                <p className="mt-1">Clear movement</p>
              </div>
            </div>
          </div>

          <div className="landing-preview-card animate-float-slow rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    Pipeline Overview
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Live CRM-style workflow preview
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Active
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {pipelinePreview.map((item) => (
                  <div
                    key={item.stage}
                    className="landing-mini-card rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {item.stage}
                    </p>
                    <p className="mt-3 text-2xl font-black text-white">
                      {item.count}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-cyan-300">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                <div className="landing-mini-card rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        Website CRM Proposal
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Acme Technologies · Rahul Sharma
                      </p>
                    </div>
                    <p className="font-black text-cyan-300">₹85,000</p>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-2/3 rounded-full bg-cyan-400 animate-soft-pulse" />
                  </div>
                </div>

                <div className="landing-mini-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">
                        SaaS Dashboard Deal
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Nova Systems · Priya Mehta
                      </p>
                    </div>
                    <p className="font-black text-cyan-300">₹1.4L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="workflow" className="landing-section landing-section-cyan px-5 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Product workflow
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Use PipelineIQ in the right order.
            </h2>

            <p className="mt-4 text-slate-400">
              A CRM becomes powerful when relationships are clean. PipelineIQ is
              designed around a simple flow: company first, contact second, deal
              third, pipeline movement after that.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((item) => (
              <article
                key={item.step}
                className="landing-card group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-400/40 hover:bg-white/[0.07]"
              >
                <p className="text-sm font-black text-cyan-300">{item.step}</p>

                <h3 className="mt-6 text-xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="landing-section landing-section-blue px-5 py-24 md:px-10">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Why it saves time
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Stop searching. Start moving deals forward.
            </h2>

            <p className="mt-5 text-slate-400">
              The goal is not just to store data. The goal is to reduce daily
              confusion and make the next action obvious.
            </p>
          </div>

          <div className="grid gap-5">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="landing-card rounded-3xl border border-white/10 bg-slate-900/60 p-6 transition hover:-translate-y-1 hover:border-cyan-400/40"
              >
                <h3 className="text-2xl font-bold text-white">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-400">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="guide" className="landing-section landing-section-amber px-5 py-24 md:px-10">
        <div className="landing-card mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-2xl shadow-slate-950/30 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Quick usage guide
              </p>

              <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
                How to avoid CRM mistakes.
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                Most CRM problems happen because data is added in the wrong
                order or pipeline stages are not updated. PipelineIQ keeps the
                workflow simple so your records stay clean.
              </p>
            </div>

            <div className="space-y-3">
              {mistakes.map((mistake) => (
                <div
                  key={mistake}
                  className="landing-mini-card rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-6 text-slate-300"
                >
                  <span className="font-bold text-amber-300">Avoid: </span>
                  {mistake}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-final px-5 py-24 md:px-10">
        <div className="landing-cta-card mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-8 text-center shadow-2xl shadow-cyan-950/20 md:p-14">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Best practice workflow
          </p>

          <h2 className="mx-auto mt-4 max-w-4xl text-3xl font-black tracking-tight md:text-5xl">
            Company → Contact → Deal → Pipeline → Dashboard
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Start with clean relationships, then move deals through the pipeline.
            This keeps your CRM organized and makes every sales opportunity easy
            to understand.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-xl bg-cyan-400 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              Get Started Free
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/10 px-8 py-4 font-bold text-slate-200 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}