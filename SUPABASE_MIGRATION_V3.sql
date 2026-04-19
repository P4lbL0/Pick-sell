-- ============================================================
-- MIGRATION V3 — Tracking & suivi des ventes
-- À exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Table des événements utilisateur (vues / clics)
CREATE TABLE IF NOT EXISTS product_events (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type  TEXT NOT NULL
                CHECK (event_type IN (
                  'view_page',       -- visite d'une page
                  'view_product',    -- clic sur une fiche produit
                  'click_vinted',    -- clic sur le bouton Acheter (Vinted)
                  'click_service',   -- clic sur un CTA service (repair/custom/buyback)
                  'click_cta'        -- autre CTA générique
                )),
  product_id  BIGINT REFERENCES products(id) ON DELETE CASCADE,
  universe    TEXT CHECK (universe IN ('horlogerie', 'informatique', 'global')),
  path        TEXT,
  referrer    TEXT,
  session_id  TEXT,
  user_agent  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_events_product  ON product_events(product_id);
CREATE INDEX IF NOT EXISTS idx_product_events_type     ON product_events(event_type);
CREATE INDEX IF NOT EXISTS idx_product_events_universe ON product_events(universe);
CREATE INDEX IF NOT EXISTS idx_product_events_created  ON product_events(created_at DESC);

ALTER TABLE product_events ENABLE ROW LEVEL SECURITY;

-- Insertion publique (tout visiteur peut logger un event)
CREATE POLICY "product_events_insert_public" ON product_events
  FOR INSERT WITH CHECK (true);

-- Lecture réservée à l'admin (service_role) ou utilisateur authentifié
CREATE POLICY "product_events_select_admin" ON product_events
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 2. Colonnes "vendu" sur la table products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS sold_at      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sold_price   NUMERIC,
  ADD COLUMN IF NOT EXISTS sold_channel TEXT
    CHECK (sold_channel IN ('vinted', 'direct', 'autre'));

CREATE INDEX IF NOT EXISTS idx_products_sold_at ON products(sold_at DESC);
