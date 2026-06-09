"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import { BookOpen, Plus, Tag, X, PenLine } from "lucide-react";

const moods = {
  great: { emoji: "😊", label: "Great", color: "bg-medical-green/15 text-medical-green", dot: "bg-medical-green" },
  good: { emoji: "🙂", label: "Good", color: "bg-medical-blue/15 text-medical-blue", dot: "bg-medical-blue" },
  okay: { emoji: "😐", label: "Okay", color: "bg-white/10 text-white/70", dot: "bg-white/50" },
  unwell: { emoji: "😷", label: "Unwell", color: "bg-medical-amber/15 text-medical-amber", dot: "bg-medical-amber" },
  bad: { emoji: "🤒", label: "Bad", color: "bg-medical-red/15 text-medical-red", dot: "bg-medical-red" },
};

export default function SymptomJournal() {
  const { journalEntries, addJournalEntry, removeJournalEntry } = useFamilyStore();
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<keyof typeof moods>("okay");

  const handleAdd = () => {
    if (!newEntry.trim()) return;
    addJournalEntry({
      id: String(Date.now()),
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      text: newEntry.trim(),
      tags: ["New Entry"],
      mood: selectedMood,
    });
    setNewEntry("");
  };

  return (
    <ScreenContainer title="Symptom Journal">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-white/70" />
          <span className="text-sm font-medium text-white">{journalEntries.length} entries</span>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* New Entry */}
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            {Object.entries(moods).map(([key, mood]) => (
              <button
                key={key}
                onClick={() => setSelectedMood(key as keyof typeof moods)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
                  selectedMood === key
                    ? mood.color
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
                aria-label={`Select mood: ${mood.label}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${mood.dot}`} />
                {mood.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="How are you feeling today?"
              className="w-full glass rounded-2xl p-3 pr-10 text-sm text-white placeholder:text-white/50 outline-none resize-none h-24 focus:ring-2 focus:ring-medical-blue/30 transition-shadow"
            />
            <button
              onClick={handleAdd}
              disabled={!newEntry.trim()}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-medical-blue flex items-center justify-center hover:bg-medical-blue/80 transition-colors disabled:bg-white/10 disabled:text-white/30 focus:outline-none focus:ring-2 focus:ring-medical-blue/40"
              aria-label="Add journal entry"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {journalEntries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                <PenLine size={24} className="text-white/30" />
              </div>
              <p className="text-sm font-medium text-white/70 mb-1">No entries yet</p>
              <p className="text-xs text-white/50 max-w-[220px]">
                Start logging symptoms and moods to track patterns over time.
              </p>
            </motion.div>
          ) : (
            journalEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative group"
              >
                <button
                  onClick={() => removeJournalEntry(entry.id)}
                  className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-medical-red/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-medical-red/40"
                  aria-label="Remove entry"
                >
                  <X size={12} className="text-medical-red" />
                </button>
                <GlassPanel className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-white/50">
                        {entry.date}
                      </span>
                      <span className="text-[10px] text-white/30">{entry.time}</span>
                    </div>
                    <span className="text-lg" aria-label={`Mood: ${moods[entry.mood as keyof typeof moods]?.label || entry.mood}`}>
                      {moods[entry.mood as keyof typeof moods]?.emoji}
                    </span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed mb-2">{entry.text}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50"
                      >
                        <Tag size={8} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </GlassPanel>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
