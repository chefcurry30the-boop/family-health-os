"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { TimelineEntry } from "@/components/design-system/TimelineEntry";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Clock, Plus, X, CalendarDays } from "lucide-react";

export default function HealthTimeline() {
  const { timelineEvents, addTimelineEvent, removeTimelineEvent } = useFamilyStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    memberName: "",
    tags: "",
    type: "visit" as "visit" | "lab" | "emergency" | "rx" | "vital",
  });

  const handleAdd = () => {
    if (!form.title.trim() || !form.memberName.trim()) return;
    addTimelineEvent({
      id: String(Date.now()),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      memberName: form.memberName.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      type: form.type,
    });
    setForm({
      title: "",
      description: "",
      memberName: "",
      tags: "",
      type: "visit",
    });
    setShowForm(false);
  };

  const formatMonth = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    } catch {
      return "";
    }
  };

  const formatDay = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.getDate().toString().padStart(2, "0");
    } catch {
      return "";
    }
  };

  const formatYear = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return "";
    }
  };

  return (
    <ScreenContainer title="AI Health Timeline">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full glass flex items-center justify-center">
            <Clock size={14} className="text-white/70" />
          </div>
          <span className="text-sm font-medium text-white font-body">
            Recent Events
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50 font-body">
            {timelineEvents.length} event{timelineEvents.length !== 1 ? "s" : ""}
          </span>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/20 focus:bg-white/20 transition-colors"
            aria-label={showForm ? "Close add event form" : "Add new event"}
          >
            {showForm ? (
              <X size={14} className="text-white" />
            ) : (
              <Plus size={14} className="text-white" />
            )}
          </button>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <GlassPanel className="p-4 space-y-3">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="Event title"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none font-body"
                />
                <input
                  value={form.memberName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, memberName: e.target.value }))
                  }
                  placeholder="Member name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none font-body"
                />
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Description"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none resize-none h-16 font-body"
                />
                <input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="Tags (comma separated)"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none font-body"
                />
                <div className="flex gap-2 flex-wrap">
                  {(
                    ["visit", "lab", "emergency", "rx", "vital"] as const
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors font-body ${
                        form.type === t
                          ? "bg-medical-blue/20 text-medical-blue"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                      aria-label={`Select type ${t}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2.5 rounded-xl bg-medical-blue text-white text-sm font-medium hover:bg-medical-blue/80 focus:bg-medical-blue/80 transition-colors font-body"
                  aria-label="Add event to timeline"
                >
                  Add Event
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {timelineEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
              <CalendarDays size={24} className="text-white/40" />
            </div>
            <h3 className="text-base font-semibold text-white font-display mb-1">
              No events yet
            </h3>
            <p className="text-sm text-white/50 font-body text-center max-w-[240px]">
              Track health events for your family members. Tap the + button to add your first event.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-0">
            {timelineEvents.map((event, i) => (
              <div key={event.id} className="relative group">
                <button
                  onClick={() => removeTimelineEvent(event.id)}
                  className="absolute right-0 top-2 z-10 w-6 h-6 rounded-full bg-medical-red/15 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                  aria-label={`Remove event ${event.title}`}
                >
                  <X size={12} className="text-medical-red" />
                </button>
                <TimelineEntry
                  date={event.date}
                  memberName={event.memberName}
                  title={event.title}
                  description={event.description}
                  tags={event.tags}
                  type={
                    event.type === "rx" || event.type === "vital"
                      ? "visit"
                      : event.type
                  }
                  index={i}
                  formatMonth={formatMonth}
                  formatDay={formatDay}
                  formatYear={formatYear}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
