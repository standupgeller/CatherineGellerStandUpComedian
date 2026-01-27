import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Star, Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  youtube_url: string | null;
  youtube_embed_id: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  views: string | null;
  is_featured: boolean;
  watermark_url: string | null;
  is_visible: boolean;
  sort_order: number;
}

const emptyVideo: Omit<Video, 'id'> = {
  title: '',
  youtube_url: '',
  youtube_embed_id: '',
  thumbnail_url: '',
  duration: '',
  views: '',
  is_featured: false,
  watermark_url: '',
  is_visible: true,
  sort_order: 0
};

const extractYouTubeId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : '';
};

const AdminVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState(emptyVideo);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('sort_order');

    if (error) {
      toast({ title: 'Error loading videos', variant: 'destructive' });
    } else {
      setVideos(data || []);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const videoData = {
      ...newVideo,
      youtube_embed_id: newVideo.youtube_url ? extractYouTubeId(newVideo.youtube_url) : ''
    };

    const { data, error } = await supabase
      .from('videos')
      .insert(videoData)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating video', variant: 'destructive' });
    } else if (data) {
      setVideos([...videos, data]);
      setNewVideo(emptyVideo);
      setDialogOpen(false);
      toast({ title: 'Video created' });
    }
  };

  const handleUpdate = async () => {
    if (!editingVideo) return;

    const videoData = {
      ...editingVideo,
      youtube_embed_id: editingVideo.youtube_url ? extractYouTubeId(editingVideo.youtube_url) : ''
    };

    const { error } = await supabase
      .from('videos')
      .update(videoData)
      .eq('id', editingVideo.id);

    if (error) {
      toast({ title: 'Error updating video', variant: 'destructive' });
    } else {
      setVideos(videos.map(v => v.id === editingVideo.id ? videoData : v));
      setEditingVideo(null);
      toast({ title: 'Video updated' });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('videos').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error deleting video', variant: 'destructive' });
    } else {
      setVideos(videos.filter(v => v.id !== id));
      toast({ title: 'Video deleted' });
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
            <h1 className="font-display text-3xl font-bold">Videos</h1>
            <p className="text-muted-foreground mt-1">Manage YouTube videos</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Video</DialogTitle>
              </DialogHeader>
              <VideoForm
                video={newVideo}
                setVideo={setNewVideo}
                onSave={handleCreate}
                isNew
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {video.youtube_embed_id ? (
                  <img
                    src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_embed_id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {video.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </div>
                )}
                {!video.is_visible && (
                  <div className="absolute top-2 right-2 bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                    Hidden
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold truncate">{video.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  {video.duration && <span>{video.duration}</span>}
                  {video.views && <span>• {video.views}</span>}
                </div>
                <div className="flex gap-2 mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditingVideo(video)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Video</DialogTitle>
                      </DialogHeader>
                      {editingVideo && (
                        <VideoForm
                          video={editingVideo}
                          setVideo={setEditingVideo}
                          onSave={handleUpdate}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {videos.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No videos yet. Click "Add Video" to create one.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

const VideoForm = ({ video, setVideo, onSave, isNew }: {
  video: Video | Omit<Video, 'id'>;
  setVideo: (v: any) => void;
  onSave: () => void;
  isNew?: boolean;
}) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium mb-2 block">Title</label>
      <Input
        value={video.title}
        onChange={(e) => setVideo({ ...video, title: e.target.value })}
      />
    </div>
    <div>
      <label className="text-sm font-medium mb-2 block">YouTube URL</label>
      <Input
        value={video.youtube_url || ''}
        onChange={(e) => setVideo({ ...video, youtube_url: e.target.value })}
        placeholder="https://youtube.com/watch?v=..."
      />
      <p className="text-xs text-muted-foreground mt-1">
        Paste any YouTube URL - the embed ID will be extracted automatically
      </p>
    </div>
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Thumbnail URL (optional)</label>
        <Input
          value={video.thumbnail_url || ''}
          onChange={(e) => setVideo({ ...video, thumbnail_url: e.target.value })}
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Watermark URL</label>
        <Input
          value={video.watermark_url || ''}
          onChange={(e) => setVideo({ ...video, watermark_url: e.target.value })}
        />
      </div>
    </div>
    <div className="grid sm:grid-cols-3 gap-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Duration</label>
        <Input
          value={video.duration || ''}
          onChange={(e) => setVideo({ ...video, duration: e.target.value })}
          placeholder="5:32"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Views</label>
        <Input
          value={video.views || ''}
          onChange={(e) => setVideo({ ...video, views: e.target.value })}
          placeholder="1.2M views"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Sort Order</label>
        <Input
          type="number"
          value={video.sort_order}
          onChange={(e) => setVideo({ ...video, sort_order: parseInt(e.target.value) })}
        />
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <Switch
          checked={video.is_featured}
          onCheckedChange={(checked) => setVideo({ ...video, is_featured: checked })}
        />
        <span className="text-sm">Featured</span>
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={video.is_visible}
          onCheckedChange={(checked) => setVideo({ ...video, is_visible: checked })}
        />
        <span className="text-sm">Visible</span>
      </div>
    </div>
    <Button onClick={onSave} className="w-full">
      {isNew ? 'Add Video' : 'Update Video'}
    </Button>
  </div>
);

export default AdminVideos;
