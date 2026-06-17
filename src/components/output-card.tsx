import { Copy, Check, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type Props = {
  title: string;
  textForCopy: string;
  onRegenerate?: () => void;
  onDelete?: () => void;
  isRegenerating?: boolean;
  children: ReactNode;
};

export function OutputCard({
  title,
  textForCopy,
  onRegenerate,
  onDelete,
  isRegenerating,
  children,
}: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(textForCopy);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCopy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1.5">Copy</span>
          </Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={isRegenerating}>
              {isRegenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              <span className="ml-1.5">Regenerate</span>
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
              <span className="ml-1.5">Delete</span>
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{children}</div>
    </Card>
  );
}
