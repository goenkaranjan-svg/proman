"use client";

import { useActionState, useEffect } from "react";
import { createProperty, type CreatePropertyInput } from "../actions";

type Props = {
  open: boolean;
  onClose: () => void;
};

const initialState = { success: false as const, error: null as string | null };

function reduce(
  _state: { success: boolean; error: string | null },
  payload: Awaited<ReturnType<typeof createProperty>>
): { success: boolean; error: string | null } {
  if (payload.success) return { success: true, error: null };
  return { success: false, error: payload.error };
}

export function AddPropertyModal({ open, onClose }: Props) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { success: boolean; error: string | null }, formData: FormData) => {
      const input: CreatePropertyInput = {
        name: (formData.get("name") as string) ?? "",
        address_line1: (formData.get("address_line1") as string) ?? "",
        address_line2: (formData.get("address_line2") as string) || null,
        city: (formData.get("city") as string) ?? "",
        state: (formData.get("state") as string) || null,
        postal_code: (formData.get("postal_code") as string) ?? "",
        country: (formData.get("country") as string) || "US",
      };
      return reduce(_prev, await createProperty(input));
    },
    initialState
  );

  useEffect(() => {
    if (state.success) onClose();
  }, [state.success, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Add property
        </h2>
        <form action={formAction} className="mt-4 space-y-4">
          {state.error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              {state.error}
            </p>
          )}
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
              placeholder="e.g. Sunset Apartments"
            />
          </div>
          <div>
            <label
              htmlFor="address_line1"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Address line 1
            </label>
            <input
              id="address_line1"
              name="address_line1"
              required
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
              placeholder="123 Main St"
            />
          </div>
          <div>
            <label
              htmlFor="address_line2"
              className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Address line 2 <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              id="address_line2"
              name="address_line2"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
              placeholder="Apt 4B"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="city"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
                placeholder="San Francisco"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
                placeholder="CA"
              />
            </div>
            <div>
              <label
                htmlFor="postal_code"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Postal code
              </label>
              <input
                id="postal_code"
                name="postal_code"
                required
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
                placeholder="94102"
              />
            </div>
            <div>
              <label
                htmlFor="country"
                className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400"
                placeholder="US"
                defaultValue="US"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isPending ? "Adding…" : "Add property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
