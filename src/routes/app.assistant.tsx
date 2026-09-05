import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bot, Mail, Mic, Paperclip, Plus, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AIDemoBadge, EmptyState, ErrorState } from "@/components/sk/states";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { chatWithAssistant, type ChatTurn } from "@/lib/ai-service";
import { useSk } from "@/lib/sk-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/assistant")({
  head: () => ({
    meta: [
      { title: "SK AI Assistant — Your workplace copilot" },
      {
        name: "description",
        content: "Chat with SK AI to write, rewrite, summarize, brainstorm and handle workplace communication.",
      },
      { property: "og:title", content: "SK AI Assistant" },
      { property: "og:description", content: "Your intelligent workplace copilot for writing and summarizing." },
    ],
  }),
  component: AssistantPage,
});

interface Message extends ChatTurn {
  id: string;
  isDemo?: boolean;
  suggestsEmail?: boolean;
}

const prompts = [
  "Write an email for me.",
  "Summarize this document.",
  "Make this message more professional.",
  "Help me respond to a client.",
  "Explain this in simple terms.",
];

const history = {
  Today: ["Client Email", "Marketing Meeting", "Presentation Preparation"],
  Yesterday: ["Project Discussion"],
};

const uid = () => Math.random().toString(36).slice(2, 10);

function AssistantPage() {
  const { chatSeed, setChatSeed, logActivity } = useSk();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [thinking]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || thinking) return;
    setInput("");
    setError(false);
    const next: Message[] = [...messages, { id: uid(), role: "user", content: value }];
    setMessages(next);
    setThinking(true);
    try {
      const reply = await chatWithAssistant(next.map(({ role, content }) => ({ role, content })));
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: reply.content, isDemo: reply.isDemo, suggestsEmail: reply.suggestsEmail },
      ]);
      logActivity({ kind: "chat", label: "AI Conversation", detail: `“${value.slice(0, 60)}”` });
    } catch {
      setError(true);
    } finally {
      setThinking(false);
    }
  };

  useEffect(() => {
    if (!chatSeed) return;
    const seed = chatSeed;
    setChatSeed(null);
    void send(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatSeed]);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="hidden rounded-2xl border border-border bg-card p-4 shadow-soft lg:block">
        <Button variant="outline" className="w-full" onClick={() => setMessages([])}>
          <Plus aria-hidden /> New conversation
        </Button>
        <nav aria-label="Conversation history" className="mt-5 space-y-4">
          {Object.entries(history).map(([day, items]) => (
            <div key={day}>
              <p className="px-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{day}</p>
              <ul className="mt-1 space-y-0.5">
                {items.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      className="w-full truncate rounded-lg px-2 py-2 text-left text-sm text-foreground/85 hover:bg-accent"
                    >
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <section className="flex min-h-[70vh] flex-col rounded-2xl border border-border bg-card shadow-soft">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold">SK AI Assistant</h2>
          <p className="text-sm text-muted-foreground">Your intelligent workplace copilot.</p>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 md:px-6">
          {messages.length === 0 && !thinking ? (
            <EmptyState
              icon={Bot}
              title="Your AI workplace copilot is ready."
              description="Ask me anything related to your work — writing, rewriting, summarizing or brainstorming."
            />
          ) : null}

          {messages.map((m) => (
            <div key={m.id} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground">
                  <Bot aria-hidden className="size-4" />
                </span>
              )}
              <div className={cn("max-w-[85%] space-y-2", m.role === "user" && "flex flex-col items-end")}>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap",
                    m.role === "user" ? "bg-primary text-primary-foreground" : "text-foreground/90",
                  )}
                >
                  {m.content}
                </div>
                {m.isDemo && <AIDemoBadge />}
                {m.suggestsEmail && (
                  <Button size="sm" variant="outline" onClick={() => navigate({ to: "/app/email" })}>
                    <Mail aria-hidden /> Open in Email Generator
                  </Button>
                )}
              </div>
              {m.role === "user" && (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <User aria-hidden className="size-4" />
                </span>
              )}
            </div>
          ))}

          {thinking && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground" role="status" aria-live="polite">
              <span className="flex size-8 items-center justify-center rounded-lg bg-brand-gradient text-primary-foreground">
                <Bot aria-hidden className="size-4" />
              </span>
              SK AI is thinking
              <span className="flex gap-1" aria-hidden>
                <span className="size-1.5 animate-sk-dot rounded-full bg-primary" />
                <span className="size-1.5 animate-sk-dot rounded-full bg-primary [animation-delay:0.15s]" />
                <span className="size-1.5 animate-sk-dot rounded-full bg-violet [animation-delay:0.3s]" />
              </span>
            </div>
          )}

          {error && (
            <ErrorState onRetry={() => send(messages.at(-1)?.content ?? "")} onBack={() => setError(false)} />
          )}

          <div ref={endRef} />
        </div>

        <div className="border-t border-border p-4 md:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {prompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-colors hover:border-ring hover:bg-accent"
              >
                {p}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2 rounded-2xl border border-border bg-surface p-2"
          >
            <label htmlFor="chat-input" className="sr-only">
              Message SK AI
            </label>
            <Textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message SK AI..."
              className="min-h-11 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <button type="button" aria-label="Attach a file" className="rounded-lg p-2 hover:bg-accent">
              <Paperclip aria-hidden className="size-5" />
            </button>
            <button type="button" aria-label="Voice input" className="rounded-lg p-2 hover:bg-accent">
              <Mic aria-hidden className="size-5" />
            </button>
            <Button type="submit" size="icon" aria-label="Send message" disabled={thinking}>
              <Send aria-hidden />
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
