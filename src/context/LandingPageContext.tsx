import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
type AboutSection = Database['public']['Tables']['about_section']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];
type Video = Database['public']['Tables']['videos']['Row'];
type TourDate = Database['public']['Tables']['tour_dates']['Row'];
type ArchiveCategory = Database['public']['Tables']['archive_categories']['Row'];
type ContactSettings = Database['public']['Tables']['contact_settings']['Row'];
type FooterSettings = Database['public']['Tables']['footer_settings']['Row'];
type NavLink = Database['public']['Tables']['nav_links']['Row'];

interface LandingPageContextType {
  siteSettings: SiteSettings | null;
  aboutSection: AboutSection | null;
  projects: Project[];
  videos: Video[];
  tourDates: TourDate[];
  archiveCategories: ArchiveCategory[];
  contactSettings: ContactSettings | null;
  footerSettings: FooterSettings | null;
  navLinks: NavLink[];
  loading: boolean;
}

const LandingPageContext = createContext<LandingPageContextType | undefined>(undefined);

export const LandingPageProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [archiveCategories, setArchiveCategories] = useState<ArchiveCategory[]>([]);
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  const fetchAllData = async () => {
    try {
      const [
        settingsRes,
        aboutRes,
        projectsRes,
        videosRes,
        tourRes,
        archiveRes,
        contactRes,
        footerRes,
        navRes
      ] = await Promise.all([
        supabase.from('site_settings').select('*').maybeSingle(),
        supabase.from('about_section').select('*').maybeSingle(),
        supabase.from('projects').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('videos').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('tour_dates').select('*').eq('is_visible', true).order('event_date'),
        supabase.from('archive_categories').select('*').eq('is_visible', true).order('sort_order'),
        supabase.from('contact_settings').select('*').maybeSingle(),
        supabase.from('footer_settings').select('*').maybeSingle(),
        supabase.from('nav_links').select('*').eq('is_visible', true).order('sort_order')
      ]);

      if (settingsRes.data) setSiteSettings(settingsRes.data);
      if (aboutRes.data) setAboutSection(aboutRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (videosRes.data) setVideos(videosRes.data);
      if (tourRes.data) setTourDates(tourRes.data);
      if (archiveRes.data) setArchiveCategories(archiveRes.data);
      if (contactRes.data) setContactSettings(contactRes.data);
      if (footerRes.data) setFooterSettings(footerRes.data);
      if (navRes.data) setNavLinks(navRes.data);
    } catch (error) {
      console.error("Error fetching landing page data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const channels = [
      supabase.channel('public:site_settings').on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => fetchAllData()),
      supabase.channel('public:about_section').on('postgres_changes', { event: '*', schema: 'public', table: 'about_section' }, () => fetchAllData()),
      supabase.channel('public:projects').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => fetchAllData()),
      supabase.channel('public:videos').on('postgres_changes', { event: '*', schema: 'public', table: 'videos' }, () => fetchAllData()),
      supabase.channel('public:tour_dates').on('postgres_changes', { event: '*', schema: 'public', table: 'tour_dates' }, () => fetchAllData()),
      supabase.channel('public:archive_categories').on('postgres_changes', { event: '*', schema: 'public', table: 'archive_categories' }, () => fetchAllData()),
      supabase.channel('public:contact_settings').on('postgres_changes', { event: '*', schema: 'public', table: 'contact_settings' }, () => fetchAllData()),
      supabase.channel('public:footer_settings').on('postgres_changes', { event: '*', schema: 'public', table: 'footer_settings' }, () => fetchAllData()),
      supabase.channel('public:nav_links').on('postgres_changes', { event: '*', schema: 'public', table: 'nav_links' }, () => fetchAllData()),
    ];

    channels.forEach(channel => channel.subscribe());

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  return (
    <LandingPageContext.Provider
      value={{
        siteSettings,
        aboutSection,
        projects,
        videos,
        tourDates,
        archiveCategories,
        contactSettings,
        footerSettings,
        navLinks,
        loading
      }}
    >
      {children}
    </LandingPageContext.Provider>
  );
};

export const useLandingPage = () => {
  const context = useContext(LandingPageContext);
  if (context === undefined) {
    throw new Error("useLandingPage must be used within a LandingPageProvider");
  }
  return context;
};
