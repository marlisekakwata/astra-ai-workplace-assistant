import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  NotebookPen,
  CalendarCheck,
  Search,
  Bot,
  ArrowRight,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getHistory, type HistoryEntry } from "@/lib/history";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      {
        name: "description",
        content: "Your AI workplace command center: emails, meetings, tasks, research, and chat.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft professional emails in seconds — formal, friendly, or persuasive.",
    icon: Mail,
    url: "/email" as const,
    color: "from-blue-500/15 to-blue-500/0 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Meeting Summarizer",
    description: "Turn long meeting notes into summaries, decisions, and action items.",
    icon: NotebookPen,
    url: "/meetings" as const,
    color: "from-cyan-500/15 to-cyan-500/0 text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "AI Chatbot",
    description: "Ask anything about workplace productivity and get instant guidance.",
    icon: Bot,
    url: "/chatbot" as const,
    color: "from-violet-500/15 to-violet-500/0 text-violet-600 dark:text-violet-400",
  },
  {
    title: "Task Planner",
    description: "Generate optimized schedules from your task list. (Coming soon)",
    icon: CalendarCheck,
    url: "/tasks" as const,
    color: "from-amber-500/15 to-amber-500/0 text-amber-600 dark:text-amber-400",
  },
  {
    title: "Research Assistant",
    description: "Get summaries, insights, and recommendations on any topic. (Coming soon)",
    icon: Search,
    url: "/research" as const,
    color: "from-emerald-500/15 to-emerald-500/0 text-emerald-600 dark:text-emerald-400",
  },
];

function Dashboard() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    const refresh = () => setHistory(getHistory());
    refresh();
    window.addEventListener("awpa:history-changed", refresh);
    return () => window.removeEventListener("awpa:history-changed", refresh);
  }, []);

  const stats = [
    { label: "Outputs created", value: history.length, icon: Sparkles },
    {
      label: "Emails generated",
      value: history.filter((h) => h.tool === "email").length,
      icon: Mail,
    },
    {
      label: "Meetings summarized",
      value: history.filter((h) => h.tool === "meeting").length,
      icon: NotebookPen,
    },
    {
      label: "Chat sessions",
      value: history.filter((h) => h.tool === "chat").length,
      icon: Bot,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-6 sm:p-8 shadow-[var(--shadow-card)]">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="secondary" className="mb-3 gap-1.5">
            <Zap className="h-3 w-3" /> Powered by AI
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Welcome to your AI workplace.
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Automate routine work — write emails, summarize meetings, plan tasks, and get answers —
            all from one modern dashboard.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/email"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-elegant)] transition hover:bg-primary/90"
            >
              Draft an email <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent/30"
            >
              Open chatbot
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
      </section>

      {/* Stats */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <s.icon className="h-3.5 w-3.5" /> {s.label}
            </div>
            <div className="mt-2 text-2xl font-semibold text-foreground">{s.value}</div>
          </Card>
        ))}
      </section>

      {/* Tools */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">AI tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.url} to={f.url} className="group">
              <Card className="h-full overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
                <div
                  className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${f.color}`}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground">{f.title}</h3>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
          Recent activity
        </h2>
        <Card className="divide-y divide-border p-0">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
              <Clock className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No activity yet</p>
              <p className="text-xs text-muted-foreground">
                Outputs you create will appear here.
              </p>
            </div>
          ) : (
            history.slice(0, 6).map((h) => (
              <div key={h.id} className="flex items-start gap-3 px-4 py-3">
                <Badge variant="outline" className="capitalize">
                  {h.tool}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{h.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{h.preview}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(h.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </Card>
      </section>
    </div>
  );
}
