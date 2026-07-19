import Link from "next/link";
import LandingNavbar from "@/components/landing/LandingNavbar";

const workflowSteps = [
  {
    step: "01",
    title: "Create companies",
    description:
      "Start with clean business accounts so every contact and deal has a proper home.",
  },
  {
    step: "02",
    title: "Attach contacts",
    description:
      "Connect people to the right company and keep relationship context clear.",
  },
  {
    step: "03",
    title: "Track deals",
    description:
      "Create opportunities with value, stage, status, and expected close dates.",
  },
  {
    step: "04",
    title: "Move pipeline",
    description:
      "Use the pipeline board to understand where every opportunity stands.",
  },
];

const benefits = [
  {
    title: "Focused CRM flow",
    description:
      "PipelineIQ follows a simple structure: Company, Contact, Deal, Pipeline, Dashboard.",
  },
  {
    title: "Cleaner sales data",
    description:
      "Archive, restore, and organize records instead of losing important relationship context.",
  },
  {
    title: "Opportunity visibility",
    description:
      "Track deal value, close dates, stages, and pipeline movement from one workspace.",
  },
];

const guideItems = [
  {
    title: "Do not start with deals first",
    description:
      "A deal without a company becomes messy later. Add the company first, then contact, then deal.",
  },
  {
    title: "Keep records complete",
    description:
      "Website, industry, role, email, phone, value, and close date make CRM data useful.",
  },
  {
    title: "Use archive for old records",
    description:
      "Archiving is safer than deleting when companies, contacts, and deals are connected.",
  },
];

export default function HomePage() {
  return (
    <main className="landing-shell min-h-screen bg-slate-950 text-white">
      <LandingNavbar />

      <section className="home-grid-bg relative px-5 pb-20 pt-32 md:px-10 md:pb-28 md:pt-36">
        <div className="mx-auto grid max-w-7xl items-center gap-12 xl:grid-cols-[1fr_0.9fr]">
          <div className="animate-reveal-up">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-black text-cyan-300">
              CRM for fast-moving sales teams
            </div>

            <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              Close more deals with a pipeline that stays organized.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-400 md:text-xl">
              PipelineIQ helps you manage companies, contacts, deals, and sales
              stages inside one focused CRM workspace — so every opportunity has
              context, value, and a clear next step.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-2xl bg-cyan-400 px-7 py-4 text-center text-base font-black text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Get Started
              </Link>

              <a
                href="#workflow"
                className="rounded-2xl border border-white/10 px-7 py-4 text-center text-base font-black text-slate-200 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
              >
                See How It Works
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {["Companies", "Deals", "Pipeline"].map((item) => (
                <div
                  key={item}
                  className="landing-card rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <p className="font-black text-white">{item}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {item === "Companies"
                      ? "Organized accounts"
                      : item === "Deals"
                        ? "Tracked by value"
                        : "Clear movement"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float-slow rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-slate-950/60 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-black text-white">
                    Pipeline Overview
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Live CRM-style workflow preview
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-black text-emerald-300">
                  Active
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["New", "3 deals", "₹1.2L"],
                  ["Qualified", "5 deals", "₹4.8L"],
                  ["Proposal", "2 deals", "₹2.1L"],
                ].map(([stage, count, value]) => (
                  <div
                    key={stage}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {stage}
                    </p>
                    <p className="mt-4 text-2xl font-black text-white">
                      {count}
                    </p>
                    <p className="mt-2 text-sm font-black text-cyan-300">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Website CRM Proposal", "Acme Technologies · Rahul Sharma", "₹85,000"],
                  ["SaaS Dashboard Deal", "Nova Systems · Priya Mehta", "₹1.4L"],
                ].map(([title, meta, value]) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-slate-900/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-white">{title}</p>
                        <p className="mt-2 text-sm text-slate-500">{meta}</p>
                      </div>
                      <p className="font-black text-cyan-300">{value}</p>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-2/3 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="landing-section landing-section-cyan px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Workflow
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
            A CRM flow that matches how sales work actually happens.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {workflowSteps.map((item) => (
              <div
                key={item.step}
                className="landing-card rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
                  {item.step}
                </span>

                <h3 className="mt-5 text-xl font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="benefits"
        className="landing-section landing-section-blue px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 xl:grid-cols-[0.8fr_1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
                Benefits
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
                Built to keep sales data clean, visible, and usable.
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-400">
                PipelineIQ is not just a list of records. It gives structure to
                accounts, people, opportunities, and stages.
              </p>
            </div>

            <div className="grid gap-5">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="landing-card rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
                >
                  <h3 className="text-xl font-black text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="guide"
        className="landing-section landing-section-amber px-5 py-20 md:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Guide
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
            The simple rules that keep a CRM from becoming messy.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {guideItems.map((item) => (
              <div
                key={item.title}
                className="landing-card rounded-[2rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-xl font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-final px-5 py-20 md:px-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-cyan-400/20 bg-cyan-400/10 p-8 text-center md:p-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-300">
            Start clean
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            Build your sales workflow before it becomes scattered.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-300">
            Add your first company, connect contacts, create deals, and move
            opportunities through a clear pipeline.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="rounded-2xl bg-cyan-400 px-7 py-4 text-center text-base font-black text-slate-950 shadow-xl shadow-cyan-400/20 transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-white/10 px-7 py-4 text-center text-base font-black text-white transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-300"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}