ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS privacy_policy TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS terms_of_service TEXT;
