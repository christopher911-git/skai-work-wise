import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Bot, Check, FileText, Mail, ShieldCheck, Sparkles } from "lucide-react";

import dashboardPreview from "@/assets/sk-ai-dashboard-preview.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SK AI — Your Intelligent Workplace Assistant" },
      {
        name: "description",
        content:
          "Write smarter, summarize faster and communicate better with SK AI: one AI assistant for emails, meeting notes and workplace questions.",
      },
      { property: "og:title", content: "SK AI — Your Intelligent Workplace Assistant" },
      {
        property: "og:description",
        content: "One AI brain. Three powerful workplace capabilities: email generation, meeting intelligence and an AI copilot.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    lead: "Professional communication powered by AI.",
    body: "Generate, rewrite and improve emails — set the tone and length, then refine in one click.",
    points: ["Six tone presets", "Instant rewrites", "Editable output"],
  },
  {
    icon: FileText,
    title: "Meeting Intelligence",
    lead: "Turn meetings into actionable information.",
    body: "Summarize notes and identify decisions, action items, owners and deadlines automatically.",
    points: ["Decisions & owners", "Deadlines extracted", "One-click follow-up email"],
  },
  {
    icon: Bot,
    title: "AI Assistant",
    lead: "One AI copilot for your workday.",
    body: "Ask questions, brainstorm, summarize and rewrite — with context carried through the conversation.",
    points: ["Context-aware chat", "Rewrite & summarize", "Hands off to the email tool"],
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3.5 md:px-6">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
            <Sparkles aria-hidden className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm leading-tight font-semibold">SK AI</p>
            <p className="truncate text-[11px] text-muted-foreground">Intelligent Workplace Assistant</p>
          </div>
          <Button asChild size="sm" className="ml-auto">
            <Link to="/app">
              Get Started <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="bg-hero-gradient text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-3 py-1 text-xs font-medium">
              <Sparkles aria-hidden className="size-3.5" /> One AI brain. Your workplace assistant.
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl leading-[1.08] font-semibold tracking-tight md:text-6xl">
              SK AI — Your Intelligent Workplace Assistant
            </h1>
            <p className="mt-5 max-w-2xl text-base text-primary-foreground/75 md:text-lg">
              Write smarter. Summarize faster. Communicate better — with one AI workplace assistant.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/app">
                  Get Started <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                <a href="#capabilities">Explore SK AI</a>
              </Button>
            </div>

            <div className="mt-12 overflow-hidden rounded-2xl border border-primary-foreground/15 shadow-lift">
              <img
                src={dashboardPreview}
                alt="Preview of the SK AI dashboard showing the AI input bar, capability cards and productivity statistics"
                className="w-full"
                loading="lazy"
                width={1600}
                height={1000}
              />
            </div>
          </div>
        </section>

        <section id="capabilities" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Three capabilities, one assistant</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Work moves between the tools automatically — a meeting becomes an email, an email becomes a conversation.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {features.map((f) => (
              <article key={f.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
                  <f.icon aria-hidden className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm font-medium text-primary">{f.lead}</p>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                <ul className="mt-4 space-y-1.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-foreground/85">
                      <Check aria-hidden className="size-4 text-success" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6">
          <div className="flex flex-col items-start gap-6 rounded-3xl border border-border bg-surface p-8 shadow-soft md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Work smarter. Get more done.</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Open the workspace and try it with realistic sample data — no setup, no API key required.
              </p>
            </div>
            <Button asChild size="lg">
              <Link to="/app">
                Open SK AI <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} SK AI · Intelligent Workplace Assistant</p>
          <p className="flex items-center gap-2">
            <ShieldCheck aria-hidden className="size-4" />
            AI-generated content may contain errors. Always review before use.
          </p>
        </div>
      </footer>
    </div>
  );
}
