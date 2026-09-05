import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Bot, Copy, Mail, Pencil, RefreshCw, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AIDemoBadge, EmptyState, ErrorState, LoadingState } from "@/components/sk/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  emailToPlainText,
  generateEmail,
  improveEmail,
  type GeneratedEmail,
  type ImproveAction,
  type Length,
  type Tone,
} from "@/lib/ai-service";
import { useSk } from "@/lib/sk-store";

export const Route = createFileRoute("/app/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — SK AI" },
      {
        name: "description",
        content: "Write clear, professional emails in seconds with SK AI, then refine the tone in one click.",
      },
      { property: "og:title", content: "Smart Email Generator — SK AI" },
      { property: "og:description", content: "Generate, rewrite and improve workplace emails with SK AI." },
    ],
  }),
  component: EmailPage,
});

const tones: Tone[] = ["Formal", "Friendly", "Professional", "Persuasive", "Apologetic", "Concise"];
const lengths: Length[] = ["Short", "Medium", "Detailed"];
const quickActions: ImproveAction[] = [
  "Make More Professional",
  "Make Friendlier",
  "Make More Persuasive",
  "Make Shorter",
  "Fix Grammar",
  "Rewrite",
];

function EmailPage() {
  const { emailPrefill, setEmailPrefill, logActivity, saveItem, setChatSeed, setLastEmail } = useSk();
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [length, setLength] = useState<Length>("Medium");

  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Writing your email...");
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!emailPrefill) return;
    setRecipient(emailPrefill.recipient ?? "");
    setPurpose(emailPrefill.purpose ?? "");
    setKeyPoints(emailPrefill.keyPoints ?? "");
    setContext(emailPrefill.context ?? "");
    setEmailPrefill(null);
    toast.success("Meeting details brought into the Email Generator");
  }, [emailPrefill, setEmailPrefill]);

  const run = async () => {
    setLoading(true);
    setError(false);
    setLoadingMessage("Writing your email...");
    try {
      const result = await generateEmail({ recipient, purpose, keyPoints, context, tone, length });
      setEmail(result);
      setLastEmail(result);
      logActivity({ kind: "email", label: "Email Generated", detail: result.subject });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const applyAction = async (action: ImproveAction) => {
    if (!email) return;
    setLoading(true);
    setLoadingMessage("Understanding your request...");
    try {
      const updated = await improveEmail(email, action);
      setEmail(updated);
      setLastEmail(updated);
      logActivity({ kind: "email", label: "Email Rewritten", detail: action });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!email) return;
    await navigator.clipboard.writeText(emailToPlainText(email));
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Smart Email Generator</h2>
        <p className="mt-1 text-sm text-muted-foreground">Write clear, professional emails in seconds.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-label="Email details" className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
          <h3 className="text-sm font-semibold">Email Details</h3>

          <div className="mt-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipient">Recipient / Audience</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Thandi at Nedbank"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purpose">Email Purpose</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. following up after our campaign meeting"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="points">Key Points</Label>
              <Textarea
                id="points"
                rows={5}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="One point per line…"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                rows={4}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Background the AI should keep in mind…"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tones.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={(v) => setLength(v as Length)}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {lengths.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles aria-hidden />
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </div>
        </section>

        <section aria-label="Generated email" className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">Generated Email</h3>
            {email?.isDemo && !loading && <AIDemoBadge />}
          </div>

          <div className="mt-5">
            {loading ? (
              <LoadingState message={loadingMessage} />
            ) : error ? (
              <ErrorState onRetry={run} onEdit={() => setError(false)} />
            ) : !email ? (
              <EmptyState
                icon={Mail}
                title="Ready to write?"
                description="Tell SK AI what you want to communicate and it will draft the email for you."
              />
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Subject</p>
                  {editing ? (
                    <Input
                      className="mt-1"
                      value={email.subject}
                      onChange={(e) => setEmail({ ...email, subject: e.target.value })}
                    />
                  ) : (
                    <p className="mt-1 text-sm font-medium">{email.subject}</p>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-sm font-medium">{email.greeting}</p>
                  {editing ? (
                    <Textarea
                      rows={12}
                      className="mt-3"
                      value={email.body}
                      onChange={(e) => setEmail({ ...email, body: e.target.value })}
                    />
                  ) : (
                    <p className="mt-3 text-sm whitespace-pre-wrap text-foreground/90">{email.body}</p>
                  )}
                  <p className="mt-4 text-sm whitespace-pre-wrap text-foreground/90">{email.closing}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={copy}>
                    <Copy aria-hidden /> Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing((v) => !v)}>
                    <Pencil aria-hidden /> {editing ? "Done" : "Edit"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={run}>
                    <RefreshCw aria-hidden /> Regenerate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      saveItem({ kind: "email", title: email.subject, preview: email.body.slice(0, 80) });
                      toast.success("Email saved to your workspace");
                    }}
                  >
                    <Star aria-hidden /> Save
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setChatSeed(`Please help me improve this email:\n\n${emailToPlainText(email)}`);
                      navigate({ to: "/app/assistant" });
                    }}
                  >
                    <Bot aria-hidden /> Improve With SK AI
                  </Button>
                </div>

                <div>
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Quick AI actions</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {quickActions.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => applyAction(a)}
                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium transition-colors hover:border-ring hover:bg-accent"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
