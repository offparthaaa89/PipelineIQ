import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center">
        <p className="mb-4 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
          CRM for modern sales teams
        </p>

        <h1 className="mb-6 max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
          Manage your sales pipeline smarter with PipelineIQ.
        </h1>

        <p className="mb-8 max-w-2xl text-lg text-slate-400">
          Track leads, deals, customers, and follow-ups in one simple CRM
          dashboard built for fast-moving teams.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/register"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Login
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}