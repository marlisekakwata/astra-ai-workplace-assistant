import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { OutputCard } from "@/components/output-card";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { generateEmail } from "@/lib/ai.functions";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Workplace AI" },
      {
        name: "description",
        content: "Generate professional emails with tone control using AI.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);

  const generate = useServerFn(generateEmail);
  const m = useMutation({
    mutationFn: generate,
    onSuccess: (data) => {
      setResult(data);
      addHistory({
        tool: "email",
        title: data.subject || subject,
        preview: data.body.slice(0, 120),
        payload: data,
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const runGenerate = () => {
    if (!recipient.trim() || !subject.trim() || !purpose.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    m.mutate({ data: { recipient, subject, purpose, tone } });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runGenerate();
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Smart Email Generator"
        description="Generate clear, professional emails. Choose a tone, describe your purpose, and we'll draft it."
        icon={Mail}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Sarah Johnson"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g. Project update meeting"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                placeholder="Describe what you want to say…"
                rows={5}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                maxLength={2000}
              />
            </div>
            <div>
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Formal">Formal</SelectItem>
                  <SelectItem value="Friendly">Friendly</SelectItem>
                  <SelectItem value="Persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={m.isPending} className="w-full">
              {m.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                "Generate email"
              )}
            </Button>
            <ResponsibleAiNotice />
          </form>
        </Card>

        <div className="space-y-4">
          {result ? (
            <OutputCard
              title="Generated email"
              textForCopy={`Subject: ${result.subject}\n\n${result.body}`}
              onRegenerate={runGenerate}
              isRegenerating={m.isPending}
              onDelete={() => setResult(null)}
            >
              <p className="font-medium text-foreground">Subject: {result.subject}</p>
              <div className="mt-3 whitespace-pre-wrap">{result.body}</div>
            </OutputCard>
          ) : (
            <Card className="flex h-full min-h-[300px] items-center justify-center p-8 text-center">
              <div>
                <Mail className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-foreground">Your draft will appear here</p>
                <p className="text-xs text-muted-foreground">Fill in the form and hit generate.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
