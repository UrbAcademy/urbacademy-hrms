import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  subtitle?: string;
}

const variantStyles = {
  default: "border-border",
  primary: "border-primary/20 bg-primary/5",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  destructive: "border-destructive/20 bg-destructive/5",
};

const iconStyles = {
  default: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export default function StatCard({ title, value, icon, variant = "default", subtitle }: StatCardProps) {
  return (
    <div className={cn("stat-card-hover rounded-xl border bg-card p-4", variantStyles[variant])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-card-foreground">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5 bg-accent/50", iconStyles[variant])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
