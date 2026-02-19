import { getDashboardStats } from "./actions";
import { DashboardStats as DashboardStatsComponent } from "./_components/DashboardStats";

export default async function DashboardPage() {
  const { data: stats, error } = await getDashboardStats();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Overview
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome to Property OS. Here's a quick overview of your data.
        </p>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-300">
            Error loading stats: {error}
          </p>
        </div>
      ) : stats ? (
        <DashboardStatsComponent stats={stats} />
      ) : (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No data available yet.
          </p>
        </div>
      )}
    </div>
  );
}
