-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles - admins can see all, users can see their own
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Site Settings table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_name TEXT NOT NULL DEFAULT 'Catherine Geller',
    site_tagline TEXT DEFAULT 'Stand-Up Comedian',
    hero_title TEXT DEFAULT 'CATHERINE GELLER',
    hero_subtitle TEXT DEFAULT 'Making audiences laugh one punchline at a time.',
    hero_image_url TEXT,
    hero_background_gradient TEXT DEFAULT 'from-primary via-primary/90 to-burgundy-light',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Navigation Links table
CREATE TABLE public.nav_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- About Section table
CREATE TABLE public.about_section (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT 'About',
    subtitle TEXT DEFAULT 'The Story',
    content TEXT,
    image_url TEXT,
    stats JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects table
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    link_text TEXT DEFAULT 'View Project',
    category TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Watch Section (Videos) table
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    youtube_url TEXT,
    youtube_embed_id TEXT,
    thumbnail_url TEXT,
    duration TEXT,
    views TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    watermark_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tour Dates table
CREATE TABLE public.tour_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT DEFAULT 'USA',
    event_date DATE NOT NULL,
    event_time TIME,
    ticket_url TEXT,
    ticket_price TEXT,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'cancelled', 'postponed')),
    additional_info TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Archive Categories table
CREATE TABLE public.archive_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Archive Items table
CREATE TABLE public.archive_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.archive_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    link_url TEXT,
    date TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact Section Settings table
CREATE TABLE public.contact_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT DEFAULT 'Contact',
    subtitle TEXT DEFAULT 'Get in Touch',
    description TEXT DEFAULT 'For booking inquiries, press requests, or just to say hi.',
    management_email TEXT DEFAULT 'booking@catherinegeller.com',
    instagram_url TEXT,
    twitter_url TEXT,
    youtube_url TEXT,
    tiktok_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact Form Submissions table
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Footer Settings table
CREATE TABLE public.footer_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    copyright_text TEXT DEFAULT '© 2024 Catherine Geller. All rights reserved.',
    show_social_links BOOLEAN NOT NULL DEFAULT true,
    additional_links JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nav_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies (visitors can read visible content)
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read visible nav links" ON public.nav_links FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read about section" ON public.about_section FOR SELECT USING (true);
CREATE POLICY "Public can read visible projects" ON public.projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible videos" ON public.videos FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible tour dates" ON public.tour_dates FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible archive categories" ON public.archive_categories FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read visible archive items" ON public.archive_items FOR SELECT USING (is_visible = true);
CREATE POLICY "Public can read contact settings" ON public.contact_settings FOR SELECT USING (true);
CREATE POLICY "Public can read footer settings" ON public.footer_settings FOR SELECT USING (true);

-- Public can submit contact forms
CREATE POLICY "Public can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);

-- Admin write policies
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage nav links" ON public.nav_links FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage about section" ON public.about_section FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage videos" ON public.videos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage tour dates" ON public.tour_dates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage archive categories" ON public.archive_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage archive items" ON public.archive_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage contact settings" ON public.contact_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage contact submissions" ON public.contact_submissions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage footer settings" ON public.footer_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default data
INSERT INTO public.site_settings (site_name, site_tagline, hero_title, hero_subtitle) VALUES ('Catherine Geller', 'Stand-Up Comedian', 'CATHERINE GELLER', 'Making audiences laugh one punchline at a time. Raw, honest, and unapologetically hilarious.');

INSERT INTO public.nav_links (name, href, sort_order) VALUES 
('About', '#about', 1),
('Projects', '#projects', 2),
('Watch', '#watch', 3),
('Tour', '#tour', 4),
('Archive', '#archive', 5),
('Contact', '#contact', 6);

INSERT INTO public.about_section (title, subtitle, content) VALUES ('About', 'The Story', 'With over a decade in comedy, I''ve performed on stages across the country, from intimate clubs to sold-out theaters. My comedy is raw, honest, and unapologetically me.');

INSERT INTO public.contact_settings (title, subtitle, description, management_email) VALUES ('Contact', 'Get in Touch', 'For booking inquiries, press requests, or just to say hi — reach out through the form or connect on social media.', 'booking@catherinegeller.com');

INSERT INTO public.footer_settings (copyright_text) VALUES ('© 2024 Catherine Geller. All rights reserved.');

-- Update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply update triggers
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_nav_links_updated_at BEFORE UPDATE ON public.nav_links FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_about_section_updated_at BEFORE UPDATE ON public.about_section FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tour_dates_updated_at BEFORE UPDATE ON public.tour_dates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_archive_categories_updated_at BEFORE UPDATE ON public.archive_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_archive_items_updated_at BEFORE UPDATE ON public.archive_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_settings_updated_at BEFORE UPDATE ON public.contact_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_footer_settings_updated_at BEFORE UPDATE ON public.footer_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();