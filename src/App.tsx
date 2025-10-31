import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Sidebar removed in favor of top navbar
import { AppSidebar } from "@/components/app-sidebar";
import Index from "./pages/Index";
import Training from "./pages/Training";
import Reports from "./pages/Reports";
import About from "./pages/About";
import Help from "./pages/Help";
import References from "./pages/References";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen w-full flex flex-col">
          <AppSidebar />
          <main className="flex-1 pt-14">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/training" element={<Training />} />
              {/* <Route path="/reports" element={<Reports />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<Help />} />
              {/* <Route path="/references" element={<References />} /> */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
