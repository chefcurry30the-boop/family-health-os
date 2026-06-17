"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { Avatar } from "@/components/design-system/Avatar";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Stethoscope,
  CheckSquare,
  Square,
  Clock,
  FileText,
  Plus,
  X,
  ClipboardList,
} from "lucide-react";

type ChecklistItem = {
  id: string;
  text: string;
  checked: boolean;
};

type ChecklistMap = Record<string, { items: ChecklistItem[] }>;

function makeDefaultChecklist(memberId: string, name: string): { items: ChecklistItem[] } {
  return {
    items: [
      { id: `${memberId}-1`, text: `Prepare questions for ${name}'s visit`, checked: false },
      { id: `${memberId}-2`, text: "Bring current medication list", checked: false },
      { id: `${memberId}-3`, text: "Bring insurance card and ID", checked: false },
      { id: `${memberId}-4`, text: "Note any new symptoms since last visit", checked: false },
    ],
  };
}

export default function DoctorVisitPrep() {
  const { familyMembers } = useFamilyStore();
  const [lists, setLists] = useState<ChecklistMap>({});
  const [activeMemberId, setActiveMemberId] = useState<string>(familyMembers[0]?.id || "");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [newItemText, setNewItemText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const activeMember = familyMembers.find((m) => m.id === activeMemberId) || familyMembers[0];

  const currentList = useMemo(() => {
    if (!activeMember) return { items: [] };
    return lists[activeMember.id] || makeDefaultChecklist(activeMember.id, activeMember.name);
  }, [lists, activeMember]);

  const checkedCount = currentList.items.filter((i) => i.checked).length;
  const totalCount = currentList.items.length;
  const progressPct = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const updateList = (
    memberId: string,
    updater: (prev: { items: ChecklistItem[] }) => { items: ChecklistItem[] }
  ) => {
    setLists((prev) => ({
      ...prev,
      [memberId]: updater(prev[memberId] || makeDefaultChecklist(memberId, activeMember?.name || "")),
    }));
  };

  const toggleCheck = (itemId: string) => {
    if (!activeMember) return;
    updateList(activeMember.id, (prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
    }));
  };

  const addItem = () => {
    if (!activeMember || !newItemText.trim()) return;
    updateList(activeMember.id, (prev) => ({
      ...prev,
      items: [...prev.items, { id: `${activeMember.id}-${Date.now()}`, text: newItemText.trim(), checked: false }],
    }));
    setNewItemText("");
    setShowForm(false);
  };

  const removeItem = (itemId: string) => {
    if (!activeMember) return;
    updateList(activeMember.id, (prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.id !== itemId),
    }));
  };

  if (!activeMember) {
    return (
      <ScreenContainer title="Doctor Visit Prep">
        <StickyHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope size={18} className="text-white/70" />
            <span className="text-sm font-medium text-white">Visit Checklists</span>
          </div>
        </StickyHeader>
        <div className="px-5 pb-6">
          <GlassPanel className="p-6 text-center">
            <ClipboardList size={32} className="text-white/30 mx-auto mb-3" />
            <p className="text-sm text-white font-medium mb-1">No family members yet</p>
            <p className="text-xs text-white/50">Complete onboarding to create visit checklists.</p>
          </GlassPanel>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Doctor Visit Prep">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-white/70" />
          <span className="text-sm font-medium text-white">Visit Checklists</span>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Member Selector */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {familyMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 transition-all ${
                activeMember?.id === m.id ? "glass-strong" : "bg-white/5 hover:bg-white/10"
              }`}
              aria-label={`Select ${m.name}`}
            >
              <Avatar initials={m.initials} gradient={m.avatarGradient} size="sm" />
              <span className="text-xs font-medium text-white">{m.name}</span>
            </button>
          ))}
        </div>

        {/* Progress */}
        <GlassPanel className="p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/50" />
              <span className="text-xs text-white">{activeMember.name} — Next Visit</span>
            </div>
            <span className="text-xs text-white/70">
              {checkedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-medical-blue"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </GlassPanel>

        {/* Checklist */}
        <GlassPanel variant="strong" className="p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={14} className="text-white/50" />
            <span className="text-xs font-medium text-white">Visit Prep Checklist</span>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {currentList.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="flex items-start gap-3 group"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8, height: 0, marginBottom: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <button
                    className="mt-0.5 shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                    onClick={() => toggleCheck(item.id)}
                    aria-label={item.checked ? "Uncheck item" : "Check item"}
                  >
                    {item.checked ? (
                      <CheckSquare size={18} className="text-medical-green" />
                    ) : (
                      <Square size={18} className="text-white/30" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleCheck(item.id)}
                    className={`flex-1 text-left text-sm leading-relaxed rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60 ${
                      item.checked ? "text-white/50 line-through" : "text-white"
                    }`}
                  >
                    {item.text}
                  </button>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-red/60 p-0.5"
                    aria-label="Remove item"
                  >
                    <X size={14} className="text-white/50 hover:text-medical-red" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add item form */}
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-1"
                >
                  <div className="flex items-center gap-2">
                    <input
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addItem();
                      }}
                      placeholder="New checklist item..."
                      className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                      autoFocus
                    />
                    <button
                      onClick={addItem}
                      className="px-3 py-2 rounded-xl bg-medical-blue text-white text-xs font-medium hover:bg-medical-blue/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                      aria-label="Add new item"
                    >
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1 text-xs text-white/50 hover:text-white/70 transition-colors pt-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
              aria-label={showForm ? "Cancel adding item" : "Add checklist item"}
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? "Cancel" : "Add item"}
            </button>
          </div>
        </GlassPanel>

        {/* Notes */}
        <GlassPanel className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-white/50" />
            <span className="text-xs font-medium text-white">Visit Notes</span>
          </div>
          <textarea
            value={notes[activeMember.id] || ""}
            onChange={(e) =>
              setNotes((prev) => ({
                ...prev,
                [activeMember.id]: e.target.value,
              }))
            }
            placeholder="Add notes about the upcoming visit..."
            className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none resize-none h-20 focus-visible:ring-2 focus-visible:ring-medical-blue/60"
          />
        </GlassPanel>
      </div>
    </ScreenContainer>
  );
}
