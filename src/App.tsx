import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PostBounty from "./pages/PostBounty";
import BountyAnalysis from "./pages/BountyAnalysis";
import BountyWall from "./pages/BountyWall";
import BountyDetail from "./pages/BountyDetail";
import ApplyBounty from "./pages/ApplyBounty";
import BountyApplications from "./pages/BountyApplications";
import MyApplications from "./pages/MyApplications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/post-bounty" element={<PostBounty />} />
            <Route path="/bounty-analysis" element={<BountyAnalysis />} />
            <Route path="/bounties" element={<BountyWall />} />
            <Route path="/bounties/:id" element={<BountyDetail />} />
            <Route path="/bounties/:id/apply" element={<ApplyBounty />} />
            <Route path="/bounties/:id/applications" element={<BountyApplications />} />
            <Route path="/my-applications" element={<MyApplications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
