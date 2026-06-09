import { motion } from "framer-motion";
import { StatusBadge } from "./StatusBadge";

interface TimelineEntryProps {
  date: string;
  memberName: string;
  title: string;
  description: string;
  tags: string[];
  type: "visit" | "lab" | "emergency" | "note";
  index?: number;
}

export function TimelineEntry({
  date,
  memberName,
  title,
  description,
  tags,
  type,
  index = 0,
}: TimelineEntryProps) {
  const dotColor = {
    visit: "bg-blue-accent",
    lab: "bg-green-hospital",
    emergency: "bg-red-emergency",
    note: "bg-amber-warn",
  };

  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0 w-6">
        <div className={`w-3 h-3 rounded-full ${dotColor[type]} shadow-lg`} />
        <div className="w-px flex-1 bg-ivory/10 mt-1" />
      </div>

      {/* Card */}
      <div className="glass-strong rounded-2xl p-4 flex-1 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-ivory/80 font-mono">{date}</span>
          <span className="text-[11px] text-ivory/70">{memberName}</span>
        </div>
        <h3 className="text-sm font-semibold text-ivory mb-1">{title}</h3>
        <p className="text-xs text-ivory/80 leading-relaxed mb-2">{description}</p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <StatusBadge
              key={tag}
              status={
                tag === "Emergency"
                  ? "critical"
                  : tag === "Watch"
                  ? "watch"
                  : "healthy"
              }
              size="sm"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
