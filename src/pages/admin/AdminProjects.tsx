import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Star } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string;
  category: string | null;
  is_featured: boolean;
  is_visible: boolean;
  sort_order: number;
}

const emptyProject: Omit<Project, 'id'> = {
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  link_text: 'View Project',
  category: '',
  is_featured: false,
  is_visible: true,
  sort_order: 0
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState(emptyProject);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order');

    if (error) {
      toast({ title: 'Error loading projects', variant: 'destructive' });
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating project', variant: 'destructive' });
    } else if (data) {
      setProjects([...projects, data]);
      setNewProject(emptyProject);
      setDialogOpen(false);
      toast({ title: 'Project created' });
    }
  };

  const handleUpdate = async () => {
    if (!editingProject) return;

    const { error } = await supabase
      .from('projects')
      .update(editingProject)
      .eq('id', editingProject.id);

    if (error) {
      toast({ title: 'Error updating project', variant: 'destructive' });
    } else {
      setProjects(projects.map(p => p.id === editingProject.id ? editingProject : p));
      setEditingProject(null);
      toast({ title: 'Project updated' });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error deleting project', variant: 'destructive' });
    } else {
      setProjects(projects.filter(p => p.id !== id));
      toast({ title: 'Project deleted' });
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Projects</h1>
            <p className="text-muted-foreground mt-1">Manage your projects</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Project</DialogTitle>
              </DialogHeader>
              <ProjectForm
                project={newProject}
                setProject={setNewProject}
                onSave={handleCreate}
                isNew
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      {project.is_featured && (
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      )}
                      {!project.is_visible && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                    {project.category && (
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded mt-2 inline-block">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setEditingProject(project)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Project</DialogTitle>
                        </DialogHeader>
                        {editingProject && (
                          <ProjectForm
                            project={editingProject}
                            setProject={setEditingProject}
                            onSave={handleUpdate}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No projects yet. Click "Add Project" to create one.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const ProjectForm = ({ project, setProject, onSave, isNew }: {
  project: Project | Omit<Project, 'id'>;
  setProject: (p: any) => void;
  onSave: () => void;
  isNew?: boolean;
}) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium mb-2 block">Title</label>
      <Input
        value={project.title}
        onChange={(e) => setProject({ ...project, title: e.target.value })}
      />
    </div>
    <div>
      <label className="text-sm font-medium mb-2 block">Description</label>
      <Textarea
        value={project.description || ''}
        onChange={(e) => setProject({ ...project, description: e.target.value })}
        rows={3}
      />
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Image URL</label>
        <Input
          value={project.image_url || ''}
          onChange={(e) => setProject({ ...project, image_url: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Input
          value={project.category || ''}
          onChange={(e) => setProject({ ...project, category: e.target.value })}
        />
      </div>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Link URL</label>
        <Input
          value={project.link_url || ''}
          onChange={(e) => setProject({ ...project, link_url: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Link Text</label>
        <Input
          value={project.link_text}
          onChange={(e) => setProject({ ...project, link_text: e.target.value })}
        />
      </div>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Sort Order</label>
        <Input
          type="number"
          value={project.sort_order}
          onChange={(e) => setProject({ ...project, sort_order: parseInt(e.target.value) })}
        />
      </div>
      <div className="flex items-center gap-6 pt-6">
        <div className="flex items-center gap-2">
          <Switch
            checked={project.is_featured}
            onCheckedChange={(checked) => setProject({ ...project, is_featured: checked })}
          />
          <span className="text-sm">Featured</span>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={project.is_visible}
            onCheckedChange={(checked) => setProject({ ...project, is_visible: checked })}
          />
          <span className="text-sm">Visible</span>
        </div>
      </div>
    </div>
    <Button onClick={onSave} className="w-full">
      {isNew ? 'Create Project' : 'Update Project'}
    </Button>
  </div>
);

export default AdminProjects;
