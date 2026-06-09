interface StatusBadgeProps {
  status: "healthy" | "monitored" | "critical" | "watch";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = {
    healthy: {
      bg: "bg-medical-green/15",
      text: "text-medical-green",
      dot: "bg-medical-green",
      glow: "shadow-[0_0_8px_rgba(48,209,88,0.3)]",
      label: "Healthy",
    },
    monitored: {
      bg: "bg-medical-amber/15",
      text: "text-medical-amber",
      dot: "bg-medical-amber",
      glow: "shadow-[0_0_8px_rgba(255,159,10,0.3)]",
      label: "Attention Needed",
    },
    critical: {
      bg: "bg-medical-red/15",
      text: "text-medical-red",
      dot: "bg-medical-red",
      glow: "shadow-[0_0_8px_rgba(255,69,58,0.3)]",
      label: "Critical",
    },
    watch: {
      bg: "bg-medical-blue/15",
      text: "text-medical-blue",
      dot: "bg-medical-blue",
      glow: "",
      label: "Attention Needed",
    },
  };

  const c = config[status];
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${c.bg} ${c.text} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${c.glow} ${status === "critical" ? "animate-pulse" : ""}`} />
      {c.label}
    </span>
  );
}
