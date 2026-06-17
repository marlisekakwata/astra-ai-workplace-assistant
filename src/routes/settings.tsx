import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { clearHistory } from "@/lib/history";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      { name: "description", content: "Theme and data settings for Workplace AI." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, toggle } = useTheme();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Settings"
        description="Adjust appearance and manage locally stored data."
        icon={SettingsIcon}
      />
      <div className="space-y-4">
        <Card className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Appearance</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Switch between light and dark mode.
            </p>
          </div>
          <Button variant="outline" onClick={toggle}>
            {theme === "dark" ? (
              <>
                <Sun className="h-4 w-4" /> Light mode
              </>
            ) : (
              <>
                <Moon className="h-4 w-4" /> Dark mode
              </>
            )}
          </Button>
        </Card>

        <Card className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">History</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your outputs are stored only in this browser. Clear them at any time.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              clearHistory();
              toast.success("History cleared");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear history
          </Button>
        </Card>
      </div>
    </div>
  );
}
