"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DashboardShellProps = {
  children: React.ReactNode;
};

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
  },
  {
    label: "Companies",
    href: "/dashboard/companies",
  },
  {
    label: "Contacts",
    href: "/dashboard/contacts",
  },
  {
    label: "Deals",
    href: "/dashboard/deals",
  },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setIsLoggingOut(false);
      return;
    }

    router.push("/login");
  };

  const isActiveLink = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/95 px-5 py-6 lg:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              PipelineIQ
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">CRM Console</h1>
            <p className="mt-2 text-sm text-slate-400">
              Sales pipeline command center.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-cyan-400/50 lg:hidden"
                >
                  Menu
                </button>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    Dashboard
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Manage companies, contacts, and deals.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </header>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <button
                type="button"
                aria-label="Close mobile menu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute inset-0 bg-slate-950/80"
              />

              <aside className="relative h-full w-80 max-w-[85vw] border-r border-white/10 bg-slate-950 px-5 py-6 shadow-2xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                      PipelineIQ
                    </p>
                    <h2 className="mt-3 text-2xl font-bold text-white">
                      CRM Console
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white"
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
                        className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                          isActive
                            ? "bg-cyan-400 text-slate-950"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </aside>
            </div>
          )}

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}