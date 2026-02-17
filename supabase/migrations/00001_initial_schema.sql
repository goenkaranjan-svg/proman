-- Property OS – Multi-tenant property management schema for Supabase
-- PostgreSQL 15+ compatible

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('admin', 'owner', 'tenant');

CREATE TYPE lease_status AS ENUM ('draft', 'active', 'expired', 'terminated');

CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');

CREATE TYPE maintenance_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TYPE maintenance_status AS ENUM ('open', 'in_progress', 'resolved', 'cancelled');

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Tenant of the SaaS (property management company / portfolio)
CREATE TABLE organizations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_organizations_slug ON organizations (slug);

-- Profiles extend Supabase auth.users (id = auth.uid())
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name  TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User membership and role per organization
CREATE TABLE organization_members (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES profiles (id) ON DELETE CASCADE,
  role           user_role NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_organization_members_org ON organization_members (organization_id);
CREATE INDEX idx_organization_members_user ON organization_members (user_id);
CREATE INDEX idx_organization_members_role ON organization_members (organization_id, role);

-- =============================================================================
-- PROPERTIES & UNITS
-- =============================================================================

CREATE TABLE properties (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  address_line1  TEXT NOT NULL,
  address_line2  TEXT,
  city           TEXT NOT NULL,
  state          TEXT,
  postal_code    TEXT NOT NULL,
  country        TEXT NOT NULL DEFAULT 'US',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_properties_organization ON properties (organization_id);
CREATE INDEX idx_properties_city ON properties (city);
CREATE INDEX idx_properties_organization_updated ON properties (organization_id, updated_at DESC);

CREATE TABLE units (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties (id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  bedrooms    INT NOT NULL DEFAULT 0,
  bathrooms   DECIMAL(3, 1) NOT NULL DEFAULT 0,
  square_feet INT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (property_id, name)
);

CREATE INDEX idx_units_property ON units (property_id);

-- =============================================================================
-- LEASES
-- =============================================================================

CREATE TABLE leases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES units (id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  monthly_rent DECIMAL(12, 2) NOT NULL,
  status      lease_status NOT NULL DEFAULT 'draft',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lease_dates_valid CHECK (end_date >= start_date)
);

CREATE INDEX idx_leases_unit ON leases (unit_id);
CREATE INDEX idx_leases_tenant ON leases (tenant_id);
CREATE INDEX idx_leases_status ON leases (status);
CREATE INDEX idx_leases_dates ON leases (start_date, end_date);

-- =============================================================================
-- PAYMENTS
-- =============================================================================

CREATE TABLE payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lease_id    UUID NOT NULL REFERENCES leases (id) ON DELETE CASCADE,
  amount      DECIMAL(12, 2) NOT NULL,
  due_date    DATE NOT NULL,
  paid_at     TIMESTAMPTZ,
  status      payment_status NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payment_amount_positive CHECK (amount > 0)
);

CREATE INDEX idx_payments_lease ON payments (lease_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_due_date ON payments (due_date);

-- =============================================================================
-- MAINTENANCE TICKETS
-- =============================================================================

CREATE TABLE maintenance_tickets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES units (id) ON DELETE CASCADE,
  reported_by UUID NOT NULL REFERENCES profiles (id) ON DELETE RESTRICT,
  title       TEXT NOT NULL,
  description TEXT,
  priority    maintenance_priority NOT NULL DEFAULT 'medium',
  status      maintenance_status NOT NULL DEFAULT 'open',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_maintenance_tickets_unit ON maintenance_tickets (unit_id);
CREATE INDEX idx_maintenance_tickets_reported_by ON maintenance_tickets (reported_by);
CREATE INDEX idx_maintenance_tickets_status ON maintenance_tickets (status);
CREATE INDEX idx_maintenance_tickets_priority ON maintenance_tickets (priority);
CREATE INDEX idx_maintenance_tickets_created ON maintenance_tickets (created_at DESC);

-- =============================================================================
-- UPDATED_AT TRIGGER
-- =============================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_organization_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_leases_updated_at
  BEFORE UPDATE ON leases
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_maintenance_tickets_updated_at
  BEFORE UPDATE ON maintenance_tickets
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) – enable for multi-tenant isolation
-- =============================================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations: members can read their orgs
CREATE POLICY "Members can view organization"
  ON organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Organization members: members can view others in same org
CREATE POLICY "Members can view organization members"
  ON organization_members FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );

-- Properties: members of the org can read; admins/owners can mutate
CREATE POLICY "Members can view properties"
  ON properties FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    )
  );
CREATE POLICY "Admins and owners can insert properties"
  ON properties FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );
CREATE POLICY "Admins and owners can update properties"
  ON properties FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );
CREATE POLICY "Admins can delete properties"
  ON properties FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id FROM organization_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Units: same as properties (scoped via property -> organization)
CREATE POLICY "Members can view units"
  ON units FOR SELECT
  USING (
    property_id IN (
      SELECT id FROM properties WHERE organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
  );
CREATE POLICY "Admins and owners can manage units"
  ON units FOR ALL
  USING (
    property_id IN (
      SELECT p.id FROM properties p
      JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('admin', 'owner')
    )
  );

-- Leases: members can view; admins/owners can manage; tenants can view their own
CREATE POLICY "Members can view leases"
  ON leases FOR SELECT
  USING (
    unit_id IN (
      SELECT u.id FROM units u
      JOIN properties p ON p.id = u.property_id
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
    OR tenant_id = auth.uid()
  );
CREATE POLICY "Admins and owners can manage leases"
  ON leases FOR ALL
  USING (
    unit_id IN (
      SELECT u.id FROM units u
      JOIN properties p ON p.id = u.property_id
      JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('admin', 'owner')
    )
  );

-- Payments: visible to org members and to the tenant on the lease
CREATE POLICY "Members and lease tenant can view payments"
  ON payments FOR SELECT
  USING (
    lease_id IN (
      SELECT l.id FROM leases l
      JOIN units u ON u.id = l.unit_id
      JOIN properties p ON p.id = u.property_id
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
      OR l.tenant_id = auth.uid()
    )
  );
CREATE POLICY "Admins and owners can manage payments"
  ON payments FOR ALL
  USING (
    lease_id IN (
      SELECT l.id FROM leases l
      JOIN units u ON u.id = l.unit_id
      JOIN properties p ON p.id = u.property_id
      JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('admin', 'owner')
    )
  );

-- Maintenance tickets: members can view; admins/owners can manage; reporters can view own
CREATE POLICY "Members can view maintenance tickets"
  ON maintenance_tickets FOR SELECT
  USING (
    unit_id IN (
      SELECT u.id FROM units u
      JOIN properties p ON p.id = u.property_id
      WHERE p.organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
      )
    )
    OR reported_by = auth.uid()
  );
CREATE POLICY "Admins and owners can manage maintenance tickets"
  ON maintenance_tickets FOR ALL
  USING (
    unit_id IN (
      SELECT u.id FROM units u
      JOIN properties p ON p.id = u.property_id
      JOIN organization_members om ON om.organization_id = p.organization_id
      WHERE om.user_id = auth.uid() AND om.role IN ('admin', 'owner')
    )
  );
CREATE POLICY "Tenants can create maintenance tickets for their unit"
  ON maintenance_tickets FOR INSERT
  WITH CHECK (
    reported_by = auth.uid()
    AND unit_id IN (
      SELECT l.unit_id FROM leases l
      WHERE l.tenant_id = auth.uid() AND l.status = 'active'
    )
  );
