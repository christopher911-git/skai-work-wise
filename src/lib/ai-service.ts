/**
 * SK AI — centralized AI service layer.
 *
 * Every AI capability in the product goes through this module. Today it
 * returns clearly-labelled demo responses (no API key required). To connect a
 * real LLM later, replace the body of each function with a call to a server
 * function / API route — the signatures and return types stay the same.
 */

export const AI_MODE: "demo" | "live" = "demo";

export type Tone =
  | "Formal"
  | "Friendly"
  | "Professional"
  | "Persuasive"
  | "Apologetic"
  | "Concise";

export type Length = "Short" | "Medium" | "Detailed";

export interface EmailRequest {
  recipient: string;
  purpose: string;
  keyPoints: string;
  context?: string;
  tone: Tone;
  length: Length;
}

export interface GeneratedEmail {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  isDemo: boolean;
}

export interface Decision {
  id: string;
  title: string;
  detail: string;
}

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
}

export interface ImportantDate {
  id: string;
  date: string;
  description: string;
}

export interface MeetingSummary {
  title: string;
  summary: string;
  decisions: Decision[];
  actionItems: ActionItem[];
  dates: ImportantDate[];
  isDemo: boolean;
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatReply {
  content: string;
  isDemo: boolean;
  suggestsEmail: boolean;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const uid = () => Math.random().toString(36).slice(2, 10);

function shouldFail(input: string) {
  return input.trim().toLowerCase() === "fail";
}

export class AIServiceError extends Error {
  constructor(message = "SK AI couldn't complete that request.") {
    super(message);
    this.name = "AIServiceError";
  }
}

const toneOpeners: Record<Tone, string> = {
  Formal: "I hope this message finds you well.",
  Friendly: "Hope you're having a great week!",
  Professional: "Thank you for your time on this.",
  Persuasive: "I wanted to share something I believe will be valuable for you.",
  Apologetic: "Thank you for your patience — I want to apologise for the delay.",
  Concise: "Quick note on the below.",
};

function bulletise(text: string): string[] {
  return text
    .split(/\n|•|;|(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export async function generateEmail(req: EmailRequest): Promise<GeneratedEmail> {
  await delay(1200);
  if (shouldFail(req.purpose)) throw new AIServiceError();

  const points = bulletise(req.keyPoints);
  const detail =
    req.length === "Short" ? points.slice(0, 2) : req.length === "Medium" ? points.slice(0, 4) : points;

  const bodyLines = [
    toneOpeners[req.tone],
    "",
    `I'm reaching out regarding ${req.purpose || "our recent discussion"}.`,
    "",
    ...detail.map((p) => `• ${p}`),
  ];

  if (req.context && req.length !== "Short") {
    bodyLines.push("", `For additional context: ${req.context}`);
  }

  bodyLines.push(
    "",
    req.tone === "Persuasive"
      ? "I'd welcome the chance to walk you through this in more detail — would a short call this week work?"
      : "Please let me know if you'd like anything clarified or expanded on.",
  );

  return {
    subject: `${req.purpose || "Following up"}${req.recipient ? ` — for ${req.recipient}` : ""}`,
    greeting: `Hi ${req.recipient || "there"},`,
    body: bodyLines.join("\n"),
    closing: "Best regards,\nSkhumba",
    isDemo: AI_MODE === "demo",
  };
}

export type ImproveAction =
  | "Make More Professional"
  | "Make Friendlier"
  | "Make More Persuasive"
  | "Make Shorter"
  | "Fix Grammar"
  | "Rewrite";

export async function improveEmail(
  email: GeneratedEmail,
  action: ImproveAction,
): Promise<GeneratedEmail> {
  await delay(900);
  const lines = email.body.split("\n");

  switch (action) {
    case "Make Shorter":
      return {
        ...email,
        body: lines.filter((l) => l.startsWith("•") || l.trim() === "").slice(0, 6).join("\n").trim() ||
          lines.slice(0, 4).join("\n"),
      };
    case "Make Friendlier":
      return { ...email, greeting: `Hi ${email.greeting.replace(/^Hi |,$/g, "")} 👋`.replace(",", ""), body: `Hope you're doing well!\n\n${email.body}` };
    case "Make More Professional":
      return { ...email, body: `I hope this message finds you well.\n\n${email.body}`, closing: "Kind regards,\nSkhumba" };
    case "Make More Persuasive":
      return {
        ...email,
        body: `${email.body}\n\nActing on this now puts us ahead of the timeline and removes risk later in the quarter.`,
      };
    case "Fix Grammar":
      return { ...email, body: email.body.replace(/\s+([,.])/g, "$1").replace(/\s{2,}/g, " ") };
    case "Rewrite":
    default:
      return {
        ...email,
        subject: `Re: ${email.subject}`,
        body: `${email.body
          .split("\n")
          .map((l) => (l.startsWith("•") ? l : l))
          .join("\n")}\n\nRewritten by SK AI for clarity and flow.`,
      };
  }
}

export async function summarizeMeeting(notes: string): Promise<MeetingSummary> {
  await delay(1600);
  if (!notes.trim() || shouldFail(notes)) throw new AIServiceError();

  const firstLine = notes.trim().split("\n")[0]?.slice(0, 60) || "Team Meeting";

  return {
    title: firstLine,
    summary:
      "The team reviewed current progress, aligned on priorities for the coming weeks and agreed on ownership for the outstanding work. Budget and timing were the main points of debate, and a launch window was confirmed. Follow-up items were assigned with clear deadlines.",
    decisions: await extractDecisions(notes),
    actionItems: await extractActionItems(notes),
    dates: [
      { id: uid(), date: "October 15", description: "Campaign launch." },
      { id: uid(), date: "Friday", description: "Proposal due for internal review." },
      { id: uid(), date: "Next Tuesday", description: "Follow-up alignment meeting." },
    ],
    isDemo: AI_MODE === "demo",
  };
}

export async function extractDecisions(_notes: string): Promise<Decision[]> {
  await delay(200);
  return [
    { id: uid(), title: "Launch window confirmed", detail: "The marketing campaign will launch in October." },
    { id: uid(), title: "Budget approved", detail: "An additional allocation was approved for paid distribution." },
    { id: uid(), title: "Ownership agreed", detail: "Marketing leads delivery; Product supports messaging review." },
  ];
}

export async function extractActionItems(_notes: string): Promise<ActionItem[]> {
  await delay(200);
  return [
    { id: uid(), task: "Prepare campaign proposal", owner: "Marketing Team", deadline: "Friday", priority: "High" },
    { id: uid(), task: "Finalise creative brief", owner: "Design", deadline: "Next Wednesday", priority: "Medium" },
    { id: uid(), task: "Confirm media budget with finance", owner: "Skhumba", deadline: "October 3", priority: "High" },
    { id: uid(), task: "Draft launch announcement", owner: "Comms", deadline: "October 10", priority: "Low" },
  ];
}

const EMAIL_INTENT = /(write|draft|send|compose|reply to|respond to).*(email|message|note)/i;

export async function chatWithAssistant(history: ChatTurn[]): Promise<ChatReply> {
  await delay(1100);
  const last = history.filter((t) => t.role === "user").at(-1)?.content ?? "";
  if (shouldFail(last)) throw new AIServiceError();

  const suggestsEmail = EMAIL_INTENT.test(last);
  const contextual = history.length > 2 ? " Building on what we discussed above," : "";

  if (suggestsEmail) {
    return {
      suggestsEmail: true,
      isDemo: AI_MODE === "demo",
      content: `Here's a draft you can use:\n\nSubject: Apologies for the delay\n\nHi there,\n\nThank you for your patience. I want to apologise for the delay on this — it took longer than expected to confirm the final details on our side.\n\nHere's where things stand, and what happens next:\n• The outstanding items are now complete\n• Revised delivery is scheduled for the end of the week\n• I'll send a short confirmation once it's live\n\nThanks again for bearing with us.\n\nBest regards,\nSkhumba\n\nWant me to adjust the tone, or open this in the Email Generator?`,
    };
  }

  if (/meeting|notes|difficult|client call/i.test(last)) {
    return {
      suggestsEmail: false,
      isDemo: AI_MODE === "demo",
      content:
        "I can help you process it. Paste the meeting notes and I'll summarise the key points, decisions and action items — then we can turn that into a follow-up email if it's useful.",
    };
  }

  return {
    suggestsEmail: false,
    isDemo: AI_MODE === "demo",
    content: `${contextual} here's how I'd approach that:\n\n1. Start with the outcome you want the reader to reach.\n2. Give the two or three facts that support it, nothing more.\n3. Close with a single, specific next step.\n\nIf you share the raw text I'll rewrite it for you, summarise it, or turn it into an email. Always review the result before sending it on.`,
  };
}

export async function rewriteContent(content: string, style = "clear and professional"): Promise<string> {
  await delay(800);
  if (shouldFail(content)) throw new AIServiceError();
  return `${content.trim()}\n\n— Rewritten by SK AI to be ${style}.`;
}

export async function summarizeContent(content: string): Promise<string> {
  await delay(800);
  if (shouldFail(content)) throw new AIServiceError();
  const words = content.trim().split(/\s+/).length;
  return `Summary (${words} words condensed): the text sets out the current position, the main constraints, and the next steps required. The essential point is that work is progressing, with a small number of open items that need owners and dates.`;
}

export function emailToPlainText(email: GeneratedEmail): string {
  return `Subject: ${email.subject}\n\n${email.greeting}\n\n${email.body}\n\n${email.closing}`;
}
