import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, FolderOpen } from 'lucide-react';

interface ArchiveCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  is_visible: boolean;
  sort_order: number;
}

interface ArchiveItem {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  date: string | null;
  is_visible: boolean;
  sort_order: number;
}

const emptyCategory: Omit<ArchiveCategory, 'id'> = {
  title: '',
  slug: '',
  description: '',
  cover_image_url: '',
  is_visible: true,
  sort_order: 0
};

const emptyItem: Omit<ArchiveItem, 'id'> = {
  category_id: null,
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  date: '',
  is_visible: true,
  sort_order: 0
};

const AdminArchive = () => {
  const [categories, setCategories] = useState<ArchiveCategory[]>([]);
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<ArchiveCategory | null>(null);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  const [newCategory, setNewCategory] = useState(emptyCategory);
  const [newItem, setNewItem] = useState(emptyItem);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [categoriesRes, itemsRes] = await Promise.all([
      supabase.from('archive_categories').select('*').order('sort_order'),
      supabase.from('archive_items').select('*').order('sort_order')
    ]);

    if (categoriesRes.error || itemsRes.error) {
      toast({ title: 'Error loading archive data', variant: 'destructive' });
    } else {
      setCategories(categoriesRes.data || []);
      setItems(itemsRes.data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Category CRUD
  const handleCreateCategory = async () => {
    const categoryData = {
      ...newCategory,
      slug: newCategory.slug || generateSlug(newCategory.title)
    };

    const { data, error } = await supabase
      .from('archive_categories')
      .insert(categoryData)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating category', variant: 'destructive' });
    } else if (data) {
      setCategories([...categories, data]);
      setNewCategory(emptyCategory);
      setCategoryDialogOpen(false);
      toast({ title: 'Category created' });
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    const { error } = await supabase
      .from('archive_categories')
      .update(editingCategory)
      .eq('id', editingCategory.id);

    if (error) {
      toast({ title: 'Error updating category', variant: 'destructive' });
    } else {
      setCategories(categories.map(c => c.id === editingCategory.id ? editingCategory : c));
      setEditingCategory(null);
      toast({ title: 'Category updated' });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from('archive_categories').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error deleting category', variant: 'destructive' });
    } else {
      setCategories(categories.filter(c => c.id !== id));
      setItems(items.filter(i => i.category_id !== id));
      toast({ title: 'Category deleted' });
    }
  };

  // Item CRUD
  const handleCreateItem = async () => {
    const { data, error } = await supabase
      .from('archive_items')
      .insert(newItem)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating item', variant: 'destructive' });
    } else if (data) {
      setItems([...items, data]);
      setNewItem(emptyItem);
      setItemDialogOpen(false);
      toast({ title: 'Item created' });
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from('archive_items')
      .update(editingItem)
      .eq('id', editingItem.id);

    if (error) {
      toast({ title: 'Error updating item', variant: 'destructive' });
    } else {
      setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
      setEditingItem(null);
      toast({ title: 'Item updated' });
    }
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase.from('archive_items').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error deleting item', variant: 'destructive' });
    } else {
      setItems(items.filter(i => i.id !== id));
      toast({ title: 'Item deleted' });
    }
  };

  const CategoryForm = ({ category, setCategory, onSave, isNew }: {
    category: ArchiveCategory | Omit<ArchiveCategory, 'id'>;
    setCategory: (c: any) => void;
    onSave: () => void;
    isNew?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <Input
            value={category.title}
            onChange={(e) => setCategory({ ...category, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Slug</label>
          <Input
            value={category.slug}
            onChange={(e) => setCategory({ ...category, slug: e.target.value })}
            placeholder="auto-generated-from-title"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={category.description || ''}
          onChange={(e) => setCategory({ ...category, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Cover Image URL</label>
          <Input
            value={category.cover_image_url || ''}
            onChange={(e) => setCategory({ ...category, cover_image_url: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Sort Order</label>
          <Input
            type="number"
            value={category.sort_order}
            onChange={(e) => setCategory({ ...category, sort_order: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={category.is_visible}
          onCheckedChange={(checked) => setCategory({ ...category, is_visible: checked })}
        />
        <span className="text-sm">Visible</span>
      </div>
      <Button onClick={onSave} className="w-full">
        {isNew ? 'Create Category' : 'Update Category'}
      </Button>
    </div>
  );

  const ItemForm = ({ item, setItem, onSave, isNew }: {
    item: ArchiveItem | Omit<ArchiveItem, 'id'>;
    setItem: (i: any) => void;
    onSave: () => void;
    isNew?: boolean;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select
          value={item.category_id || ''}
          onValueChange={(value) => setItem({ ...item, category_id: value || null })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Title</label>
        <Input
          value={item.title}
          onChange={(e) => setItem({ ...item, title: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Description</label>
        <Textarea
          value={item.description || ''}
          onChange={(e) => setItem({ ...item, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Image URL</label>
          <Input
            value={item.image_url || ''}
            onChange={(e) => setItem({ ...item, image_url: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Link URL</label>
          <Input
            value={item.link_url || ''}
            onChange={(e) => setItem({ ...item, link_url: e.target.value })}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Date</label>
          <Input
            value={item.date || ''}
            onChange={(e) => setItem({ ...item, date: e.target.value })}
            placeholder="2024"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Sort Order</label>
          <Input
            type="number"
            value={item.sort_order}
            onChange={(e) => setItem({ ...item, sort_order: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={item.is_visible}
          onCheckedChange={(checked) => setItem({ ...item, is_visible: checked })}
        />
        <span className="text-sm">Visible</span>
      </div>
      <Button onClick={onSave} className="w-full">
        {isNew ? 'Create Item' : 'Update Item'}
      </Button>
    </div>
  );

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
        <div>
          <h1 className="font-display text-3xl font-bold">Archive</h1>
          <p className="text-muted-foreground mt-1">Manage archive categories and items</p>
        </div>

        <Tabs defaultValue="categories">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>New Category</DialogTitle>
                  </DialogHeader>
                  <CategoryForm
                    category={newCategory}
                    setCategory={setNewCategory}
                    onSave={handleCreateCategory}
                    isNew
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <FolderOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{category.title}</h3>
                          {!category.is_visible && (
                            <span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">/{category.slug}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {items.filter(i => i.category_id === category.id).length} items
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingCategory(category)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          {editingCategory && (
                            <CategoryForm
                              category={editingCategory}
                              setCategory={setEditingCategory}
                              onSave={handleUpdateCategory}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {categories.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  No categories yet. Click "Add Category" to create one.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 mt-6">
            <div className="flex justify-end">
              <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button disabled={categories.length === 0}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>New Item</DialogTitle>
                  </DialogHeader>
                  <ItemForm
                    item={newItem}
                    setItem={setNewItem}
                    onSave={handleCreateItem}
                    isNew
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {categories.map((category) => {
                const categoryItems = items.filter(i => i.category_id === category.id);
                if (categoryItems.length === 0) return null;

                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {categoryItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.title}</span>
                              {!item.is_visible && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>
                              )}
                            </div>
                            {item.date && (
                              <span className="text-xs text-muted-foreground">{item.date}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setEditingItem(item)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Edit Item</DialogTitle>
                                </DialogHeader>
                                {editingItem && (
                                  <ItemForm
                                    item={editingItem}
                                    setItem={setEditingItem}
                                    onSave={handleUpdateItem}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })}

              {items.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No items yet. {categories.length === 0 ? 'Create a category first.' : 'Click "Add Item" to create one.'}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminArchive;
