interface StatusBadgeProps {
  status: "healthy" | "monitored" | "critical" | "watch";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = {
    healthy: {
      bg: "bg-green-hospital/15",
      text: "text-green-hospital",
      dot: "bg-green-hospital",
      label: "OK",
    },
    monitored: {
      bg: "bg-amber-warn/15",
      text: "text-amber-warn",
      dot: "bg-amber-warn",
      label: "Watch",
    },
    critical: {
      bg: "bg-red-emergency/15",
      text: "text-red-emergency",
      dot: "bg-red-emergency",
      label: "Alert",
    },
    watch: {
      bg: "bg-blue-accent/15",
      text: "text-blue-accent",
      dot: "bg-blue-accent",
      label: "Watch",
    },
  };

  const c = config[status];
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${status === "critical" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}
