import { Link, createFileRoute } from "@tanstack/react-router";
import { Bot, FileText, Keyboard, LifeBuoy, Mail } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — SK AI" },
      { name: "description", content: "Guides, shortcuts and answers for getting the most out of SK AI at work." },
      { property: "og:title", content: "Help & Support — SK AI" },
      { property: "og:description", content: "Learn how SK AI's email, meeting and assistant capabilities connect." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  {
    q: "How do the three capabilities connect?",
    a: "A meeting summary can become a follow-up email, an email can be sent to the assistant for refinement, and a conversation can open the Email Generator — all without retyping anything.",
  },
  {
    q: "Is SK AI using a live AI model?",
    a: "This build runs in demo mode with clearly labelled sample responses. The AI service layer is structured so a real model can be connected without changing the interface.",
  },
  {
    q: "How accurate is the generated content?",
    a: "Treat everything as a first draft. AI output can contain errors or omissions — always review before sending or deciding.",
  },
  {
    q: "How do I move faster?",
    a: "Press Ctrl + K anywhere to open the SK AI command center and jump straight to what you want to accomplish.",
  },
];

function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Help &amp; Support</h2>
        <p className="mt-1 text-sm text-muted-foreground">Everything you need to get productive with SK AI.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Mail, label: "Email Generator", to: "/app/email" },
          { icon: FileText, label: "Meeting Intelligence", to: "/app/meetings" },
          { icon: Bot, label: "AI Assistant", to: "/app/assistant" },
        ].map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="rounded-2xl border border-border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift"
          >
            <s.icon aria-hidden className="size-5 text-primary" />
            <p className="mt-3 text-sm font-medium">{s.label}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
        <Accordion type="single" collapsible>
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-left text-sm">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <LifeBuoy aria-hidden className="mt-0.5 size-5 text-primary" />
          <div>
            <p className="text-sm font-medium">Still stuck?</p>
            <p className="text-xs text-muted-foreground">Ask the assistant — it knows the product.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/app/assistant">
              <Bot aria-hidden /> Ask SK AI
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/app/settings">
              <Keyboard aria-hidden /> Shortcuts
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
