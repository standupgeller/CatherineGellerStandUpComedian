import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface SiteSettings {
  id: string;
  site_name: string;
  site_tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  hero_background_gradient: string;
}

interface AboutSection {
  id: string;
  title: string;
  subtitle: string;
  content: string | null;
  image_url: string | null;
}

const AdminHeroAbout = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [settingsRes, aboutRes] = await Promise.all([
      supabase.from('site_settings').select('*').maybeSingle(),
      supabase.from('about_section').select('*').maybeSingle()
    ]);

    if (settingsRes.data) setSiteSettings(settingsRes.data);
    if (aboutRes.data) setAboutSection(aboutRes.data);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);

    if (siteSettings) {
      const { error } = await supabase
        .from('site_settings')
        .update(siteSettings)
        .eq('id', siteSettings.id);

      if (error) {
        toast({ title: 'Error saving site settings', variant: 'destructive' });
        setSaving(false);
        return;
      }
    }

    if (aboutSection) {
      const { error } = await supabase
        .from('about_section')
        .update(aboutSection)
        .eq('id', aboutSection.id);

      if (error) {
        toast({ title: 'Error saving about section', variant: 'destructive' });
        setSaving(false);
        return;
      }
    }

    toast({ title: 'Saved successfully' });
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Hero & About</h1>
            <p className="text-muted-foreground mt-1">Edit hero section and about content</p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Site Name</label>
                <Input
                  value={siteSettings?.site_name || ''}
                  onChange={(e) => setSiteSettings(prev => prev ? { ...prev, site_name: e.target.value } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tagline</label>
                <Input
                  value={siteSettings?.site_tagline || ''}
                  onChange={(e) => setSiteSettings(prev => prev ? { ...prev, site_tagline: e.target.value } : null)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Hero Title</label>
              <Input
                value={siteSettings?.hero_title || ''}
                onChange={(e) => setSiteSettings(prev => prev ? { ...prev, hero_title: e.target.value } : null)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Hero Subtitle</label>
              <Textarea
                value={siteSettings?.hero_subtitle || ''}
                onChange={(e) => setSiteSettings(prev => prev ? { ...prev, hero_subtitle: e.target.value } : null)}
                rows={3}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hero Image URL</label>
                <Input
                  value={siteSettings?.hero_image_url || ''}
                  onChange={(e) => setSiteSettings(prev => prev ? { ...prev, hero_image_url: e.target.value } : null)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Background Gradient</label>
                <Input
                  value={siteSettings?.hero_background_gradient || ''}
                  onChange={(e) => setSiteSettings(prev => prev ? { ...prev, hero_background_gradient: e.target.value } : null)}
                  placeholder="from-primary via-primary/90 to-burgundy-light"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={aboutSection?.title || ''}
                  onChange={(e) => setAboutSection(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Subtitle</label>
                <Input
                  value={aboutSection?.subtitle || ''}
                  onChange={(e) => setAboutSection(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                value={aboutSection?.content || ''}
                onChange={(e) => setAboutSection(prev => prev ? { ...prev, content: e.target.value } : null)}
                rows={6}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Image URL</label>
              <Input
                value={aboutSection?.image_url || ''}
                onChange={(e) => setAboutSection(prev => prev ? { ...prev, image_url: e.target.value } : null)}
                placeholder="https://example.com/about-image.jpg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminHeroAbout;
