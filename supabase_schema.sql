-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new'::text CHECK (status = ANY (ARRAY['new'::text, 'read'::text, 'archived'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contacts (
  id bigint NOT NULL DEFAULT nextval('contacts_id_seq'::regclass),
  platform character varying NOT NULL UNIQUE,
  url character varying,
  icon character varying,
  created_at timestamp without time zone DEFAULT now(),
  universe text NOT NULL DEFAULT 'horlogerie'::text CHECK (universe = ANY (ARRAY['horlogerie'::text, 'informatique'::text])),
  CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.content_blocks (
  id bigint NOT NULL DEFAULT nextval('content_blocks_id_seq'::regclass),
  key character varying NOT NULL UNIQUE,
  title character varying,
  content text,
  universe character varying,
  created_at timestamp without time zone DEFAULT now(),
  bg_image_url text,
  bg_video_url text,
  bg_overlay_opacity double precision DEFAULT 0.55,
  CONSTRAINT content_blocks_pkey PRIMARY KEY (id)
);
CREATE TABLE public.hero_slides (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  subtitle character varying,
  image_url character varying NOT NULL,
  video_url character varying,
  universe_type character varying NOT NULL DEFAULT 'global'::character varying,
  cta_text character varying,
  cta_link character varying,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT hero_slides_pkey PRIMARY KEY (id)
);
CREATE TABLE public.product_colors (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id bigint NOT NULL,
  name text NOT NULL,
  hex_color text NOT NULL DEFAULT '#000000'::text,
  image_url text,
  stock integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT product_colors_pkey PRIMARY KEY (id),
  CONSTRAINT product_colors_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.products (
  id bigint NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  title character varying NOT NULL,
  price numeric NOT NULL,
  category character varying,
  universe character varying NOT NULL,
  stock integer DEFAULT 0,
  short_description text,
  long_description text,
  vinted_link character varying,
  image_url character varying,
  created_at timestamp without time zone DEFAULT now(),
  vinted_url text,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quote_form_configs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  universe text NOT NULL CHECK (universe = ANY (ARRAY['horlogerie'::text, 'informatique'::text])),
  service_type text NOT NULL CHECK (service_type = ANY (ARRAY['repair'::text, 'custom'::text, 'buyback'::text])),
  fields jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quote_form_configs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quote_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  universe text NOT NULL CHECK (universe = ANY (ARRAY['horlogerie'::text, 'informatique'::text])),
  service_type text NOT NULL CHECK (service_type = ANY (ARRAY['repair'::text, 'custom'::text, 'buyback'::text])),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'new'::text CHECK (status = ANY (ARRAY['new'::text, 'read'::text, 'in_progress'::text, 'done'::text, 'rejected'::text])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quote_requests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reviews (
  id bigint NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
  rating integer NOT NULL,
  text text,
  author character varying,
  source character varying,
  image_url character varying,
  product_id bigint,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);
CREATE TABLE public.service_quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  universe text NOT NULL CHECK (universe = ANY (ARRAY['horlogerie'::text, 'informatique'::text])),
  service_type text NOT NULL CHECK (service_type = ANY (ARRAY['repair'::text, 'custom'::text, 'buyback'::text])),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  note text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_quotes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services (
  id bigint NOT NULL DEFAULT nextval('services_id_seq'::regclass),
  title character varying NOT NULL,
  slug character varying UNIQUE,
  description text,
  type character varying,
  universe character varying NOT NULL,
  contact_url character varying,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);