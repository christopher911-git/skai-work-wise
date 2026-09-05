import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  ChevronLeft,
  Clock,
  FileText,
  FolderOpen,
  HelpCircle,
  Home,
  Lightbulb,
  Mail,
  Menu,
  Moon,
  PenLine,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useSk } from "@/lib/sk-store";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/app", label: "Dashboard", icon: Home, exact: true },
  { to: "/app/email", label: "Email Generator", icon: Mail },
  { to: "/app/meetings", label: "Meeting Summarizer", icon: FileText },
  { to: "/app/assistant", label: "AI Assistant", icon: Bot },
] as const;

const workspaceNav = [
  { to: "/app/favorites", label: "Favorites", icon: Star },
  { to: "/app/activity", label: "Recent Activity", icon: Clock },
  { to: "/app/saved", label: "Saved Work", icon: FolderOpen },
] as const;

const bottomNav = [
  { to: "/app/settings", label: "Settings", icon: Settings },
  { to: "/app/help", label: "Help & Support", icon: HelpCircle },
] as const;

function NavLink({
  to,
  label,
  icon: Icon,
  collapsed,
  exact,
  onNavigate,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  collapsed: boolean;
  exact?: boolean | undefined;
  onNavigate?: (() => void) | undefined;
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: exact === true }}
      onClick={onNavigate}
      title={collapsed ? label : undefined}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
      activeProps={{ "aria-current": "page" }}
    >
      <Icon aria-hidden className="size-[18px] shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

function SidebarBody({
  collapsed,
  onNavigate,
  onCollapse,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  onCollapse?: () => void;
}) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-4 py-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
          <Sparkles aria-hidden className="size-5" />
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-base leading-tight font-semibold">SK AI</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              Intelligent Workplace Assistant
            </p>
          </div>
        )}
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="ml-auto hidden rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:block"
          >
            <ChevronLeft aria-hidden className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        )}
      </div>

      <nav aria-label="Main" className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-[11px] font-semibold tracking-widest text-sidebar-foreground/45">
              WORKSPACE
            </p>
          )}
          {workspaceNav.map((item) => (
            <NavLink key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="space-y-1 border-t border-sidebar-border px-3 py-3">
        {bottomNav.map((item) => (
          <NavLink key={item.to} {...item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
        <Link
          to="/app/responsible-ai"
          onClick={onNavigate}
          title={collapsed ? "Responsible AI" : undefined}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <ShieldCheck aria-hidden className="size-[18px] shrink-0" />
          {!collapsed && "Responsible AI"}
        </Link>
      </div>

      <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-sm font-semibold text-sidebar-accent-foreground">
          SK
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Skhumba</p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">Personal Workspace</p>
          </div>
        )}
      </div>
    </div>
  );
}

const titles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/email": "Smart Email Generator",
  "/app/meetings": "Meeting Intelligence",
  "/app/assistant": "SK AI Assistant",
  "/app/saved": "Saved Work",
  "/app/favorites": "Favorites",
  "/app/activity": "Recent Activity",
  "/app/settings": "Settings",
  "/app/help": "Help & Support",
  "/app/responsible-ai": "Responsible AI",
};

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { commandOpen, setCommandOpen, theme, toggleTheme } = useSk();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[pathname.replace(/\/$/, "")] ?? "SK AI";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandOpen, setCommandOpen]);

  const go = (to: string) => {
    setCommandOpen(false);
    navigate({ to });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-sidebar-border transition-[width] lg:block",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <SidebarBody collapsed={collapsed} onCollapse={() => setCollapsed((c) => !c)} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[80%] max-w-[288px] shadow-lift">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 z-10 rounded-md p-2 text-sidebar-foreground/70"
            >
              <X aria-hidden className="size-5" />
            </button>
            <SidebarBody collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur md:px-6">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-2 text-foreground hover:bg-accent lg:hidden"
          >
            <Menu aria-hidden className="size-5" />
          </button>

          <h1 className="truncate text-base font-semibold md:text-lg">{title}</h1>

          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="mx-auto hidden w-full max-w-md items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-ring md:flex"
          >
            <Search aria-hidden className="size-4" />
            <span className="truncate">Ask SK AI anything...</span>
            <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] font-medium">
              Ctrl + K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              type="button"
              aria-label="Open AI command bar"
              onClick={() => setCommandOpen(true)}
              className="rounded-md p-2 hover:bg-accent md:hidden"
            >
              <Search aria-hidden className="size-5" />
            </button>
            <button
              type="button"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              onClick={toggleTheme}
              className="rounded-md p-2 hover:bg-accent"
            >
              {theme === "dark" ? <Sun aria-hidden className="size-5" /> : <Moon aria-hidden className="size-5" />}
            </button>
            <button type="button" aria-label="Notifications" className="relative rounded-md p-2 hover:bg-accent">
              <Bell aria-hidden className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
            </button>
            <Link to="/app/help" aria-label="Help" className="rounded-md p-2 hover:bg-accent">
              <HelpCircle aria-hidden className="size-5" />
            </Link>
            <span
              aria-label="Skhumba"
              className="ml-1 flex size-8 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-primary-foreground"
            >
              SK
            </span>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="What would you like to accomplish?" />
        <CommandList>
          <CommandEmpty>No matching actions.</CommandEmpty>
          <CommandGroup heading="Suggested actions">
            <CommandItem onSelect={() => go("/app/email")}>
              <Mail /> Generate Email
            </CommandItem>
            <CommandItem onSelect={() => go("/app/meetings")}>
              <FileText /> Summarize Meeting
            </CommandItem>
            <CommandItem onSelect={() => go("/app/assistant")}>
              <Bot /> Ask AI
            </CommandItem>
            <CommandItem onSelect={() => go("/app/assistant")}>
              <PenLine /> Rewrite Text
            </CommandItem>
            <CommandItem onSelect={() => go("/app/assistant")}>
              <FileText /> Summarize Content
            </CommandItem>
            <CommandItem onSelect={() => go("/app/assistant")}>
              <Lightbulb /> Brainstorm Ideas
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Workspace">
            <CommandItem onSelect={() => go("/app/saved")}>
              <FolderOpen /> Saved Work
            </CommandItem>
            <CommandItem onSelect={() => go("/app/activity")}>
              <Clock /> Recent Activity
            </CommandItem>
            <CommandItem onSelect={() => go("/app/settings")}>
              <Settings /> Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <Button
        type="button"
        size="lg"
        onClick={() => setCommandOpen(true)}
        className="fixed right-5 bottom-5 z-40 rounded-full shadow-glow md:hidden"
        aria-label="Ask SK AI"
      >
        <Sparkles aria-hidden />
        Ask SK AI
      </Button>
    </div>
  );
}
