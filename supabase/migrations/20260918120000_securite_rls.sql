-- ============================================================
-- Sécurité : fermeture des accès publics en écriture
-- ============================================================
-- Depuis cette version, toutes les écritures passent par les routes API
-- serveur (clé service, qui ignore la RLS) derrière une connexion admin.
-- La clé publique (anon) ne doit plus pouvoir que LIRE le contenu du site.
--
-- Les noms des policies existantes n'étant pas connus (créées à la main),
-- on les supprime toutes puis on recrée uniquement la lecture publique.

DO $$
DECLARE
  r record;
BEGIN
  -- 1. Toutes les policies des tables de l'application
  FOR r IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'products', 'product_colors', 'product_events', 'services', 'service_quotes',
        'hero_slides', 'content_blocks', 'contacts', 'contact_messages',
        'quote_form_configs', 'quote_requests', 'reviews'
      )
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;

  -- 2. Toutes les policies du stockage (un seul bucket : products).
  --    Le bucket est public : les URLs publiques des images restent lisibles sans policy.
  FOR r IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', r.policyname);
  END LOOP;
END $$;

-- 3. RLS activée partout (sans policy = aucun accès pour anon / authenticated)
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_colors     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_quotes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_form_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews            ENABLE ROW LEVEL SECURITY;

-- 4. Lecture publique du contenu affiché sur le site
CREATE POLICY lecture_publique ON public.products           FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.product_colors     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.services           FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.hero_slides        FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.content_blocks     FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.contacts           FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.quote_form_configs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY lecture_publique ON public.reviews            FOR SELECT TO anon, authenticated USING (true);
-- Pas de policy (accès serveur uniquement) : product_events, service_quotes,
-- contact_messages, quote_requests.

-- 5. Garde-fous du bucket : 5 Mo, images uniquement (identique à /api/upload)
UPDATE storage.buckets
SET file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
WHERE id = 'products';
