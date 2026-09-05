import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Bot,
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  ListChecks,
  Mail,
  Sparkles,
  Star,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { AIDemoBadge, EmptyState, ErrorState, LoadingState, PrivacyNote } from "@/components/sk/states";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting, type MeetingSummary } from "@/lib/ai-service";
import { useSk } from "@/lib/sk-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Intelligence — SK AI" },
      {
        name: "description",
        content:
          "Turn lengthy meeting notes into clear summaries, decisions, action items and deadlines with SK AI.",
      },
      { property: "og:title", content: "Meeting Intelligence — SK AI" },
      { property: "og:description", content: "Summarize meetings and turn them into follow-up emails instantly." },
    ],
  }),
  component: MeetingsPage,
});

const priorityStyles: Record<string, string> = {
  High: "border-destructive/40 text-destructive",
  Medium: "border-warning/50 text-warning",
  Low: "border-border text-muted-foreground",
};

function summaryToText(s: MeetingSummary) {
  return [
    `Meeting: ${s.title}`,
    "",
    "Summary:",
    s.summary,
    "",
    "Key decisions:",
    ...s.decisions.map((d) => `• ${d.title} — ${d.detail}`),
    "",
    "Action items:",
    ...s.actionItems.map((a) => `• ${a.task} — ${a.owner}, due ${a.deadline} (${a.priority})`),
    "",
    "Important dates:",
    ...s.dates.map((d) => `• ${d.date}: ${d.description}`),
  ].join("\n");
}

function MeetingsPage() {
  const { logActivity, saveItem, setEmailPrefill, setChatSeed, setMeetingContext } = useSk();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await summarizeMeeting(notes);
      setSummary(result);
      setMeetingContext(result);
      logActivity({ kind: "meeting", label: "Meeting Summarized", detail: result.title });
    } catch {
      setError("SK AI couldn't complete that request.");
    } finally {
      setLoading(false);
    }
  };

  const readFile = async (file: File) => {
    if (!/\.(txt|md|csv)$/i.test(file.name)) {
      setError("Unable to process this file. Please check the file format and try again.");
      return;
    }
    setError(null);
    setNotes(await file.text());
    toast.success(`${file.name} loaded`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">Meeting Intelligence</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn lengthy meeting notes into clear, actionable information.
        </p>
      </header>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
        <label htmlFor="notes" className="text-sm font-semibold">
          Meeting notes
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) void readFile(file);
          }}
          className={cn("mt-3 rounded-xl border-2 border-dashed p-1 transition-colors", dragging ? "border-ring bg-accent/50" : "border-transparent")}
        >
          <Textarea
            id="notes"
            rows={10}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes here..."
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button onClick={analyze} disabled={loading || !notes.trim()}>
            <Sparkles aria-hidden />
            {loading ? "Analyzing…" : "Analyze Meeting"}
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            <Upload aria-hidden /> Upload notes
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv"
            className="sr-only"
            aria-label="Upload meeting notes file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void readFile(file);
            }}
          />
          <span className="text-xs text-muted-foreground">or drag &amp; drop a .txt file</span>
        </div>

        <PrivacyNote className="mt-4" />
      </section>

      {loading ? (
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <LoadingState message="Analyzing your notes..." />
        </section>
      ) : error ? (
        <ErrorState
          title={error.startsWith("Unable") ? "Unable to process this file." : "Something went wrong."}
          description={
            error.startsWith("Unable")
              ? "Please check the file format and try again."
              : "SK AI couldn't complete that request."
          }
          onRetry={analyze}
          onEdit={() => setError(null)}
        />
      ) : !summary ? (
        <EmptyState
          icon={FileText}
          title="Turn notes into action."
          description="Paste your meeting notes to get started — SK AI will pull out the summary, decisions, action items and dates."
        />
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-5 shadow-soft md:p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">AI Summary</h3>
              {summary.isDemo && <AIDemoBadge />}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">{summary.summary}</p>
          </section>

          <section aria-label="Key decisions">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 aria-hidden className="size-4 text-success" /> Key Decisions
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {summary.decisions.map((d) => (
                <article key={d.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Decision</p>
                  <p className="mt-1 text-sm font-medium">{d.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-label="Action items">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ListChecks aria-hidden className="size-4 text-primary" /> Action Items
            </h3>
            <ul className="space-y-3">
              {summary.actionItems.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{a.task}</p>
                    <p className="text-xs text-muted-foreground">
                      Assigned to {a.owner} · Deadline {a.deadline}
                    </p>
                  </div>
                  <span className={cn("w-fit rounded-full border px-2.5 py-1 text-xs font-medium", priorityStyles[a.priority])}>
                    {a.priority} priority
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Important dates">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <CalendarDays aria-hidden className="size-4 text-violet" /> Important Dates
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {summary.dates.map((d) => (
                <div key={d.id} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <p className="text-sm font-semibold text-primary">{d.date}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
            <h3 className="text-sm font-semibold">What would you like to do next?</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => {
                  setEmailPrefill({
                    recipient: "Meeting attendees",
                    purpose: `follow-up on ${summary.title}`,
                    keyPoints: summary.actionItems.map((a) => `${a.task} — ${a.owner}, due ${a.deadline}`).join("\n"),
                    context: summary.summary,
                  });
                  navigate({ to: "/app/email" });
                }}
              >
                <Mail aria-hidden /> Create Follow-up Email
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setChatSeed(`Here is my meeting summary — help me think it through:\n\n${summaryToText(summary)}`);
                  navigate({ to: "/app/assistant" });
                }}
              >
                <Bot aria-hidden /> Ask SK AI About This Meeting
              </Button>
              <Button
                variant="outline"
                onClick={async () => {
                  await navigator.clipboard.writeText(summaryToText(summary));
                  toast.success("Summary copied");
                }}
              >
                <Copy aria-hidden /> Copy Summary
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  saveItem({ kind: "meeting", title: summary.title, preview: summary.summary.slice(0, 80) });
                  toast.success("Meeting saved to your workspace");
                }}
              >
                <Star aria-hidden /> Save Meeting
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const blob = new Blob([summaryToText(summary)], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "sk-ai-meeting-summary.txt";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download aria-hidden /> Export Summary
              </Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
