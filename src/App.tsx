import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import RSVP from "./pages/RSVP";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ✅ Wrapper to check ?guest=code and redirect
const GuestRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const guestCode = params.get("guest");

    if (guestCode) {
      navigate(`/guest/${guestCode}`, { replace: true });
    }
  }, [location, navigate]);

  return <Index />; // fallback = homepage
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuestRedirect />} />
          <Route path="/rsvp/:id" element={<RSVP />} />
          <Route path="/guest/:id" element={<Gallery />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
