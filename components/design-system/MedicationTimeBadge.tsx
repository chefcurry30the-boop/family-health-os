import { Sun, Moon, Sunrise, Sunset } from "lucide-react";
import { cn } from "@/lib/utils";

interface MedicationTimeBadgeProps {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  size?: "sm" | "md";
}

export function MedicationTimeBadge({
  timeOfDay,
  size = "md",
}: MedicationTimeBadgeProps) {
  const config = {
    morning: {
      icon: Sunrise,
      label: "AM",
      color: "bg-amber-warn/15 text-amber-warn",
    },
    afternoon: {
      icon: Sun,
      label: "PM",
      color: "bg-blue-accent/15 text-blue-accent",
    },
    evening: {
      icon: Sunset,
      label: "Eve",
      color: "bg-purple-accent/15 text-purple-accent",
    },
    night: {
      icon: Moon,
      label: "Night",
      color: "bg-blue-deep/15 text-blue-accent",
    },
  };

  const c = config[timeOfDay];
  const Icon = c.icon;
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5 gap-1" : "text-xs px-2 py-1 gap-1.5";

  return (
    <span className={cn("inline-flex items-center rounded-full font-medium", c.color, sizeClasses)}>
      <Icon size={size === "sm" ? 10 : 12} />
      {c.label}
    </span>
  );
}
