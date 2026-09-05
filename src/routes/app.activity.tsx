import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, FileText, Mail, MessageSquare } from "lucide-react";

import { useSk, type ItemKind } from "@/lib/sk-store";

export const Route = createFileRoute("/app/activity")({
  head: () => ({
    meta: [
      { title: "Recent Activity — SK AI" },
      { name: "description", content: "Every SK AI request you've made today and yesterday, ready to reopen." },
      { property: "og:title", content: "Recent Activity — SK AI" },
      { property: "og:description", content: "A full timeline of your SK AI emails, meetings and conversations." },
    ],
  }),
  component: ActivityPage,
});

const kindIcon = { email: Mail, meeting: FileText, chat: MessageSquare } as const;
const kindRoute: Record<ItemKind, string> = {
  email: "/app/email",
  meeting: "/app/meetings",
  chat: "/app/assistant",
};

function ActivityPage() {
  const { activity } = useSk();
  const days: Array<"Today" | "Yesterday"> = ["Today", "Yesterday"];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Recent Activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">Reopen anything SK AI has helped you with.</p>
      </header>

      {days.map((day) => {
        const items = activity.filter((a) => a.day === day);
        if (items.length === 0) return null;
        return (
          <section key={day}>
            <h3 className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{day}</h3>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              {items.map((a) => {
                const Icon = kindIcon[a.kind];
                return (
                  <li key={a.id}>
                    <Link
                      to={kindRoute[a.kind]}
                      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-accent/60"
                    >
                      <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                        {a.time}
                      </span>
                      <Icon aria-hidden className="size-4 shrink-0 text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{a.label}</span>
                        <span className="block truncate text-xs text-muted-foreground">{a.detail}</span>
                      </span>
                      <ArrowUpRight aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
