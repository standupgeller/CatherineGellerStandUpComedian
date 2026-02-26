ALTER TABLE public.site_settings 
  ADD COLUMN IF NOT EXISTS show_projects_section BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_archive_section BOOLEAN NOT NULL DEFAULT true;
