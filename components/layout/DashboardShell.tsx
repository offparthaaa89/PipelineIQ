"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DashboardShellProps = {
  children: React.ReactNode;
};

const navigationItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "🏠",
  },
  {
    label: "Companies",
    href: "/dashboard/companies",
    icon: "🏢",
  },
  {
    label: "Contacts",
    href: "/dashboard/contacts",
    icon: "👤",
  },
  {
    label: "Deals",
    href: "/dashboard/deals",
    icon: "🤝",
  },
];

export default function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const loadUserEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      setUserEmail(user?.email || "");
    };

    loadUserEmail();
  }, []);

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

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "P";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950/95 px-4 py-6 lg:block">
        <div className="flex items-center gap-3 px-1">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <div className="absolute h-9 w-9 rotate-45 rounded-lg border-2 border-cyan-400/80" />
        <div className="absolute h-5 w-5 rotate-45 rounded bg-cyan-400/20" />
         <span className="relative text-sm font-black text-cyan-300">PI</span>
        </div>

        <div>
          <p className="text-lg font-black uppercase tracking-wide text-white">
            PIPELINEIQ
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
            CRM
          </p>
       </div>
       </div>

          <nav className="mt-8 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isActiveLink(item.href);

              return (
                <Link
                   key={item.href}
                   href={item.href}
                   className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                    isActive
                     ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/10"
                     : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                 >
                   <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-sm">
                     {item.icon}
                   </span>
                   <span>{item.label}</span>
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
                   Pipeline Workspace
                  </p>
                  <p className="mt-1 hidden text-sm text-slate-400 sm:block">
                     Manage your CRM records with clear actions and secure user-scoped data.
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
                <div className="flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                <div className="absolute h-9 w-9 rotate-45 rounded-lg border-2 border-cyan-400/80" />
                <div className="absolute h-5 w-5 rotate-45 rounded bg-cyan-400/20" />
                 <span className="relative text-sm font-black text-cyan-300">PI</span>
                </div>

                <div>
                  <p className="text-lg font-black uppercase tracking-wide text-white">
                    PIPELINEIQ
                  </p>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
                    CRM
                  </p>
                </div>
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
                         className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-cyan-300 ${
                         isActive
                           ? "bg-cyan-400 text-slate-950"
                           : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-sm">
                       {item.icon}
                    </span>
                    <span>{item.label}</span>
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