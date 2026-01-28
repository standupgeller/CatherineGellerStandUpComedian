import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const AdminLegal = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const [termsOfService, setTermsOfService] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').maybeSingle();
      if (error) {
        toast({ title: 'Error loading legal settings', description: error.message, variant: 'destructive' });
      }
      if (data) {
        setSettingsId(data.id);
        setPrivacyPolicy(data.privacy_policy ?? '');
        setTermsOfService(data.terms_of_service ?? '');
      } else {
        const { data: newRow, error: insertError } = await supabase
          .from('site_settings')
          .insert({})
          .select()
          .single();
        if (insertError) {
          toast({ title: 'Error initializing site settings', description: insertError.message, variant: 'destructive' });
        } else if (newRow) {
          setSettingsId(newRow.id);
          setPrivacyPolicy(newRow.privacy_policy ?? '');
          setTermsOfService(newRow.terms_of_service ?? '');
        }
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      toast({ title: 'Unexpected error', description: message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settingsId) {
      toast({ title: 'Settings not initialized', description: 'Please reload the page and try again.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .update({
        privacy_policy: privacyPolicy,
        terms_of_service: termsOfService
      })
      .eq('id', settingsId);

    if (error) {
      toast({ title: 'Error saving legal pages', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Legal pages updated successfully' });
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="font-display text-3xl font-bold">Legal Pages</h1>
          <Button onClick={handleSave} disabled={saving || loading} className="gap-2">
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={privacyPolicy}
                onChange={(e) => setPrivacyPolicy(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter privacy policy content here..."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={termsOfService}
                onChange={(e) => setTermsOfService(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Enter terms of service content here..."
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLegal;
