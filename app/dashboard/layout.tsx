import Link from "next/link";
import { SidebarNav } from "./_components/SidebarNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <aside className="fixed left-0 top-0 z-10 flex h-screen w-56 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-14 items-center border-b border-zinc-200 px-5 dark:border-zinc-800">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            Property OS
          </Link>
        </div>
        <SidebarNav />
      </aside>
      <main className="pl-56">
        <div className="min-h-screen px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
