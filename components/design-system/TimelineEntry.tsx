import { motion } from "framer-motion";

interface TimelineEntryProps {
  date: string;
  memberName: string;
  title: string;
  description: string;
  tags: string[];
  type: "visit" | "lab" | "emergency" | "note";
  index?: number;
  formatMonth?: (d: string) => string;
  formatDay?: (d: string) => string;
  formatYear?: (d: string) => string;
}

const typeConfig = {
  visit: {
    dot: "bg-medical-blue",
    glow: "rgba(10, 132, 255, 0.3)",
    ring: "border-medical-blue/30",
  },
  lab: {
    dot: "bg-medical-green",
    glow: "rgba(48, 209, 88, 0.3)",
    ring: "border-medical-green/30",
  },
  emergency: {
    dot: "bg-medical-red",
    glow: "rgba(255, 69, 58, 0.3)",
    ring: "border-medical-red/30",
  },
  note: {
    dot: "bg-medical-amber",
    glow: "rgba(255, 159, 10, 0.3)",
    ring: "border-medical-amber/30",
  },
};

const tagColorMap: Record<
  string,
  { bg: string; text: string }
> = {
  Emergency: { bg: "bg-medical-red/15", text: "text-medical-red" },
  Watch: { bg: "bg-medical-amber/15", text: "text-medical-amber" },
  Healthy: { bg: "bg-medical-green/15", text: "text-medical-green" },
  Critical: { bg: "bg-medical-red/15", text: "text-medical-red" },
  Routine: { bg: "bg-medical-blue/15", text: "text-medical-blue" },
  Lab: { bg: "bg-medical-teal/15", text: "text-medical-teal" },
  Prescription: { bg: "bg-medical-purple/15", text: "text-medical-purple" },
};

function defaultFormatMonth(d: string) {
  try {
    return new Date(d)
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
  } catch {
    return "";
  }
}

function defaultFormatDay(d: string) {
  try {
    return new Date(d).getDate().toString().padStart(2, "0");
  } catch {
    return "";
  }
}

function defaultFormatYear(d: string) {
  try {
    return new Date(d).getFullYear().toString();
  } catch {
    return "";
  }
}

export function TimelineEntry({
  date,
  memberName,
  title,
  description,
  tags,
  type,
  index = 0,
  formatMonth = defaultFormatMonth,
  formatDay = defaultFormatDay,
  formatYear = defaultFormatYear,
}: TimelineEntryProps) {
  const config = typeConfig[type];
  const month = formatMonth(date);
  const day = formatDay(date);
  const year = formatYear(date);

  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Date badge */}
      <div className="flex flex-col items-center shrink-0 w-12 pt-1">
        <div
          className={`w-10 h-10 rounded-xl glass-strong flex flex-col items-center justify-center border ${config.ring}`}
        >
          <span className="text-[9px] font-medium text-white/50 font-body leading-none">
            {month}
          </span>
          <span className="text-base font-semibold text-white font-display leading-none mt-0.5">
            {day}
          </span>
        </div>
        <div className="w-px flex-1 bg-white/10 mt-1" />
      </div>

      {/* Card */}
      <div className="glass-strong rounded-2xl p-4 flex-1 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-white/50 font-mono">
            {year}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${config.dot}`}
              style={{ boxShadow: `0 0 6px ${config.glow}` }}
            />
            <span className="text-[11px] font-medium text-white/70 font-body">
              {memberName}
            </span>
          </div>
        </div>
        <h3 className="text-sm font-semibold text-white mb-1 font-body">
          {title}
        </h3>
        <p className="text-xs text-white/50 leading-relaxed mb-2.5 font-body">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const style =
                tagColorMap[tag] || {
                  bg: "bg-white/5",
                  text: "text-white/50",
                };
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center rounded-full text-[10px] font-medium px-2 py-0.5 glass ${style.text} font-body`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
