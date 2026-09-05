import { AlertTriangle, Sparkles, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function AIDemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-accent px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent-foreground uppercase",
        className,
      )}
    >
      <Sparkles aria-hidden className="size-3" />
      AI Demo Response
    </span>
  );
}

export function LoadingState({ message = "SK AI is thinking..." }: { message?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <span className="flex gap-1" aria-hidden>
          <span className="size-1.5 animate-sk-dot rounded-full bg-primary" />
          <span className="size-1.5 animate-sk-dot rounded-full bg-primary [animation-delay:0.15s]" />
          <span className="size-1.5 animate-sk-dot rounded-full bg-violet [animation-delay:0.3s]" />
        </span>
        {message}
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-14 text-center">
      <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground">
        <Icon aria-hidden className="size-6" />
      </span>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong.",
  description = "SK AI couldn't complete that request.",
  onRetry,
  onEdit,
  onBack,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onEdit?: () => void;
  onBack?: () => void;
}) {
  return (
    <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle aria-hidden className="mt-0.5 size-5 text-destructive" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry ? (
              <Button size="sm" onClick={onRetry}>
                Try Again
              </Button>
            ) : null}
            {onEdit ? (
              <Button size="sm" variant="outline" onClick={onEdit}>
                Edit Input
              </Button>
            ) : null}
            {onBack ? (
              <Button size="sm" variant="ghost" onClick={onBack}>
                Go Back
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)}>
      <span className="font-medium text-foreground">Privacy reminder — </span>
      Only upload information you're authorized to share with AI tools.{" "}
      <a className="font-medium text-primary underline underline-offset-2" href="/app/responsible-ai">
        Privacy &amp; Data Controls
      </a>
    </p>
  );
}
