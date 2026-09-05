import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { SavedWorkspace } from "@/components/sk/saved-workspace";

export const Route = createFileRoute("/app/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — SK AI" },
      { name: "description", content: "The SK AI emails, meeting summaries and conversations you starred for quick access." },
      { property: "og:title", content: "Favorites — SK AI" },
      { property: "og:description", content: "Your starred SK AI work, always one click away." },
    ],
  }),
  component: () => (
    <SavedWorkspace icon={Star} title="Favorites" subtitle="Your starred work, one click away." favoritesOnly />
  ),
});
