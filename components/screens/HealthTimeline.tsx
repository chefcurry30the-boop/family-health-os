"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { TimelineEntry } from "@/components/design-system/TimelineEntry";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Clock, Plus, X } from "lucide-react";

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
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      memberName: form.memberName.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      type: form.type,
    });
    setForm({ title: "", description: "", memberName: "", tags: "", type: "visit" });
    setShowForm(false);
  };

  return (
    <ScreenContainer title="AI Health Timeline">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-white/70" />
          <span className="text-sm font-medium text-white/90">Recent Events</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80">{timelineEvents.length} events</span>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Add event"
          >
            {showForm ? <X size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
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
              <GlassPanel className="p-3 space-y-2">
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Event title"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <input
                  value={form.memberName}
                  onChange={(e) => setForm((f) => ({ ...f, memberName: e.target.value }))}
                  placeholder="Member name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none resize-none h-16"
                />
                <input
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="Tags (comma separated)"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <div className="flex gap-2">
                  {(["visit", "lab", "emergency", "rx", "vital"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors ${
                        form.type === t ? "bg-blue-accent/20 text-blue-accent" : "bg-white/5 text-white/60"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2 rounded-xl bg-blue-accent text-white text-sm font-medium hover:bg-blue-accent/80 transition-colors"
                >
                  Add Event
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-0">
          {timelineEvents.map((event, i) => (
            <div key={event.id} className="relative group">
              <button
                onClick={() => removeTimelineEvent(event.id)}
                className="absolute right-0 top-2 z-10 w-6 h-6 rounded-full bg-red-emergency/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove event"
              >
                <X size={12} className="text-red-emergency" />
              </button>
              <TimelineEntry
                date={event.date}
                memberName={event.memberName}
                title={event.title}
                description={event.description}
                tags={event.tags}
                type={event.type === "rx" || event.type === "vital" ? "visit" : event.type}
                index={i}
              />
            </div>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
