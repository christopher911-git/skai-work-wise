import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Bot,
  FileText,
  Mail,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSk } from "@/lib/sk-store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — SK AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Your SK AI command center: generate emails, summarize meetings and chat with your AI workplace copilot.",
      },
      { property: "og:title", content: "SK AI Dashboard" },
      {
        property: "og:description",
        content: "One AI brain. Three powerful workplace capabilities.",
      },
    ],
  }),
  component: Dashboard,
});

const suggestions = [
  "Write an email",
  "Summarize these notes",
  "Help me respond to this message",
  "Explain this to me",
  "Improve my email",
];

const features = [
  {
    icon: Mail,
    emoji: "✉️",
    title: "Smart Email Generator",
    description: "Generate clear, professional emails in seconds.",
    cta: "Create Email",
    to: "/app/email",
  },
  {
    icon: FileText,
    emoji: "📝",
    title: "Meeting Summarizer",
    description: "Turn long meeting notes into concise summaries and actionable insights.",
    cta: "Summarize Meeting",
    to: "/app/meetings",
  },
  {
    icon: Bot,
    emoji: "🤖",
    title: "AI Assistant",
    description: "Ask questions, brainstorm ideas, rewrite content, and get workplace assistance.",
    cta: "Chat with SK AI",
    to: "/app/assistant",
  },
] as const;

const kindIcon = { email: Mail, meeting: FileText, chat: MessageSquare } as const;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { stats, activity, setChatSeed } = useSk();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const ask = (text: string) => {
    const value = text.trim();
    if (!value) return;
    if (/email/i.test(value)) {
      navigate({ to: "/app/email" });
      return;
    }
    setChatSeed(value);
    navigate({ to: "/app/assistant" });
  };

  const statCards = [
    { value: stats.requests, label: "AI Requests Today", tint: "text-primary" },
    { value: stats.emails, label: "Emails Generated", tint: "text-violet" },
    { value: stats.meetings, label: "Meetings Summarized", tint: "text-success" },
    { value: stats.chats, label: "AI Conversations", tint: "text-warning" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-3xl bg-hero-gradient p-6 text-primary-foreground shadow-lift md:p-10">
        <p className="text-sm text-primary-foreground/70">{greeting()}, Skhumba 👋</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-4xl">
          What can SK AI help you with today?
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(prompt);
          }}
          className="mt-6 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 p-2 backdrop-blur"
        >
          <label htmlFor="universal-ai" className="sr-only">
            Ask SK AI anything
          </label>
          <div className="flex items-center gap-2">
            <input
              id="universal-ai"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask SK AI anything..."
              className="min-w-0 flex-1 bg-transparent px-3 py-3 text-base text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none"
            />
            <button type="button" aria-label="Attach a file" className="rounded-lg p-2 hover:bg-primary-foreground/10">
              <Paperclip aria-hidden className="size-5" />
            </button>
            <button type="button" aria-label="Voice input" className="rounded-lg p-2 hover:bg-primary-foreground/10">
              <Mic aria-hidden className="size-5" />
            </button>
            <Button type="submit" size="icon" aria-label="Send to SK AI" className="rounded-lg">
              <Send aria-hidden />
            </Button>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-primary-foreground/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10"
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section aria-label="Capabilities" className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <article
            key={f.title}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-lift"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
              <f.icon aria-hidden className="size-5" />
            </span>
            <h3 className="mt-4 text-base font-semibold">
              <span aria-hidden className="mr-1.5">
                {f.emoji}
              </span>
              {f.title}
            </h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{f.description}</p>
            <Button asChild className="mt-5 w-full">
              <Link to={f.to}>{f.cta}</Link>
            </Button>
          </article>
        ))}
      </section>

      <section aria-label="Productivity overview" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className={`text-3xl font-semibold ${s.tint}`}>{s.value}</p>
              <TrendingUp aria-hidden className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </section>

      <section aria-label="Recent activity" className="rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold">Recent Activity</h3>
          <Link to="/app/activity" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {activity.slice(0, 5).map((a) => {
            const Icon = kindIcon[a.kind];
            return (
              <li key={a.id}>
                <Link
                  to={a.kind === "email" ? "/app/email" : a.kind === "meeting" ? "/app/meetings" : "/app/assistant"}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/60"
                >
                  <span className="w-12 shrink-0 text-xs font-medium text-muted-foreground tabular-nums">{a.time}</span>
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

      <p className="flex items-start gap-2 rounded-xl border border-border bg-surface p-4 text-xs text-muted-foreground">
        <Sparkles aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
        SK AI provides AI-generated content that may contain errors or omissions. Always review before use.{" "}
        <Link to="/app/responsible-ai" className="font-medium text-primary hover:underline">
          Responsible AI
        </Link>
      </p>
    </div>
  );
}
