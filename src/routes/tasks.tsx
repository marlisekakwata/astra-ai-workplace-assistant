import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — Workplace AI" },
      { name: "description", content: "AI-generated work schedules and priorities." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="AI Task Planner"
        description="Generate optimized schedules and prioritize your day."
        icon={CalendarCheck}
      />
      <Card className="p-10 text-center">
        <Badge variant="secondary" className="mb-3">Coming soon</Badge>
        <h2 className="text-lg font-semibold text-foreground">Smart scheduling is on the way</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Paste a task list and available hours — we'll build a prioritized plan with breaks. This
          tool is queued for the next release.
        </p>
      </Card>
    </div>
  );
}
