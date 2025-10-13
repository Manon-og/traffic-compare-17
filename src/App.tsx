import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <header className="sticky top-0 z-50 border-b bg-background">
                <div className="flex h-12 items-center gap-3 px-4">
                  <SidebarTrigger />
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span>Traffic Analytics</span>
                    <span className="text-muted-foreground">
                      RL vs Fixed-Time
                    </span>
                  </div>
                </div>
              </header>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/training" element={<Training />} />
                {/* <Route path="/reports" element={<Reports />} /> */}
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                <Route path="/references" element={<References />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
