"use server";

import { createClient } from "@/lib/supabase/server";

export type DashboardStats = {
  properties: number;
  tenants: number;
  activeLeases: number;
  pendingPayments: number;
  openMaintenance: number;
};

export async function getDashboardStats(): Promise<{
  data: DashboardStats | null;
  error: string | null;
}> {
  const supabase = await createClient();

  try {
    // Get counts for each entity
    const [propertiesRes, tenantsRes, leasesRes, paymentsRes, maintenanceRes] =
      await Promise.all([
        supabase.from("properties").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("leases")
          .select("id", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("payments")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("maintenance_tickets")
          .select("id", { count: "exact", head: true })
          .eq("status", "open"),
      ]);

    return {
      data: {
        properties: propertiesRes.count ?? 0,
        tenants: tenantsRes.count ?? 0,
        activeLeases: leasesRes.count ?? 0,
        pendingPayments: paymentsRes.count ?? 0,
        openMaintenance: maintenanceRes.count ?? 0,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to fetch stats",
    };
  }
}
