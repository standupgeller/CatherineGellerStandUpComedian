import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LandingPageProvider } from "./context/LandingPageContext";
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
import AdminLegal from "./pages/admin/AdminLegal";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {import.meta.env.VITE_USE_HASH_ROUTER === "true" ? (
          <LandingPageProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/navigation" element={<AdminNavigation />} />
                <Route path="/admin/hero-about" element={<AdminHeroAbout />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/tour" element={<AdminTour />} />
                <Route path="/admin/archive" element={<AdminArchive />} />
                <Route path="/admin/contact" element={<AdminContact />} />
                <Route path="/admin/legal" element={<AdminLegal />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </LandingPageProvider>
        ) : (
          <LandingPageProvider>
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/navigation" element={<AdminNavigation />} />
                <Route path="/admin/hero-about" element={<AdminHeroAbout />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/videos" element={<AdminVideos />} />
                <Route path="/admin/tour" element={<AdminTour />} />
                <Route path="/admin/archive" element={<AdminArchive />} />
                <Route path="/admin/contact" element={<AdminContact />} />
                <Route path="/admin/legal" element={<AdminLegal />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LandingPageProvider>
        )}
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
