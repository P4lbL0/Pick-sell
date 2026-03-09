-- ============================================================
-- 1. Mise à jour de la table products
-- ============================================================
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS vinted_url TEXT;

-- ============================================================
-- 2. Table product_colors (Variantes de couleur)
-- ============================================================
-- Note : product_id est en BIGINT pour correspondre à products(id)
CREATE TABLE IF NOT EXISTS product_colors (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  hex_color   TEXT NOT NULL DEFAULT '#000000',
  image_url   TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id 
  ON product_colors(product_id);

-- Sécurité RLS
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_colors_read_all" ON product_colors
  FOR SELECT USING (true);

CREATE POLICY "product_colors_write_authenticated" ON product_colors
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 3. Table service_quotes (Grilles tarifaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS service_quotes (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  universe     TEXT NOT NULL CHECK (universe IN ('horlogerie', 'informatique')),
  service_type TEXT NOT NULL CHECK (service_type IN ('repair', 'custom', 'buyback')),
  items        JSONB NOT NULL DEFAULT '[]'::jsonb,
  note         TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les filtres
CREATE INDEX IF NOT EXISTS idx_service_quotes_universe ON service_quotes(universe);
CREATE INDEX IF NOT EXISTS idx_service_quotes_service_type ON service_quotes(service_type);

-- Sécurité RLS
ALTER TABLE service_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_quotes_read_all" ON service_quotes
  FOR SELECT USING (true);

CREATE POLICY "service_quotes_write_authenticated" ON service_quotes
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 4. Automatisation du champ updated_at
-- ============================================================

-- Fonction qui met à jour le timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour la table service_quotes
DROP TRIGGER IF EXISTS tr_service_quotes_updated_at ON service_quotes;
CREATE TRIGGER tr_service_quotes_updated_at
    BEFORE UPDATE ON service_quotes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();