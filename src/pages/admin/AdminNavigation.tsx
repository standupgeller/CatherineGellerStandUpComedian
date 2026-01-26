import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, GripVertical, Save } from 'lucide-react';

interface NavLink {
  id: string;
  name: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
}

const AdminNavigation = () => {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('nav_links')
      .select('*')
      .order('sort_order');

    if (error) {
      toast({ title: 'Error loading navigation', variant: 'destructive' });
    } else {
      setLinks(data || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    for (const link of links) {
      const { error } = await supabase
        .from('nav_links')
        .update({
          name: link.name,
          href: link.href,
          sort_order: link.sort_order,
          is_visible: link.is_visible
        })
        .eq('id', link.id);

      if (error) {
        toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
        setSaving(false);
        return;
      }
    }

    toast({ title: 'Navigation saved successfully' });
    setSaving(false);
  };

  const addLink = async () => {
    const newOrder = links.length > 0 ? Math.max(...links.map(l => l.sort_order)) + 1 : 0;
    
    const { data, error } = await supabase
      .from('nav_links')
      .insert({ name: 'New Link', href: '#new', sort_order: newOrder })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error adding link', variant: 'destructive' });
    } else if (data) {
      setLinks([...links, data]);
    }
  };

  const deleteLink = async (id: string) => {
    const { error } = await supabase.from('nav_links').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error deleting link', variant: 'destructive' });
    } else {
      setLinks(links.filter(l => l.id !== id));
      toast({ title: 'Link deleted' });
    }
  };

  const updateLink = (id: string, field: keyof NavLink, value: string | number | boolean) => {
    setLinks(links.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
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
            <h1 className="font-display text-3xl font-bold">Navigation</h1>
            <p className="text-muted-foreground mt-1">Manage navigation links</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={addLink}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Navigation Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {links.map((link, index) => (
              <div
                key={link.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-muted/50"
              >
                <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                
                <div className="flex-1 grid sm:grid-cols-3 gap-4">
                  <Input
                    value={link.name}
                    onChange={(e) => updateLink(link.id, 'name', e.target.value)}
                    placeholder="Link Name"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) => updateLink(link.id, 'href', e.target.value)}
                    placeholder="#section or /page"
                  />
                  <Input
                    type="number"
                    value={link.sort_order}
                    onChange={(e) => updateLink(link.id, 'sort_order', parseInt(e.target.value))}
                    placeholder="Order"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={link.is_visible}
                      onCheckedChange={(checked) => updateLink(link.id, 'is_visible', checked)}
                    />
                    <span className="text-sm text-muted-foreground">Visible</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLink(link.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {links.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No navigation links. Click "Add Link" to create one.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminNavigation;
