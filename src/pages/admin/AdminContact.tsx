import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save, Mail, Trash2, Check } from 'lucide-react';

interface ContactSettings {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  management_email: string;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
}

interface FooterSettings {
  id: string;
  copyright_text: string;
  show_social_links: boolean;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminContact = () => {
  const [contactSettings, setContactSettings] = useState<ContactSettings | null>(null);
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [contactRes, footerRes, submissionsRes] = await Promise.all([
      supabase.from('contact_settings').select('*').maybeSingle(),
      supabase.from('footer_settings').select('*').maybeSingle(),
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    ]);

    if (contactRes.data) setContactSettings(contactRes.data);
    if (footerRes.data) setFooterSettings(footerRes.data);
    if (submissionsRes.data) setSubmissions(submissionsRes.data);
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);

    if (contactSettings) {
      const { error } = await supabase
        .from('contact_settings')
        .update(contactSettings)
        .eq('id', contactSettings.id);

      if (error) {
        toast({ title: 'Error saving contact settings', variant: 'destructive' });
        setSaving(false);
        return;
      }
    }

    if (footerSettings) {
      const { error } = await supabase
        .from('footer_settings')
        .update(footerSettings)
        .eq('id', footerSettings.id);

      if (error) {
        toast({ title: 'Error saving footer settings', variant: 'destructive' });
        setSaving(false);
        return;
      }
    }

    toast({ title: 'Settings saved' });
    setSaving(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error updating message', variant: 'destructive' });
    } else {
      setSubmissions(submissions.map(s => s.id === id ? { ...s, is_read: true } : s));
    }
  };

  const deleteSubmission = async (id: string) => {
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: 'Error deleting message', variant: 'destructive' });
    } else {
      setSubmissions(submissions.filter(s => s.id !== id));
      toast({ title: 'Message deleted' });
    }
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

  const unreadCount = submissions.filter(s => !s.is_read).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Contact & Footer</h1>
          <p className="text-muted-foreground mt-1">Manage contact info, social links, and messages</p>
        </div>

        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              Messages
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-orange-500">{unreadCount}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Contact Section</CardTitle>
                <Button onClick={handleSaveSettings} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Section Title</label>
                    <Input
                      value={contactSettings?.title || ''}
                      onChange={(e) => setContactSettings(prev => prev ? { ...prev, title: e.target.value } : null)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subtitle</label>
                    <Input
                      value={contactSettings?.subtitle || ''}
                      onChange={(e) => setContactSettings(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Textarea
                    value={contactSettings?.description || ''}
                    onChange={(e) => setContactSettings(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Management Email</label>
                  <Input
                    type="email"
                    value={contactSettings?.management_email || ''}
                    placeholder="gmail@example.com"
                    onChange={(e) => setContactSettings(prev => prev ? { ...prev, management_email: e.target.value } : null)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Instagram URL</label>
                    <Input
                      value={contactSettings?.instagram_url || ''}
                      onChange={(e) => setContactSettings(prev => prev ? { ...prev, instagram_url: e.target.value } : null)}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Twitter/X URL</label>
                    <Input
                      value={contactSettings?.twitter_url || ''}
                      onChange={(e) => setContactSettings(prev => prev ? { ...prev, twitter_url: e.target.value } : null)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">YouTube URL</label>
                    <Input
                      value={contactSettings?.youtube_url || ''}
                      onChange={(e) => setContactSettings(prev => prev ? { ...prev, youtube_url: e.target.value } : null)}
                      placeholder="https://youtube.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">TikTok URL</label>
                    <Input
                      value={contactSettings?.tiktok_url || ''}
                      onChange={(e) => setContactSettings(prev => prev ? { ...prev, tiktok_url: e.target.value } : null)}
                      placeholder="https://tiktok.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Copyright Text</label>
                  <Input
                    value={footerSettings?.copyright_text || ''}
                    onChange={(e) => setFooterSettings(prev => prev ? { ...prev, copyright_text: e.target.value } : null)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-4 mt-6">
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No messages yet.
              </div>
            ) : (
              submissions.map((submission) => (
                <Card key={submission.id} className={!submission.is_read ? 'border-accent' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{submission.name}</span>
                          <span className="text-muted-foreground">({submission.email})</span>
                          {!submission.is_read && (
                            <Badge variant="secondary" className="bg-accent text-accent-foreground">New</Badge>
                          )}
                        </div>
                        {submission.subject && (
                          <p className="font-medium mb-1">{submission.subject}</p>
                        )}
                        <p className="text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(submission.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        {!submission.is_read && (
                          <Button variant="outline" size="icon" onClick={() => markAsRead(submission.id)}>
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => deleteSubmission(submission.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContact;
