"use client";

import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { PillContainer } from "@/components/design-system/PillContainer";
import { MedicationTimeBadge } from "@/components/design-system/MedicationTimeBadge";
import { medications } from "@/data/familyData";
import { Check, Clock, AlertCircle } from "lucide-react";

export default function MedicationCenter() {
  const todayMeds = medications;
  const takenCount = todayMeds.filter((m) => m.taken).length;
  const totalCount = todayMeds.length;

  return (
    <ScreenContainer title="Medication Center">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-ivory/60" />
          <span className="text-sm font-medium text-ivory/80">Today&apos;s Schedule</span>
        </div>
        <span className="text-xs text-ivory/70">
          {takenCount}/{totalCount} taken
        </span>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Progress */}
        <GlassPanel className="p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-ivory">Daily Progress</span>
            <span className="text-xs text-ivory/80">
              {Math.round((takenCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-ivory/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-green-hospital"
              initial={{ width: 0 }}
              animate={{ width: `${(takenCount / totalCount) * 100}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </GlassPanel>

        {/* Medication List */}
        <div className="space-y-3">
          {todayMeds.map((med, i) => (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <GlassPanel
                variant="strong"
                className={`p-4 flex items-center gap-3 ${
                  med.taken ? "opacity-60" : ""
                }`}
              >
                <PillContainer
                  shape={med.shape}
                  color={med.color}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-ivory truncate">
                      {med.name}
                    </p>
                    <MedicationTimeBadge timeOfDay={med.timeOfDay === "morning-evening" ? "morning" : med.timeOfDay} size="sm" />
                  </div>
                  <p className="text-xs text-ivory/80">
                    {med.memberName} · {med.dosage}
                  </p>
                  {med.taken && med.takenTime && (
                    <p className="text-[11px] text-green-hospital mt-0.5">
                      Taken at {med.takenTime}
                    </p>
                  )}
                </div>
                <button
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    med.taken
                      ? "bg-green-hospital/20 text-green-hospital"
                      : "bg-ivory/5 text-ivory/60 hover:bg-ivory/10"
                  }`}
                  aria-label={med.taken ? "Taken" : "Mark as taken"}
                >
                  <Check size={16} strokeWidth={med.taken ? 3 : 1.5} />
                </button>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Missed alert */}
        {takenCount < totalCount && (
          <div className="mt-5 glass rounded-xl p-3 flex items-center gap-2.5">
            <AlertCircle size={16} className="text-amber-warn shrink-0" />
            <p className="text-xs text-ivory/70">
              {totalCount - takenCount} medication{totalCount - takenCount !== 1 ? "s" : ""}{" "}
              pending for today
            </p>
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
