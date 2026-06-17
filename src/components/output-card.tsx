import { Copy, Check, FileDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { exportTextAsPdf } from "@/lib/export-pdf";

type Props = {
  title: string;
  textForCopy: string;
  pdfTitle?: string;
  children: ReactNode;
};

export function OutputCard({ title, textForCopy, pdfTitle, children }: Props) {
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportTextAsPdf(pdfTitle ?? title, textForCopy)}
          >
            <FileDown className="h-3.5 w-3.5" />
            <span className="ml-1.5">PDF</span>
          </Button>
        </div>
      </div>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{children}</div>
    </Card>
  );
}
