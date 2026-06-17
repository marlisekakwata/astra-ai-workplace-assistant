import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Workplace AI" },
      { name: "description", content: "Quick research summaries, insights, and recommendations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="AI Research Assistant"
        description="Get summaries, key insights, recommendations, and risks on any workplace topic."
        icon={Search}
      />
      <Card className="p-10 text-center">
        <Badge variant="secondary" className="mb-3">Coming soon</Badge>
        <h2 className="text-lg font-semibold text-foreground">Research mode launching soon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Enter a topic and receive a structured briefing. This module is in the pipeline.
        </p>
      </Card>
    </div>
  );
}
