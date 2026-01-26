import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Calendar, MapPin, Ticket } from 'lucide-react';

interface TourDate {
  id: string;
  venue_name: string;
  city: string;
  country: string;
  event_date: string;
  event_time: string | null;
  ticket_url: string | null;
  ticket_price: string | null;
  status: string;
  additional_info: string | null;
  is_visible: boolean;
  sort_order: number;
}

const emptyTourDate: Omit<TourDate, 'id'> = {
  venue_name: '',
  city: '',
  country: 'USA',
  event_date: '',
  event_time: '',
  ticket_url: '',
  ticket_price: '',
  status: 'available',
  additional_info: '',
  is_visible: true,
  sort_order: 0
};

const statusColors: Record<string, string> = {
  available: 'bg-green-500',
  sold_out: 'bg-red-500',
  cancelled: 'bg-gray-500',
  postponed: 'bg-yellow-500'
};

const AdminTour = () => {
  const [tourDates, setTourDates] = useState<TourDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDate, setEditingDate] = useState<TourDate | null>(null);
  const [newDate, setNewDate] = useState(emptyTourDate);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTourDates();
  }, []);

  const fetchTourDates = async () => {
    const { data, error } = await supabase
      .from('tour_dates')
      .select('*')
      .order('event_date');

    if (error) {
      toast({ title: 'Error loading tour dates', variant: 'destructive' });
    } else {
      setTourDates(data || []);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    const { data, error } = await supabase
      .from('tour_dates')
      .insert(newDate)
      .select()
      .single();

    if (error) {
      toast({ title: 'Error creating tour date', variant: 'destructive' });
    } else if (data) {
      setTourDates([...tourDates, data].sort((a, b) => a.event_date.localeCompare(b.event_date)));
      setNewDate(emptyTourDate);
      setDialogOpen(false);
      toast({ title: 'Tour date created' });
    }
  };

  const handleUpdate = async () => {
    if (!editingDate) return;

    const { error } = await supabase
      .from('tour_dates')
      .update(editingDate)
      .eq('id', editingDate.id);

    if (error) {
      toast({ title: 'Error updating tour date', variant: 'destructive' });
    } else {
      setTourDates(tourDates.map(d => d.id === editingDate.id ? editingDate : d));
      setEditingDate(null);
      toast({ title: 'Tour date updated' });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('tour_dates').delete().eq('id', id);

    if (error) {
      toast({ title: 'Error deleting tour date', variant: 'destructive' });
    } else {
      setTourDates(tourDates.filter(d => d.id !== id));
      toast({ title: 'Tour date deleted' });
    }
  };

  const TourDateForm = ({ tourDate, setTourDate, onSave, isNew }: {
    tourDate: TourDate | Omit<TourDate, 'id'>;
    setTourDate: (d: any) => void;
    onSave: () => void;
    isNew?: boolean;
  }) => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Venue Name</label>
        <Input
          value={tourDate.venue_name}
          onChange={(e) => setTourDate({ ...tourDate, venue_name: e.target.value })}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">City</label>
          <Input
            value={tourDate.city}
            onChange={(e) => setTourDate({ ...tourDate, city: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Country</label>
          <Input
            value={tourDate.country}
            onChange={(e) => setTourDate({ ...tourDate, country: e.target.value })}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Event Date</label>
          <Input
            type="date"
            value={tourDate.event_date}
            onChange={(e) => setTourDate({ ...tourDate, event_date: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Event Time</label>
          <Input
            type="time"
            value={tourDate.event_time || ''}
            onChange={(e) => setTourDate({ ...tourDate, event_time: e.target.value })}
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Ticket URL</label>
          <Input
            value={tourDate.ticket_url || ''}
            onChange={(e) => setTourDate({ ...tourDate, ticket_url: e.target.value })}
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Ticket Price</label>
          <Input
            value={tourDate.ticket_price || ''}
            onChange={(e) => setTourDate({ ...tourDate, ticket_price: e.target.value })}
            placeholder="$25 - $50"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select
            value={tourDate.status}
            onValueChange={(value) => setTourDate({ ...tourDate, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="sold_out">Sold Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="postponed">Postponed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Switch
            checked={tourDate.is_visible}
            onCheckedChange={(checked) => setTourDate({ ...tourDate, is_visible: checked })}
          />
          <span className="text-sm">Visible</span>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Additional Info</label>
        <Textarea
          value={tourDate.additional_info || ''}
          onChange={(e) => setTourDate({ ...tourDate, additional_info: e.target.value })}
          rows={2}
        />
      </div>
      <Button onClick={onSave} className="w-full">
        {isNew ? 'Add Tour Date' : 'Update Tour Date'}
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Tour Dates</h1>
            <p className="text-muted-foreground mt-1">Manage upcoming shows</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Date
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Tour Date</DialogTitle>
              </DialogHeader>
              <TourDateForm
                tourDate={newDate}
                setTourDate={setNewDate}
                onSave={handleCreate}
                isNew
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {tourDates.map((tourDate) => (
            <Card key={tourDate.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-center min-w-[60px]">
                      <div className="text-2xl font-bold">
                        {new Date(tourDate.event_date).getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {new Date(tourDate.event_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{tourDate.venue_name}</h3>
                        <span className={`w-2 h-2 rounded-full ${statusColors[tourDate.status]}`} />
                        <span className="text-xs text-muted-foreground capitalize">{tourDate.status.replace('_', ' ')}</span>
                        {!tourDate.is_visible && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">Hidden</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {tourDate.city}, {tourDate.country}
                        </span>
                        {tourDate.event_time && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {tourDate.event_time}
                          </span>
                        )}
                        {tourDate.ticket_price && (
                          <span className="flex items-center gap-1">
                            <Ticket className="w-3 h-3" />
                            {tourDate.ticket_price}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => setEditingDate(tourDate)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Tour Date</DialogTitle>
                        </DialogHeader>
                        {editingDate && (
                          <TourDateForm
                            tourDate={editingDate}
                            setTourDate={setEditingDate}
                            onSave={handleUpdate}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(tourDate.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {tourDates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No tour dates yet. Click "Add Date" to create one.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTour;
