import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NotebookPen, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { OutputCard } from "@/components/output-card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { summarizeMeeting } from "@/lib/ai.functions";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — Workplace AI" },
      {
        name: "description",
        content: "Turn meeting notes into summaries, decisions, and action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

type Result = {
  summary: string;
  decisions: string[];
  actionItems: string[];
  deadlines: string[];
};

function MeetingsPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [editedText, setEditedText] = useState<string | null>(null);

  const summarize = useServerFn(summarizeMeeting);
  const m = useMutation({
    mutationFn: summarize,
    onSuccess: (data) => {
      setResult(data);
      setEditedText(null);
      addHistory({
        tool: "meeting",
        title: data.summary.slice(0, 60),
        preview: `${data.decisions.length} decisions • ${data.actionItems.length} actions`,
        payload: data,
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const runSummarize = () => {
    if (notes.trim().length < 10) {
      toast.error("Please paste your meeting notes");
      return;
    }
    m.mutate({ data: { notes } });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSummarize();
  };

  const exportText = result
    ? `Executive Summary:\n${result.summary}\n\nKey Decisions:\n${result.decisions
        .map((d) => `- ${d}`)
        .join("\n")}\n\nAction Items:\n${result.actionItems
        .map((a) => `- ${a}`)
        .join("\n")}\n\nDeadlines:\n${result.deadlines.map((d) => `- ${d}`).join("\n")}`
    : "";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw meeting notes and get a clean summary, decisions, action items, and deadlines."
        icon={NotebookPen}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <Textarea
              placeholder="Paste meeting notes here…"
              rows={14}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={20000}
            />
            <Button type="submit" disabled={m.isPending} className="w-full">
              {m.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Summarizing…
                </>
              ) : (
                "Summarize meeting"
              )}
            </Button>
            <ResponsibleAiNotice />
          </form>
        </Card>

        <div>
          {result ? (
            <OutputCard
              title="Meeting summary"
              textForCopy={editedText ?? exportText}
              onRegenerate={runSummarize}
              isRegenerating={m.isPending}
              onDelete={() => {
                setResult(null);
                setEditedText(null);
              }}
              onEdit={(next) => setEditedText(next)}
            >
              {editedText ? (
                <div className="whitespace-pre-wrap">{editedText}</div>
              ) : (
                <>
                  <Section title="Executive Summary">
                    <p>{result.summary}</p>
                  </Section>
                  <Section title="Key Decisions">
                    <ItemList items={result.decisions} empty="No decisions captured." />
                  </Section>
                  <Section title="Action Items">
                    <ItemList items={result.actionItems} empty="No action items." />
                  </Section>
                  <Section title="Deadlines">
                    <ItemList items={result.deadlines} empty="No deadlines mentioned." />
                  </Section>
                </>
              )}
            </OutputCard>
          ) : (
            <Card className="flex h-full min-h-[300px] items-center justify-center p-8 text-center">
              <div>
                <NotebookPen className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-foreground">
                  Your summary will appear here
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

function ItemList({ items, empty }: { items: string[]; empty: string }) {
  if (!items?.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  return (
    <ul className="list-disc space-y-1 pl-5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}
