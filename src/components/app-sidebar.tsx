import {
  BarChart3,
  FileText,
  Info,
  HelpCircle,
  BookOpen,
  Activity,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Performance comparison",
  },
  {
    title: "Training",
    url: "/training",
    icon: Activity,
    description: "D3QN training progress",
  },
  // {
  //   title: "Reports",
  //   url: "/reports",
  //   icon: FileText,
  //   description: "Export PDF/CSV, summaries",
  // },
  {
    title: "About",
    url: "/about",
    icon: Info,
    description: "Project description & purpose",
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
    description: "How to read charts, FAQs",
  },
  // {
  //   title: "References",
  //   url: "/references",
  //   icon: BookOpen,
  //   description: "Sources, related works",
  // },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={open ? "w-64" : "w-16"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup className="pt-5">
          <SidebarGroupLabel className="px-10 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider"></SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-5">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-primary font-semibold"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {open && (
                        <div className="flex flex-col">
                          <span>{item.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
