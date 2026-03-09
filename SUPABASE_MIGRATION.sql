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

-- ============================================================
-- 5. Table quote_requests (Demandes de devis clients)
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_requests (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  universe     TEXT NOT NULL CHECK (universe IN ('horlogerie', 'informatique')),
  service_type TEXT NOT NULL CHECK (service_type IN ('repair', 'custom', 'buyback')),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  data         JSONB NOT NULL DEFAULT '{}'::jsonb,
  status       TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'in_progress', 'done', 'rejected')),
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_universe     ON quote_requests(universe);
CREATE INDEX IF NOT EXISTS idx_quote_requests_service_type ON quote_requests(service_type);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status       ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created      ON quote_requests(created_at DESC);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut soumettre une demande
CREATE POLICY "quote_requests_insert_public" ON quote_requests
  FOR INSERT WITH CHECK (true);

-- Seuls les admins (authenticated) peuvent lire / mettre à jour
CREATE POLICY "quote_requests_select_authenticated" ON quote_requests
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "quote_requests_update_authenticated" ON quote_requests
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- ============================================================
-- 6. Table quote_form_configs (Configuration des formulaires)
-- ============================================================
CREATE TABLE IF NOT EXISTS quote_form_configs (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  universe     TEXT NOT NULL CHECK (universe IN ('horlogerie', 'informatique')),
  service_type TEXT NOT NULL CHECK (service_type IN ('repair', 'custom', 'buyback')),
  fields       JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(universe, service_type)
);

ALTER TABLE quote_form_configs ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire la config (pour afficher les formulaires publics)
CREATE POLICY "quote_form_configs_read_all" ON quote_form_configs
  FOR SELECT USING (true);

CREATE POLICY "quote_form_configs_write_authenticated" ON quote_form_configs
  FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP TRIGGER IF EXISTS tr_quote_form_configs_updated_at ON quote_form_configs;
CREATE TRIGGER tr_quote_form_configs_updated_at
    BEFORE UPDATE ON quote_form_configs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. Configs par défaut pour les formulaires
-- ============================================================

-- horlogerie / repair
INSERT INTO quote_form_configs (universe, service_type, fields) VALUES (
  'horlogerie', 'repair',
  $f$[
    {"name":"name","label":"Nom","type":"text","required":true,"placeholder":"Votre nom","row":1},
    {"name":"email","label":"Email","type":"email","required":true,"placeholder":"votre@email.com","row":1},
    {"name":"phone","label":"Téléphone","type":"tel","required":false,"placeholder":"06 XX XX XX XX","row":2},
    {"name":"watchBrand","label":"Marque de la montre","type":"text","required":true,"placeholder":"Ex: Seiko, Casio, Omega...","row":3},
    {"name":"watchModel","label":"Modèle","type":"text","required":false,"placeholder":"Ex: SKX007, Submariner...","row":3},
    {"name":"serviceType","label":"Type de service","type":"select","required":true,"placeholder":"-- Sélectionnez --","options":[
      {"value":"revision","label":"Révision complète"},
      {"value":"repair","label":"Réparation"},
      {"value":"restoration","label":"Restauration cosmétique"},
      {"value":"battery","label":"Changement de pile"},
      {"value":"glass","label":"Remplacement verre"},
      {"value":"bracelet","label":"Remplacement bracelet"},
      {"value":"other","label":"Autre"}
    ],"row":4},
    {"name":"description","label":"Description du problème","type":"textarea","required":true,"placeholder":"Décrivez le problème ou le service souhaité en détail...","row":5}
  ]$f$::jsonb
) ON CONFLICT (universe, service_type) DO NOTHING;

-- horlogerie / custom
INSERT INTO quote_form_configs (universe, service_type, fields) VALUES (
  'horlogerie', 'custom',
  $f$[
    {"name":"name","label":"Nom","type":"text","required":true,"placeholder":"Votre nom","row":1},
    {"name":"email","label":"Email","type":"email","required":true,"placeholder":"votre@email.com","row":1},
    {"name":"phone","label":"Téléphone","type":"tel","required":false,"placeholder":"06 XX XX XX XX","row":2},
    {"name":"baseModel","label":"Modèle de base","type":"text","required":true,"placeholder":"Ex: Seiko SKX007, NH35 build, Vostok Amphibia...","row":3},
    {"name":"modifications","label":"Modifications souhaitées","type":"checkbox-group","required":false,"options":[
      {"value":"dial","label":"Cadran personnalisé"},
      {"value":"hands","label":"Aiguilles"},
      {"value":"bezel","label":"Lunette / Bezel insert"},
      {"value":"crystal","label":"Verre saphir"},
      {"value":"crown","label":"Couronne"},
      {"value":"caseback","label":"Fond de boîtier"},
      {"value":"strap","label":"Bracelet / Strap"},
      {"value":"chapter-ring","label":"Chapter ring"}
    ],"row":4},
    {"name":"dialColor","label":"Couleur du cadran souhaitée","type":"text","required":false,"placeholder":"Ex: Bleu soleillé, Noir mat, Vert...","row":5},
    {"name":"handsStyle","label":"Style d aiguilles","type":"text","required":false,"placeholder":"Ex: Mercedes, Dauphine, Sword...","row":5},
    {"name":"budget","label":"Budget estimé","type":"select","required":false,"placeholder":"-- Sélectionnez --","options":[
      {"value":"100-200","label":"100€ - 200€"},
      {"value":"200-400","label":"200€ - 400€"},
      {"value":"400-600","label":"400€ - 600€"},
      {"value":"600+","label":"600€ et plus"}
    ],"row":6},
    {"name":"additionalNotes","label":"Notes supplémentaires","type":"textarea","required":false,"placeholder":"Partagez vos inspirations, liens vers des images, préférences...","row":7}
  ]$f$::jsonb
) ON CONFLICT (universe, service_type) DO NOTHING;

