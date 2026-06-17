import { Copy, Check, RefreshCw, Trash2, Loader2, Pencil, Save, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Props = {
  title: string;
  textForCopy: string;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onEdit?: (next: string) => void;
  isRegenerating?: boolean;
  children: ReactNode;
};

export function OutputCard({
  title,
  textForCopy,
  onRegenerate,
  onDelete,
  onEdit,
  isRegenerating,
  children,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(textForCopy);

  useEffect(() => {
    if (!isEditing) setDraft(textForCopy);
  }, [textForCopy, isEditing]);

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

  const startEdit = () => {
    setDraft(textForCopy);
    setIsEditing(true);
  };

  const saveEdit = () => {
    onEdit?.(draft);
    setIsEditing(false);
    toast.success("Changes saved");
  };

  const cancelEdit = () => {
    setDraft(textForCopy);
    setIsEditing(false);
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3 mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="default" size="sm" onClick={saveEdit}>
                <Save className="h-3.5 w-3.5" />
                <span className="ml-1.5">Save</span>
              </Button>
              <Button variant="outline" size="sm" onClick={cancelEdit}>
                <X className="h-3.5 w-3.5" />
                <span className="ml-1.5">Cancel</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={onCopy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="ml-1.5">Copy</span>
              </Button>
              {onEdit && (
                <Button variant="outline" size="sm" onClick={startEdit}>
                  <Pencil className="h-3.5 w-3.5" />
                  <span className="ml-1.5">Edit</span>
                </Button>
              )}
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
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={16}
          className="font-mono text-sm"
        />
      ) : (
        <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{children}</div>
      )}
    </Card>
  );
}
