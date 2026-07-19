"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";

type DashboardShellProps = {
  children: ReactNode;
};

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "🏠",
    description: "Command center",
  },
  {
    label: "Companies",
    href: "/dashboard/companies",
    icon: "🏢",
    description: "Business accounts",
  },
  {
    label: "Contacts",
    href: "/dashboard/contacts",
    icon: "👤",
    description: "People records",
  },
  {
    label: "Deals",
    href: "/dashboard/deals",
    icon: "🤝",
    description: "Opportunities",
  },
  {
    label: "Pipeline",
    href: "/dashboard/pipeline",
    icon: "📊",
    description: "Stage movement",
  },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const loadUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email || "");
    };

    loadUserEmail();
  }, []);

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  const currentSection =
    navigationItems.find((item) => isActiveLink(item.href)) ||
    navigationItems[0];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setLogoutError(error.message);
      setIsLoggingOut(false);
      return;
    }

    router.push("/login");
  };

  const handleGoToLanding = () => {
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "P";

  return (
    <div className="crm-shell min-h-screen text-white">
      <div className="crm-main flex min-h-screen">
        <aside className="hidden w-52 shrink-0 border-r border-white/10 bg-slate-950/75 px-3 py-5 backdrop-blur-xl lg:block">
          <button
            type="button"
            onClick={handleGoToLanding}
            aria-label="Go to PipelineIQ landing page"
            className="crm-surface block w-full rounded-2xl p-3 text-left transition hover:border-cyan-400/40"
          >
            <div className="flex items-center gap-2">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                <div className="absolute h-8 w-8 rotate-45 rounded-lg border-2 border-cyan-400/80" />
                <div className="absolute h-4 w-4 rotate-45 rounded bg-cyan-400/20" />
                <span className="relative text-xs font-black text-cyan-300">
                  PI
                </span>
              </div>

              <div className="min-w-0">
                <p className="truncate text-base font-black uppercase tracking-wide text-white">
                  PIPELINEIQ
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  CRM
                </p>
              </div>
            </div>
          </button>

          <nav className="mt-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    isActive
                      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100 shadow-lg shadow-cyan-950/20"
                      : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300" />
                  )}

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm transition ${
                      isActive
                        ? "bg-cyan-400 text-slate-950"
                        : "bg-white/5 group-hover:bg-white/10"
                    }`}
                  >
                    {item.icon}
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate">{item.label}</span>
                    <span
                      className={`mt-0.5 block truncate text-xs font-medium ${
                        isActive ? "text-cyan-200/80" : "text-slate-500"
                      }`}
                    >
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 px-5 py-4 backdrop-blur-xl md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/50 hover:bg-white/5 lg:hidden"
                >
                  Menu
                </button>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    {currentSection.description}
                  </p>

                  <h1 className="mt-1 truncate text-lg font-black text-white md:text-xl">
                    {currentSection.label}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
                    {userInitial}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-white">
                      {userEmail || "Loading user"}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">
                      Workspace owner
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-200 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>

            {logoutError && (
              <p className="mt-3 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
                {logoutError}
              </p>
            )}
          </header>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close mobile menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              />

              <aside className="relative h-full w-80 max-w-[85vw] border-r border-white/10 bg-slate-950 px-5 py-6 shadow-2xl shadow-slate-950">
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleGoToLanding}
                    aria-label="Go to PipelineIQ landing page"
                    className="flex items-center gap-3 rounded-2xl text-left outline-none transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-cyan-300"
                  >
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                      <div className="absolute h-9 w-9 rotate-45 rounded-lg border-2 border-cyan-400/80" />
                      <div className="absolute h-5 w-5 rotate-45 rounded bg-cyan-400/20" />
                      <span className="relative text-sm font-black text-cyan-300">
                        PI
                      </span>
                    </div>

                    <div>
                      <p className="text-lg font-black uppercase tracking-wide text-white">
                        PIPELINEIQ
                      </p>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                        CRM
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/50"
                  >
                    Close
                  </button>
                </div>

                <nav className="mt-8 space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = isActiveLink(item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                          isActive
                            ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
                            : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-cyan-300" />
                        )}

                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-xl text-sm ${
                            isActive
                              ? "bg-cyan-400 text-slate-950"
                              : "bg-white/5"
                          }`}
                        >
                          {item.icon}
                        </span>

                        <span>
                          <span className="block">{item.label}</span>
                          <span className="mt-0.5 block text-xs font-medium text-slate-500">
                            {item.description}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Signed in
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                      {userInitial}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {userEmail || "Loading user"}
                      </p>
                      <p className="text-xs text-slate-500">Workspace owner</p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}