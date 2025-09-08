-- RPC: Archive oldest products beyond keep limit
CREATE OR REPLACE FUNCTION public.archive_overlimit_products(
  p_user_id uuid,
  p_keep integer,
  p_delete_at timestamptz,
  p_reason text
) RETURNS void AS $$
BEGIN
  UPDATE public.products p
  SET archived_at = NOW(),
      delete_at    = p_delete_at,
      archived_reason = COALESCE(p_reason, 'plan_downgrade')
  WHERE p.user_id = p_user_id
    AND p.archived_at IS NULL
    AND p.id IN (
      SELECT id FROM public.products
      WHERE user_id = p_user_id AND archived_at IS NULL
      ORDER BY created_at DESC
      OFFSET GREATEST(p_keep, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Archive oldest catalogs beyond keep limit
CREATE OR REPLACE FUNCTION public.archive_overlimit_catalogs(
  p_user_id uuid,
  p_keep integer,
  p_delete_at timestamptz,
  p_reason text
) RETURNS void AS $$
BEGIN
  UPDATE public.catalogs c
  SET archived_at = NOW(),
      delete_at    = p_delete_at,
      archived_reason = COALESCE(p_reason, 'plan_downgrade')
  WHERE c.user_id = p_user_id
    AND c.archived_at IS NULL
    AND c.id IN (
      SELECT id FROM public.catalogs
      WHERE user_id = p_user_id AND archived_at IS NULL
      ORDER BY created_at DESC
      OFFSET GREATEST(p_keep, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Unarchive all plan-downgrade archived items for user (used on upgrade)
CREATE OR REPLACE FUNCTION public.unarchive_user_items(
  p_user_id uuid
) RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET archived_at = NULL, delete_at = NULL, archived_reason = NULL
  WHERE user_id = p_user_id AND archived_reason = 'plan_downgrade';

  UPDATE public.catalogs
  SET archived_at = NULL, delete_at = NULL, archived_reason = NULL
  WHERE user_id = p_user_id AND archived_reason = 'plan_downgrade';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Cleanup expired archived items (hard delete)
CREATE OR REPLACE FUNCTION public.cleanup_expired_items(
  p_user_id uuid
) RETURNS void AS $$
BEGIN
  DELETE FROM public.catalogs WHERE user_id = p_user_id AND delete_at IS NOT NULL AND delete_at < NOW();
  DELETE FROM public.products WHERE user_id = p_user_id AND delete_at IS NOT NULL AND delete_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
