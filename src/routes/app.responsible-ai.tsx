import { createFileRoute } from "@tanstack/react-router";
import { Eye, Lock, ShieldCheck, SlidersHorizontal, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/app/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — SK AI" },
      {
        name: "description",
        content:
          "How SK AI handles privacy, data controls, AI limitations, human review and security for workplace content.",
      },
      { property: "og:title", content: "Responsible AI — SK AI" },
      { property: "og:description", content: "Privacy, data controls, AI limitations, human review and security." },
    ],
  }),
  component: ResponsibleAI,
});

const pillars = [
  {
    icon: Lock,
    title: "Privacy",
    body: "Only share workplace information you are authorized to process with AI tools. Avoid pasting personal data, credentials or client-confidential material.",
  },
  {
    icon: SlidersHorizontal,
    title: "Data Controls",
    body: "You can export or delete your saved emails, summaries and conversations at any time from Settings → Data Controls.",
  },
  {
    icon: TriangleAlert,
    title: "AI Limitations",
    body: "AI-generated content can be incomplete, outdated or wrong. It may misread tone, invent detail, or miss context that only you have.",
  },
  {
    icon: Eye,
    title: "Human Review",
    body: "Every output is a draft. Read it, correct it and take responsibility for it before it reaches a colleague, client or decision.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    body: "Content is processed for the purpose of the request you made. This build runs in demo mode and does not send your text to an external model.",
  },
];

function ResponsibleAI() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Responsible AI</h2>
        <p className="mt-3 rounded-2xl border border-border bg-surface p-5 text-sm leading-relaxed text-foreground/90">
          SK AI provides AI-generated information and content. AI responses may contain errors or omissions. Always
          review generated content for accuracy, context, privacy, and appropriateness before using it in professional
          or business decisions.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {pillars.map((p) => (
          <article key={p.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <p.icon aria-hidden className="size-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold">{p.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
