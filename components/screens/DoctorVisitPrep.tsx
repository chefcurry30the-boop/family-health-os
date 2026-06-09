"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { PrescriptionPad } from "@/components/design-system/PrescriptionPad";
import { Avatar } from "@/components/design-system/Avatar";
import { familyMembers } from "@/data/familyData";
import { Stethoscope, CheckSquare, Square, Clock, FileText } from "lucide-react";

const prepLists: Record<
  string,
  { title: string; items: { id: string; text: string; checked: boolean }[] }
> = {
  james: {
    title: "James Mitchell — Dr. Patel (Dec 12)",
    items: [
      { id: "j1", text: "Bring home BP monitor readings (last 2 weeks)", checked: true },
      { id: "j2", text: "List current medications (Lisinopril 10mg)", checked: true },
      { id: "j3", text: "Note any side effects or concerns", checked: false },
      { id: "j4", text: "Questions about sodium intake guidelines", checked: false },
    ],
  },
  robert: {
    title: "Robert Mitchell — Cardiology (Jan 5)",
    items: [
      { id: "r1", text: "Bring discharge summary from Nov 28 ER visit", checked: true },
      { id: "r2", text: "Current medication list (3 prescriptions)", checked: true },
      { id: "r3", text: "Weight log since discharge", checked: false },
      { id: "r4", text: "Questions about CHF exacerbation triggers", checked: false },
      { id: "r5", text: "Discuss home health aide options", checked: false },
    ],
  },
};

export default function DoctorVisitPrep() {
  const [lists, setLists] = useState(prepLists);
  const [activeMember, setActiveMember] = useState("james");

  const toggleCheck = (memberId: string, itemId: string) => {
    setLists((prev) => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        items: prev[memberId].items.map((item) =>
          item.id === itemId ? { ...item, checked: !item.checked } : item
        ),
      },
    }));
  };

  const currentList = lists[activeMember];
  const checkedCount = currentList.items.filter((i) => i.checked).length;
  const totalCount = currentList.items.length;

  return (
    <ScreenContainer title="Doctor Visit Prep">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope size={18} className="text-ivory/60" />
          <span className="text-sm font-medium text-ivory/80">Visit Checklists</span>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Member Selector */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {["james", "robert"].map((id) => {
            const m = familyMembers.find((fm) => fm.id === id);
            if (!m) return null;
            return (
              <button
                key={id}
                onClick={() => setActiveMember(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl shrink-0 transition-colors ${
                  activeMember === id
                    ? "glass-strong"
                    : "bg-ivory/5 hover:bg-ivory/10"
                }`}
              >
                <Avatar initials={m.initials} gradient={m.avatarGradient} size="sm" />
                <span className="text-xs font-medium text-ivory">{m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Progress */}
        <GlassPanel className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-ivory/50" />
              <span className="text-xs text-ivory/80">{currentList.title}</span>
            </div>
            <span className="text-xs text-ivory/80">
              {checkedCount}/{totalCount}
            </span>
          </div>
          <div className="h-2 rounded-full bg-ivory/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-blue-accent"
              animate={{ width: `${(checkedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </GlassPanel>

        {/* Checklist */}
        <PrescriptionPad header="Visit Prep Checklist">
          <div className="space-y-2">
            {currentList.items.map((item, i) => (
              <motion.button
                key={item.id}
                className="w-full text-left flex items-start gap-2 py-1"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => toggleCheck(activeMember, item.id)}
              >
                <div className="mt-0.5 shrink-0">
                  {item.checked ? (
                    <CheckSquare size={16} className="text-green-hospital" />
                  ) : (
                    <Square size={16} className="text-[#C0392B]/40" />
                  )}
                </div>
                <span
                  className={`text-sm leading-relaxed ${
                    item.checked
                      ? "text-ivory/60 line-through"
                      : "text-[#5D4E37]"
                  }`}
                >
                  {item.text}
                </span>
              </motion.button>
            ))}
          </div>
        </PrescriptionPad>

        {/* Notes */}
        <GlassPanel className="mt-4 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-ivory/50" />
            <span className="text-xs font-medium text-ivory/80">Visit Notes</span>
          </div>
          <textarea
            placeholder="Add notes about the upcoming visit..."
            className="w-full bg-transparent text-sm text-ivory placeholder:text-ivory/50 outline-none resize-none h-16"
          />
        </GlassPanel>
      </div>
    </ScreenContainer>
  );
}
