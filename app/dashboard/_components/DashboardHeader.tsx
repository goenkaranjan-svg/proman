import { getSession } from "@/lib/supabase/server";
import Link from "next/link";

export async function DashboardHeader() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Home
        </Link>
      </div>
      <div className="flex items-center gap-4">
        {session?.user?.email && (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {session.user.email}
          </span>
        )}
      </div>
    </header>
  );
}
