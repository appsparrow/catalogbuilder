-- Admin allow-list table
CREATE TABLE IF NOT EXISTS public.admin_emails (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now()
);

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_emails a WHERE lower(a.email) = lower(auth.email()));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin-only aggregated stats
CREATE OR REPLACE FUNCTION public.admin_counts()
RETURNS TABLE(
  active_subscriptions integer,
  total_subscriptions integer,
  total_products integer,
  total_catalogs integer
) AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.user_subscriptions WHERE status = 'active')::int,
    (SELECT count(*) FROM public.user_subscriptions)::int,
    (SELECT count(*) FROM public.products)::int,
    (SELECT count(*) FROM public.catalogs)::int;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed default admin (can be updated later)
INSERT INTO public.admin_emails(email)
VALUES ('admin@streakzilla.com')
ON CONFLICT (email) DO NOTHING;
