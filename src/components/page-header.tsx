import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
