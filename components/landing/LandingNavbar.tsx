"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LandingNavbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUserEmail(user?.email || "");
      setIsCheckingUser(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || "");
      setIsCheckingUser(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      setHasScrolled(currentScrollY > 20);

      if (currentScrollY < 80) {
        setIsVisible(true);
        lastScrollY.current = currentScrollY;
        ticking.current = false;
        return;
      }

      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isScrollingDown = currentScrollY > lastScrollY.current;

      if (isScrollingUp) {
        setIsVisible(true);
      }

      if (isScrollingDown && currentScrollY > 120) {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateNavbar);
        ticking.current = true;
      }
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "P";

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 border-b px-5 py-4 backdrop-blur-xl transition-all duration-300 md:px-10 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        hasScrolled
          ? "border-white/10 bg-[#020617]/90 shadow-2xl shadow-slate-950/40"
          : "border-white/10 bg-[#020617]/80"
      }`}
    >
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
          {isCheckingUser ? (
            <div className="h-10 w-32 animate-pulse rounded-xl border border-white/10 bg-white/[0.04]" />
          ) : userEmail ? (
            <>
              <div className="hidden min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 sm:flex">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-black text-cyan-300">
                  {userInitial}
                </div>

                <div className="min-w-0">
                  <p className="max-w-40 truncate text-xs font-bold text-white">
                    {userEmail}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500">
                    Signed in
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/20 transition hover:-translate-y-0.5 hover:bg-cyan-300"
              >
                Workspace
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </nav>
  );
}