"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

type DeleteDealButtonProps = {
  dealTitle: string;
  onDelete: () => Promise<boolean>;
  isDeleting: boolean;
};

export default function DeleteDealButton({
  dealTitle,
  onDelete,
  isDeleting,
}: DeleteDealButtonProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    const wasDeleted = await onDelete();

    if (wasDeleted) {
      setIsConfirmOpen(false);
    }
  };

  const modal =
    isConfirmOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 px-4 backdrop-blur-md">
            <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-slate-950/80">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-400/30 bg-red-400/10 text-xl">
                ⚠️
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
                Destructive action
              </p>

              <h2 className="mt-3 text-2xl font-black text-white">
                Delete this deal?
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                You are about to permanently delete{" "}
                <span className="font-bold text-white">“{dealTitle}”</span>.
                This action cannot be undone.
              </p>

              <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 p-4">
                <p className="text-sm font-bold text-red-200">
                  This will remove the deal from your deals list, detail page,
                  and pipeline tracking.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isDeleting}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/5 hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="rounded-xl bg-red-400 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-red-400/20 transition hover:-translate-y-0.5 hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Deleting..." : "Delete Deal"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
        className="rounded-xl border border-red-400/40 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-200 transition hover:-translate-y-0.5 hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Delete
      </button>

      {modal}
    </>
  );
}