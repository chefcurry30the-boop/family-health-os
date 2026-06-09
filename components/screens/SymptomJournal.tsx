"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { JournalPage } from "@/components/design-system/JournalPage";
import { journalEntries } from "@/data/familyData";
import { BookOpen, Plus, Tag } from "lucide-react";

const moods = {
  great: { emoji: "😊", label: "Great", color: "bg-green-hospital/20 text-green-hospital" },
  good: { emoji: "🙂", label: "Good", color: "bg-blue-accent/20 text-blue-accent" },
  okay: { emoji: "😐", label: "Okay", color: "bg-ivory/10 text-ivory/70" },
  unwell: { emoji: "😷", label: "Unwell", color: "bg-amber-warn/20 text-amber-warn" },
  bad: { emoji: "🤒", label: "Bad", color: "bg-red-emergency/20 text-red-emergency" },
};

export default function SymptomJournal() {
  const [entries, setEntries] = useState(journalEntries);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<keyof typeof moods>("okay");

  const handleAdd = () => {
    if (!newEntry.trim()) return;
    const entry = {
      id: String(entries.length + 1),
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
    };
    setEntries([entry, ...entries]);
    setNewEntry("");
  };

  return (
    <ScreenContainer title="Symptom Journal">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-ivory/60" />
          <span className="text-sm font-medium text-ivory/80">{entries.length} entries</span>
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
                    : "bg-ivory/5 text-ivory/60 hover:bg-ivory/10"
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
              className="w-full bg-paper rounded-xl p-3 pr-10 text-sm text-ivory placeholder:text-ivory/50 outline-none resize-none h-24"
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
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <JournalPage className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#C0392B]/60">
                      {entry.date}
                    </span>
                    <span className="text-[10px] text-ivory/60">{entry.time}</span>
                  </div>
                  <span className="text-lg">{moods[entry.mood as keyof typeof moods]?.emoji}</span>
                </div>
                <p className="text-sm text-ivory/80 leading-relaxed mb-2">{entry.text}</p>
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
