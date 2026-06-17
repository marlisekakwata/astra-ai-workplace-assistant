import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { addHistory } from "@/lib/history";

export const Route = createFileRoute("/chatbot")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      { name: "description", content: "Chat with an AI workplace assistant for instant guidance." },
    ],
  }),
  component: ChatbotPage,
});

const SUGGESTIONS = [
  "How can I improve team productivity?",
  "Create a meeting agenda for a sprint review.",
  "Write a follow-up email after a client call.",
  "What's a good weekly planning routine?",
];

function ChatbotPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => console.error(err),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const loggedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const isLoading = status === "submitted" || status === "streaming";

  // log first assistant reply per session
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || loggedRef.current.has(last.id)) return;
    if (status !== "ready") return;
    const text = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    if (text.trim().length > 0) {
      loggedRef.current.add(last.id);
      const firstUser = messages.find((m) => m.role === "user");
      const userText = firstUser?.parts.map((p) => (p.type === "text" ? p.text : "")).join("") ?? "Chat";
      addHistory({
        tool: "chat",
        title: userText.slice(0, 60),
        preview: text.slice(0, 120),
        payload: { messageCount: messages.length },
      });
    }
  }, [messages, status]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="AI Workplace Chatbot"
        description="Ask anything about productivity, communication, planning, or workplace problems."
        icon={Bot}
      />

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 min-h-[400px] max-h-[60vh]">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">How can I help today?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try one of these to get started.</p>
              <div className="mt-4 grid gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-background px-3 py-2 text-left text-sm text-foreground transition hover:bg-accent/30"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <Message key={m.id} role={m.role} text={m.parts.map((p) => (p.type === "text" ? p.text : "")).join("")} />
              ))}
              {status === "submitted" && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> thinking…
                </div>
              )}
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border bg-card p-3"
        >
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the workplace assistant…"
              disabled={isLoading}
              maxLength={2000}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-4">
        <ResponsibleAiNotice />
      </div>
    </div>
  );
}

function Message({ role, text }: { role: string; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:my-2">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent-foreground">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
