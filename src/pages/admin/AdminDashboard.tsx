import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FolderKanban, Video, Calendar, Mail, Archive, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    videos: 0,
    tourDates: 0,
    messages: 0,
    unreadMessages: 0,
    archiveCategories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [projects, videos, tourDates, messages, archiveCategories] = await Promise.all([
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('tour_dates').select('id', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('id, is_read'),
        supabase.from('archive_categories').select('id', { count: 'exact', head: true })
      ]);

      const unreadCount = messages.data?.filter(m => !m.is_read).length || 0;

      setStats({
        projects: projects.count || 0,
        videos: videos.count || 0,
        tourDates: tourDates.count || 0,
        messages: messages.data?.length || 0,
        unreadMessages: unreadCount,
        archiveCategories: archiveCategories.count || 0
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Projects', value: stats.projects, icon: FolderKanban, href: '/admin/projects', color: 'bg-blue-500' },
    { title: 'Videos', value: stats.videos, icon: Video, href: '/admin/videos', color: 'bg-purple-500' },
    { title: 'Tour Dates', value: stats.tourDates, icon: Calendar, href: '/admin/tour', color: 'bg-green-500' },
    { title: 'Messages', value: stats.messages, badge: stats.unreadMessages, icon: Mail, href: '/admin/contact', color: 'bg-orange-500' },
    { title: 'Archive Categories', value: stats.archiveCategories, icon: Archive, href: '/admin/archive', color: 'bg-pink-500' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your website content</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((card) => (
            <Link key={card.title} to={card.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <card.icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{card.value}</span>
                    {card.badge && card.badge > 0 && (
                      <span className="text-sm text-orange-500 font-medium mb-1">
                        ({card.badge} unread)
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">View Live Site</span>
            </Link>
            <Link
              to="/admin/hero-about"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">Edit Hero Section</span>
            </Link>
            <Link
              to="/admin/tour"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">Add Tour Date</span>
            </Link>
            <Link
              to="/admin/videos"
              className="flex items-center gap-3 p-4 rounded-lg border hover:bg-muted transition-colors"
            >
              <span className="font-medium">Add Video</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
