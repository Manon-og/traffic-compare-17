import { BarChart3, Info, HelpCircle, Activity } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const items = [
  {
    title: "Home",
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
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold tracking-tight text-3xl">
            Traffic Analysis
          </span>
          {/* Nav links (desktop) next to title */}
          <nav className="hidden md:flex items-center gap-2 ml-10 md:ml-16">
            {items.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`
                }
                title={item.description}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Nav links (mobile) */}
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[70%]">
          {items.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end
              className={({ isActive }) =>
                `inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`
              }
              title={item.description}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
