-- ============================================================
-- MIGRATION V2 — À exécuter dans Supabase > SQL Editor
-- ============================================================

-- 1. Ajout des colonnes image/vidéo de fond sur content_blocks
ALTER TABLE content_blocks
  ADD COLUMN IF NOT EXISTS bg_image_url        TEXT,
  ADD COLUMN IF NOT EXISTS bg_video_url        TEXT,
  ADD COLUMN IF NOT EXISTS bg_overlay_opacity  FLOAT DEFAULT 0.55;

-- 2. Table des messages de contact
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  subject    TEXT,
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'new'
               CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut soumettre un message
CREATE POLICY "contact_messages_insert_public" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Seul l'admin (service_role) peut lire
CREATE POLICY "contact_messages_select_admin" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

CREATE POLICY "contact_messages_update_admin" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 3. (Optionnel) Blocs de contenu par défaut pour les pages
--    Ces blocs seront éditables depuis l'admin > Blocs de contenu
INSERT INTO content_blocks (key, title, content, universe) VALUES
  (
    'concept-horlogerie',
    'Notre Concept',
    '<p>Chez Ssæa Montres, nous nous dédions à l''art de l''horlogerie. Notre passion est de proposer des montres de qualité, des modifications exclusives de modèles Seiko ou des pièces reconditionnées avec soin.</p><p>Chaque montre est sélectionnée avec rigueur et traitée avec expertise.</p>',
    'horlogerie'
  ),
  (
    'concept-informatique',
    'L''Informatique Durable',
    '<p>Nous sélectionnons des ordinateurs et accessoires informatiques de haute qualité, reconditionnés et testés. Une alternative écologique et économique sans compromis sur la performance.</p>',
    'informatique'
  )
ON CONFLICT DO NOTHING;

-- 4. Colonne universe sur contacts (horlogerie / informatique / global)
ALTER TABLE contacts
  ADD COLUMN IF NOT EXISTS universe TEXT NOT NULL DEFAULT 'global'
    CHECK (universe IN ('global', 'horlogerie', 'informatique'));
