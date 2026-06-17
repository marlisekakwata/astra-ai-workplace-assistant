import { ShieldAlert } from "lucide-react";

export function ResponsibleAiNotice() {
  return (
    <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-foreground/80">
      <ShieldAlert className="h-4 w-4 shrink-0 text-warning" />
      <p>
        <span className="font-medium text-foreground">Responsible AI Notice:</span> AI-generated
        content is for assistance only. Review, verify, and edit outputs before sending or acting on
        them. Results may be inaccurate or incomplete.
      </p>
    </div>
  );
}
