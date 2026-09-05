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
        content: "Turn lengthy meeting notes into clear summaries, decisions, action items and deadlines with SK AI.",
      },
      { property: "og:title", content: "Meeting Intelligence — SK AI" },
      { property: "og:description", content: "Summarize meetings and turn them into follow-up emails instantly." },
    ],
  }),
  component: MeetingsPage;
});

function MeetingsPage() {
  return null;
}
