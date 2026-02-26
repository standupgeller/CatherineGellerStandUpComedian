ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS show_videos_section BOOLEAN NOT NULL DEFAULT true;
