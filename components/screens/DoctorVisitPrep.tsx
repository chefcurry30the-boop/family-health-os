"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { PrescriptionPad } from "@/components/design-system/PrescriptionPad";
import { Avatar } from "@/components/design-system/Avatar";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Stethoscope, CheckSquare, Square, Clock, FileText, Plus, X } from "lucide-react";

type ChecklistMap = Record<string, { items: { id: string; text: string; checked: boolean }[] }>;

function makeDefaultChecklist(memberId: string, name: string): { items: { id: string; text: string; checked: boolean }[] } {
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

  const updateList = (memberId: string, updater: (prev: { items: { id: string; text: string; checked: boolean }[] }) => { items: { id: string; text: string; checked: boolean }[] }) => {
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
            <span className="text-sm font-medium text-white/90">Visit Checklists</span>
          </div>
        </StickyHeader>
        <div className="px-5 pb-6">
          <GlassPanel className="p-6 text-center">
            <p className="text-sm text-white/90 mb-2">No family members yet.</p>
            <p className="text-xs text-white/70">Complete onboarding to create visit checklists.</p>
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
          <span className="text-sm font-medium text-white/90">Visit Checklists</span>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Member Selector */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {familyMembers.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveMemberId(m.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 transition-colors ${
                activeMember?.id === m.id ? "glass-strong" : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <Avatar initials={m.initials} gradient={m.avatarGradient} size="sm" />
              <span className="text-xs font-medium text-white">{m.name}</span>
            </button>
          ))}
        </div>

        {/* Progress */}
        <GlassPanel className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-white/60" />
              <span className="text-xs text-white/90">{activeMember.name} — Next Visit</span>
            </div>
            <span className="text-xs text-white/90">
              {checkedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-blue-accent"
              animate={{ width: totalCount > 0 ? `${(checkedCount / totalCount) * 100}%` : "0%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </GlassPanel>

        {/* Checklist */}
        <PrescriptionPad header="Visit Prep Checklist">
          <div className="space-y-2">
            {currentList.items.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-start gap-2 group"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <button className="mt-0.5 shrink-0" onClick={() => toggleCheck(item.id)}>
                  {item.checked ? (
                    <CheckSquare size={16} className="text-green-hospital" />
                  ) : (
                    <Square size={16} className="text-[#C0392B]/40" />
                  )}
                </button>
                <button
                  onClick={() => toggleCheck(item.id)}
                  className={`flex-1 text-left text-sm leading-relaxed ${
                    item.checked ? "text-white/60 line-through" : "text-[#5D4E37]"
                  }`}
                >
                  {item.text}
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  aria-label="Remove item"
                >
                  <X size={14} className="text-white/60" />
                </button>
              </motion.div>
            ))}

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
                      className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                      autoFocus
                    />
                    <button
                      onClick={addItem}
                      className="px-2 py-1 rounded-lg bg-blue-accent text-white text-xs font-medium hover:bg-blue-accent/80 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowForm((s) => !s)}
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white/90 transition-colors pt-1"
            >
              {showForm ? <X size={14} /> : <Plus size={14} />}
              {showForm ? "Cancel" : "Add item"}
            </button>
          </div>
        </PrescriptionPad>

        {/* Notes */}
        <GlassPanel className="mt-4 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-white/60" />
            <span className="text-xs font-medium text-white/90">Visit Notes</span>
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
            className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none resize-none h-16"
          />
        </GlassPanel>
      </div>
    </ScreenContainer>
  );
}
