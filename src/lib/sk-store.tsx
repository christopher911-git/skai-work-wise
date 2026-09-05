import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { GeneratedEmail, MeetingSummary } from "./ai-service";

export type ItemKind = "email" | "meeting" | "chat";

export interface ActivityEntry {
  id: string;
  time: string;
  kind: ItemKind;
  label: string;
  detail: string;
  day: "Today" | "Yesterday";
  payload?: unknown;
}

export interface SavedItem {
  id: string;
  kind: ItemKind;
  title: string;
  preview: string;
  savedAt: string;
  favorite: boolean;
}

export interface EmailPrefill {
  recipient?: string;
  purpose?: string;
  keyPoints?: string;
  context?: string;
}

interface SkStore {
  activity: ActivityEntry[];
  saved: SavedItem[];
  emailPrefill: EmailPrefill | null;
  chatSeed: string | null;
  meetingContext: MeetingSummary | null;
  theme: "light" | "dark";
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleTheme: () => void;
  logActivity: (entry: Omit<ActivityEntry, "id" | "time" | "day">) => void;
  saveItem: (item: Omit<SavedItem, "id" | "savedAt" | "favorite">) => void;
  toggleFavorite: (id: string) => void;
  renameItem: (id: string, title: string) => void;
  deleteItem: (id: string) => void;
  setEmailPrefill: (p: EmailPrefill | null) => void;
  setChatSeed: (s: string | null) => void;
  setMeetingContext: (m: MeetingSummary | null) => void;
  stats: { requests: number; emails: number; meetings: number; chats: number };
  lastEmail: GeneratedEmail | null;
  setLastEmail: (e: GeneratedEmail | null) => void;
}

const SkContext = createContext<SkStore | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

const nowTime = () =>
  new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

const seedActivity: ActivityEntry[] = [
  { id: uid(), time: "09:42", kind: "email", label: "Email Generated", detail: "Client follow-up email", day: "Today" },
  { id: uid(), time: "09:15", kind: "meeting", label: "Meeting Summarized", detail: "Marketing Strategy Meeting", day: "Today" },
  { id: uid(), time: "08:50", kind: "chat", label: "AI Conversation", detail: "“Help me prepare for a client presentation.”", day: "Today" },
  { id: uid(), time: "17:20", kind: "email", label: "Email Rewritten", detail: "Supplier pricing update", day: "Yesterday" },
  { id: uid(), time: "16:05", kind: "meeting", label: "Meeting Summary Saved", detail: "Quarterly Planning", day: "Yesterday" },
];

const seedSaved: SavedItem[] = [
  { id: uid(), kind: "email", title: "Client follow-up email", preview: "Thank you for your time on this…", savedAt: "Today, 09:42", favorite: true },
  { id: uid(), kind: "meeting", title: "Marketing Strategy Meeting", preview: "Campaign launches in October…", savedAt: "Today, 09:15", favorite: false },
  { id: uid(), kind: "chat", title: "Presentation preparation", preview: "Help me prepare for a client presentation.", savedAt: "Yesterday, 15:11", favorite: true },
  { id: uid(), kind: "email", title: "Delay apology to Nedbank", preview: "Thank you for your patience…", savedAt: "Yesterday, 11:02", favorite: false },
];

export function SkProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<ActivityEntry[]>(seedActivity);
  const [saved, setSaved] = useState<SavedItem[]>(seedSaved);
  const [emailPrefill, setEmailPrefill] = useState<EmailPrefill | null>(null);
  const [chatSeed, setChatSeed] = useState<string | null>(null);
  const [meetingContext, setMeetingContext] = useState<MeetingSummary | null>(null);
  const [lastEmail, setLastEmail] = useState<GeneratedEmail | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const logActivity = useCallback((entry: Omit<ActivityEntry, "id" | "time" | "day">) => {
    setActivity((prev) => [{ ...entry, id: uid(), time: nowTime(), day: "Today" }, ...prev]);
  }, []);

  const saveItem = useCallback((item: Omit<SavedItem, "id" | "savedAt" | "favorite">) => {
    setSaved((prev) => [{ ...item, id: uid(), savedAt: `Today, ${nowTime()}`, favorite: false }, ...prev]);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setSaved((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)));
  }, []);

  const renameItem = useCallback((id: string, title: string) => {
    setSaved((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setSaved((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const stats = useMemo(() => {
    const today = activity.filter((a) => a.day === "Today");
    return {
      requests: 12 + today.length - 3,
      emails: 5 + today.filter((a) => a.kind === "email").length - 1,
      meetings: 3 + today.filter((a) => a.kind === "meeting").length - 1,
      chats: 24 + today.filter((a) => a.kind === "chat").length - 1,
    };
  }, [activity]);

  const value: SkStore = {
    activity,
    saved,
    emailPrefill,
    chatSeed,
    meetingContext,
    theme,
    commandOpen,
    setCommandOpen,
    toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    logActivity,
    saveItem,
    toggleFavorite,
    renameItem,
    deleteItem,
    setEmailPrefill,
    setChatSeed,
    setMeetingContext,
    stats,
    lastEmail,
    setLastEmail,
  };

  return <SkContext.Provider value={value}>{children}</SkContext.Provider>;
}

export function useSk() {
  const ctx = useContext(SkContext);
  if (!ctx) throw new Error("useSk must be used inside SkProvider");
  return ctx;
}
