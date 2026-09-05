import { Link } from "@tanstack/react-router";
import { FileText, Mail, MessageSquare, Pencil, Star, Trash2, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/sk/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSk, type ItemKind } from "@/lib/sk-store";
import { cn } from "@/lib/utils";

const filters = ["All", "Emails", "Meetings", "AI Conversations"] as const;
type Filter = (typeof filters)[number];

const kindIcon: Record<ItemKind, LucideIcon> = { email: Mail, meeting: FileText, chat: MessageSquare };
const kindRoute: Record<ItemKind, string> = {
  email: "/app/email",
  meeting: "/app/meetings",
  chat: "/app/assistant",
};

function matches(kind: ItemKind, filter: Filter) {
  if (filter === "All") return true;
  if (filter === "Emails") return kind === "email";
  if (filter === "Meetings") return kind === "meeting";
  return kind === "chat";
}

export function SavedWorkspace({
  icon,
  title,
  subtitle,
  favoritesOnly,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  favoritesOnly: boolean;
}) {
  const { saved, toggleFavorite, renameItem, deleteItem } = useSk();
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const items = saved
    .filter((s) => (favoritesOnly ? s.favorite : true))
    .filter((s) => matches(s.kind, filter))
    .filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label htmlFor="saved-search" className="sr-only">
          Search saved work
        </label>
        <Input
          id="saved-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your saved work…"
          className="sm:max-w-xs"
        />
        <div role="tablist" aria-label="Filter saved work" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filter === f
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-surface hover:bg-accent",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={icon}
          title="Nothing here yet"
          description="Work you save from the Email Generator, Meeting Intelligence or the AI Assistant will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const Icon = kindIcon[item.kind];
            return (
              <li
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon aria-hidden className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.preview} · {item.savedAt}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button asChild size="sm" variant="outline">
                    <Link to={kindRoute[item.kind]}>Open</Link>
                  </Button>
                  <button
                    type="button"
                    aria-label={item.favorite ? `Unfavorite ${item.title}` : `Favorite ${item.title}`}
                    onClick={() => toggleFavorite(item.id)}
                    className="rounded-md p-2 hover:bg-accent"
                  >
                    <Star aria-hidden className={cn("size-4", item.favorite && "fill-warning text-warning")} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Rename ${item.title}`}
                    onClick={() => {
                      const next = window.prompt("Rename item", item.title);
                      if (next) renameItem(item.id, next);
                    }}
                    className="rounded-md p-2 hover:bg-accent"
                  >
                    <Pencil aria-hidden className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => {
                      deleteItem(item.id);
                      toast.success("Item deleted");
                    }}
                    className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
