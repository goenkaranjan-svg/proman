"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PropertyRow = {
  id: string;
  organization_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
};

export type CreatePropertyInput = {
  name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country?: string;
};

export async function getProperties(): Promise<{
  data: PropertyRow[] | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as PropertyRow[], error: null };
}

async function getFirstOrganizationId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .in("role", ["admin", "owner"])
    .limit(1)
    .single();

  return data?.organization_id ?? null;
}

export type CreatePropertyResult =
  | { success: true }
  | { success: false; error: string };

export async function createProperty(
  input: CreatePropertyInput
): Promise<CreatePropertyResult> {
  const supabase = await createClient();
  const orgId = await getFirstOrganizationId();
  if (!orgId) {
    return { success: false, error: "You need to belong to an organization as admin or owner to add properties." };
  }

  const { error } = await supabase.from("properties").insert({
    organization_id: orgId,
    name: input.name.trim(),
    address_line1: input.address_line1.trim(),
    address_line2: input.address_line2?.trim() || null,
    city: input.city.trim(),
    state: input.state?.trim() || null,
    postal_code: input.postal_code.trim(),
    country: (input.country?.trim() || "US").toUpperCase(),
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/properties");
  return { success: true };
}
