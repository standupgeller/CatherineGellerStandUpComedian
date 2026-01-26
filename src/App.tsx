import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNavigation from "./pages/admin/AdminNavigation";
import AdminHeroAbout from "./pages/admin/AdminHeroAbout";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminTour from "./pages/admin/AdminTour";
import AdminArchive from "./pages/admin/AdminArchive";
import AdminContact from "./pages/admin/AdminContact";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/navigation" element={<AdminNavigation />} />
          <Route path="/admin/hero-about" element={<AdminHeroAbout />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
          <Route path="/admin/tour" element={<AdminTour />} />
          <Route path="/admin/archive" element={<AdminArchive />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
