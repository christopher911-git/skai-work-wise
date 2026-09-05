import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Bot,
  Database,
  Keyboard,
  Link2,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSk } from "@/lib/sk-store";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SK AI" },
      { name: "description", content: "Manage your SK AI profile, appearance, notifications, AI preferences, privacy and data controls." },
      { property: "og:title", content: "Settings — SK AI" },
      { property: "og:description", content: "Control how SK AI looks, notifies you and handles your workplace data." },
    ],
  }),
  component: SettingsPage,
});

const sections = [
  { value: "profile", label: "Profile", icon: User },
  { value: "appearance", label: "Appearance", icon: Palette },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "ai", label: "AI Preferences", icon: Bot },
  { value: "privacy", label: "Privacy", icon: ShieldCheck },
  { value: "data", label: "Data Controls", icon: Database },
  { value: "services", label: "Connected Services", icon: Link2 },
  { value: "shortcuts", label: "Keyboard Shortcuts", icon: Keyboard },
] as const;

function Row({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border py-4 last:border-0">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useSk();
  const [prefs, setPrefs] = useState({
    email: true,
    product: false,
    weekly: true,
    concise: true,
    citations: true,
    memory: false,
  });
  const set = (k: keyof typeof prefs) => (v: boolean) => setPrefs((p) => ({ ...p, [k]: v }));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Tune SK AI to the way you work.</p>
      </header>

      <Tabs defaultValue="profile">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1">
          {sections.map((s) => (
            <TabsTrigger key={s.value} value={s.value} className="gap-1.5 text-xs">
              <s.icon aria-hidden className="size-3.5" />
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
          <TabsContent value="profile" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue="Skhumba" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="workspace">Workspace</Label>
                <Input id="workspace" defaultValue="Personal Workspace" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" defaultValue="Workplace productivity lead" />
              </div>
            </div>
            <Button>Save profile</Button>
          </TabsContent>

          <TabsContent value="appearance">
            <Row title="Theme" description="Switch between light and dark mode.">
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === "dark" ? <Sun aria-hidden /> : <Moon aria-hidden />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </Button>
            </Row>
            <Row title="Compact density" description="Reduce spacing across the workspace.">
              <Switch aria-label="Compact density" />
            </Row>
          </TabsContent>

          <TabsContent value="notifications">
            <Row title="Email notifications" description="Get an email when long tasks finish.">
              <Switch checked={prefs.email} onCheckedChange={set("email")} aria-label="Email notifications" />
            </Row>
            <Row title="Product updates" description="News about new SK AI capabilities.">
              <Switch checked={prefs.product} onCheckedChange={set("product")} aria-label="Product updates" />
            </Row>
            <Row title="Weekly summary" description="A digest of your AI activity every Friday.">
              <Switch checked={prefs.weekly} onCheckedChange={set("weekly")} aria-label="Weekly summary" />
            </Row>
          </TabsContent>

          <TabsContent value="ai">
            <Row title="Prefer concise responses" description="SK AI keeps answers short unless you ask for detail.">
              <Switch checked={prefs.concise} onCheckedChange={set("concise")} aria-label="Prefer concise responses" />
            </Row>
            <Row title="Show reasoning notes" description="Include a short explanation with generated content.">
              <Switch checked={prefs.citations} onCheckedChange={set("citations")} aria-label="Show reasoning notes" />
            </Row>
            <Row title="Remember context between sessions" description="Off by default for privacy.">
              <Switch checked={prefs.memory} onCheckedChange={set("memory")} aria-label="Remember context" />
            </Row>
          </TabsContent>

          <TabsContent value="privacy">
            <Row title="Anonymous usage analytics" description="Helps improve SK AI. No content is shared.">
              <Switch aria-label="Usage analytics" />
            </Row>
            <Row title="Redact sensitive data" description="Mask emails and numbers before processing.">
              <Switch defaultChecked aria-label="Redact sensitive data" />
            </Row>
          </TabsContent>

          <TabsContent value="data">
            <Row title="Export your data" description="Download every saved email, summary and conversation.">
              <Button variant="outline" size="sm">
                Export
              </Button>
            </Row>
            <Row title="Delete all saved work" description="This cannot be undone.">
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </Row>
          </TabsContent>

          <TabsContent value="services">
            {["Email inbox", "Calendar", "Cloud storage"].map((s) => (
              <Row key={s} title={s} description="Not connected in this demo build.">
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </Row>
            ))}
          </TabsContent>

          <TabsContent value="shortcuts">
            {[
              ["Ctrl + K", "Open the SK AI command center"],
              ["Enter", "Send a message to SK AI"],
              ["Shift + Enter", "New line in the composer"],
            ].map(([key, desc]) => (
              <Row key={key} title={desc as string} description="Works anywhere in the workspace.">
                <kbd className="rounded border border-border px-2 py-1 text-xs font-medium">{key}</kbd>
              </Row>
            ))}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
