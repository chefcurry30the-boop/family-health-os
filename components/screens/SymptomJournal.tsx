"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { JournalPage } from "@/components/design-system/JournalPage";
import { useFamilyStore } from "@/store/useFamilyStore";
import { BookOpen, Plus, Tag, X } from "lucide-react";

const moods = {
  great: { emoji: "😊", label: "Great", color: "bg-green-hospital/20 text-green-hospital" },
  good: { emoji: "🙂", label: "Good", color: "bg-blue-accent/20 text-blue-accent" },
  okay: { emoji: "😐", label: "Okay", color: "bg-white/10 text-white/70" },
  unwell: { emoji: "😷", label: "Unwell", color: "bg-amber-warn/20 text-amber-warn" },
  bad: { emoji: "🤒", label: "Bad", color: "bg-red-emergency/20 text-red-emergency" },
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
          <span className="text-sm font-medium text-white/90">{journalEntries.length} entries</span>
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
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedMood === key
                    ? mood.color
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <textarea
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="How are you feeling today?"
              className="w-full bg-paper rounded-xl p-3 pr-10 text-sm text-white placeholder:text-white/60 outline-none resize-none h-24"
            />
            <button
              onClick={handleAdd}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-blue-accent flex items-center justify-center hover:bg-blue-accent/80 transition-colors"
              aria-label="Add entry"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Entries */}
        <div className="space-y-4">
          {journalEntries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative group"
            >
              <button
                onClick={() => removeJournalEntry(entry.id)}
                className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-red-emergency/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove entry"
              >
                <X size={12} className="text-red-emergency" />
              </button>
              <JournalPage className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#C0392B]/60">
                      {entry.date}
                    </span>
                    <span className="text-[10px] text-white/70">{entry.time}</span>
                  </div>
                  <span className="text-lg">{moods[entry.mood as keyof typeof moods]?.emoji}</span>
                </div>
                <p className="text-sm text-white/90 leading-relaxed mb-2">{entry.text}</p>
                <div className="flex flex-wrap gap-1">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-accent/10 text-blue-accent"
                    >
                      <Tag size={8} />
                      {tag}
                    </span>
                  ))}
                </div>
              </JournalPage>
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
