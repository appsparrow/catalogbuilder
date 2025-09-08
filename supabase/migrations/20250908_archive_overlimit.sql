-- Add archiving columns for over-limit retention policy
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS delete_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_reason text;

ALTER TABLE public.catalogs
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS delete_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_reason text;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_products_archived_at ON public.products(archived_at);
CREATE INDEX IF NOT EXISTS idx_products_delete_at ON public.products(delete_at);
CREATE INDEX IF NOT EXISTS idx_catalogs_archived_at ON public.catalogs(archived_at);
CREATE INDEX IF NOT EXISTS idx_catalogs_delete_at ON public.catalogs(delete_at);
