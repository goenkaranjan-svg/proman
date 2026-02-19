import type { DashboardStats } from "../actions";

type Props = {
  stats: DashboardStats;
};

export function DashboardStats({ stats }: Props) {
  const statCards = [
    { label: "Properties", value: stats.properties, href: "/dashboard/properties" },
    { label: "Tenants", value: stats.tenants, href: "/dashboard/tenants" },
    { label: "Active Leases", value: stats.activeLeases, href: "/dashboard/leases" },
    { label: "Pending Payments", value: stats.pendingPayments, href: "/dashboard/payments" },
    { label: "Open Maintenance", value: stats.openMaintenance, href: "/dashboard/maintenance" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card) => (
        <a
          key={card.label}
          href={card.href}
          className="group rounded-lg border border-zinc-200 bg-white p-4 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
        >
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            {card.label}
          </div>
          <div className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            {card.value}
          </div>
        </a>
      ))}
    </div>
  );
}
