"use client";

import { Component, type ReactNode } from "react";
import { SupabaseSetupMessage } from "./SupabaseSetupMessage";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error("Error caught by boundary:", error);
  }

  render() {
    if (this.state.hasError) {
      const isSupabaseError =
        this.state.error?.message?.includes("Supabase") ||
        this.state.error?.message?.includes("NEXT_PUBLIC_SUPABASE");

      if (isSupabaseError) {
        return (
          <div className="flex min-h-screen items-center justify-center p-4">
            <SupabaseSetupMessage />
          </div>
        );
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
            <h2 className="mb-2 text-lg font-semibold text-red-900 dark:text-red-100">
              An error occurred
            </h2>
            <p className="text-sm text-red-800 dark:text-red-200">
              {this.state.error?.message || "Something went wrong"}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
