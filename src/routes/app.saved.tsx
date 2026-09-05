import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";

import { SavedWorkspace } from "@/components/sk/saved-workspace";

export const Route = createFileRoute("/app/saved")({
  head: () => ({
    meta: [
      { title: "Saved Work — SK AI" },
      { name: "description", content: "Search, filter and reopen every email, meeting summary and AI conversation you saved in SK AI." },
      { property: "og:title", content: "Saved Work — SK AI" },
      { property: "og:description", content: "Your centralized SK AI workspace of saved emails, meetings and chats." },
    ],
  }),
  component: () => (
    <SavedWorkspace
      icon={FolderOpen}
      title="Saved Work"
      subtitle="Everything you've saved, in one place."
      favoritesOnly={false}
    />
  ),
});
