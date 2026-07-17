"use client";

import { useState } from "react";

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

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirmOpen(true)}
        className="rounded-xl border border-red-400/40 bg-red-400/10 px-5 py-3 text-sm font-semibold text-red-200 transition hover:bg-red-400/20"
      >
        Delete
      </button>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white">
              Delete this deal?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              You are about to delete{" "}
              <span className="font-semibold text-white">“{dealTitle}”</span>.
              This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isDeleting}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl bg-red-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-red-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete Deal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}