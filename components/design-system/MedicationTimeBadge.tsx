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
      color: "bg-medical-amber/15 text-medical-amber",
    },
    afternoon: {
      icon: Sun,
      label: "PM",
      color: "bg-medical-blue/15 text-medical-blue",
    },
    evening: {
      icon: Sunset,
      label: "Eve",
      color: "bg-medical-purple/15 text-medical-purple",
    },
    night: {
      icon: Moon,
      label: "Night",
      color: "bg-medical-teal/15 text-medical-teal",
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