-- informatique / repair
INSERT INTO quote_form_configs (universe, service_type, fields) VALUES (
  'informatique', 'repair',
  $f$[
    {"name":"name","label":"Nom","type":"text","required":true,"placeholder":"Votre nom","row":1},
    {"name":"email","label":"Email","type":"email","required":true,"placeholder":"votre@email.com","row":1},
    {"name":"phone","label":"Téléphone","type":"tel","required":false,"placeholder":"06 XX XX XX XX","row":2},
    {"name":"deviceType","label":"Type d appareil","type":"select","required":true,"placeholder":"-- Sélectionnez --","options":[
      {"value":"laptop","label":"PC Portable"},
      {"value":"desktop","label":"PC Bureau / Tour"},
      {"value":"all-in-one","label":"PC All-in-One"},
      {"value":"component","label":"Composant seul"},
      {"value":"peripheral","label":"Périphérique"},
      {"value":"other","label":"Autre"}
    ],"row":3},
    {"name":"brand","label":"Marque","type":"text","required":true,"placeholder":"Ex: Asus, Dell, HP...","row":3},
    {"name":"model","label":"Modèle","type":"text","required":false,"placeholder":"Ex: ROG Strix G15...","row":3},
    {"name":"serviceType","label":"Type de service","type":"select","required":true,"placeholder":"-- Sélectionnez --","options":[
      {"value":"screen","label":"Remplacement écran"},
      {"value":"keyboard","label":"Remplacement clavier"},
      {"value":"battery","label":"Remplacement batterie"},
      {"value":"motherboard","label":"Réparation carte mère"},
      {"value":"thermal","label":"Nettoyage + pâte thermique"},
      {"value":"upgrade","label":"Upgrade (RAM, SSD, etc.)"},
      {"value":"os","label":"Installation / réinstallation OS"},
      {"value":"virus","label":"Suppression virus / malware"},
      {"value":"data","label":"Récupération de données"},
      {"value":"diagnostic","label":"Diagnostic complet"},
      {"value":"other","label":"Autre"}
    ],"row":4},
    {"name":"description","label":"Description du problème","type":"textarea","required":true,"placeholder":"Décrivez le problème rencontré : symptômes, messages d erreur...","row":5}
  ]$f$::jsonb
) ON CONFLICT (universe, service_type) DO NOTHING;

-- informatique / buyback
INSERT INTO quote_form_configs (universe, service_type, fields) VALUES (
  'informatique', 'buyback',
  $f$[
    {"name":"name","label":"Nom","type":"text","required":true,"placeholder":"Votre nom","row":1},
    {"name":"email","label":"Email","type":"email","required":true,"placeholder":"votre@email.com","row":1},
    {"name":"phone","label":"Téléphone","type":"tel","required":false,"placeholder":"06 XX XX XX XX","row":2},
    {"name":"deviceType","label":"Type d appareil","type":"select","required":true,"placeholder":"-- Sélectionnez --","options":[
      {"value":"laptop","label":"PC Portable"},
      {"value":"desktop","label":"PC Bureau / Tour"},
      {"value":"all-in-one","label":"PC All-in-One"},
      {"value":"gpu","label":"Carte graphique"},
      {"value":"cpu","label":"Processeur"},
      {"value":"ram","label":"RAM"},
      {"value":"other-component","label":"Autre composant"},
      {"value":"peripheral","label":"Périphérique"}
    ],"row":3},
    {"name":"brand","label":"Marque","type":"text","required":true,"placeholder":"Ex: Asus, Dell, HP, MSI...","row":3},
    {"name":"model","label":"Modèle","type":"text","required":true,"placeholder":"Ex: ROG Strix G15, RTX 4070...","row":3},
    {"name":"condition","label":"État général","type":"select","required":true,"placeholder":"-- Sélectionnez --","options":[
      {"value":"like-new","label":"Comme neuf (quasi pas utilisé)"},
      {"value":"excellent","label":"Excellent (très bon état)"},
      {"value":"good","label":"Bon état (quelques traces d usure)"},
      {"value":"fair","label":"État correct (usure visible, tout fonctionne)"},
      {"value":"poor","label":"État moyen (défauts cosmétiques)"},
      {"value":"broken","label":"En panne / ne s allume plus"}
    ],"row":4},
    {"name":"processor","label":"Processeur","type":"text","required":false,"placeholder":"Ex: Intel i7-12700H, Ryzen 5 5600X...","row":5},
    {"name":"ram","label":"RAM","type":"text","required":false,"placeholder":"Ex: 16 Go DDR4, 32 Go DDR5...","row":5},
    {"name":"storage","label":"Stockage","type":"text","required":false,"placeholder":"Ex: 512 Go SSD NVMe, 1 To HDD...","row":6},
    {"name":"gpu","label":"Carte graphique","type":"text","required":false,"placeholder":"Ex: RTX 4060, RX 7600...","row":6},
    {"name":"additionalInfo","label":"Informations complémentaires","type":"textarea","required":false,"placeholder":"Accessoires inclus, défauts éventuels, date d achat...","row":7}
  ]$f$::jsonb
) ON CONFLICT (universe, service_type) DO NOTHING;