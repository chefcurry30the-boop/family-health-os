"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { PillContainer } from "@/components/design-system/PillContainer";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Check,
  Clock,
  AlertCircle,
  Plus,
  X,
  Pill,
} from "lucide-react";

export default function MedicationCenter() {
  const {
    medications,
    toggleMedicationTaken,
    addMedication,
    removeMedication,
    familyMembers,
  } = useFamilyStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    memberId: "",
    timeOfDay: "morning" as "morning" | "afternoon" | "evening" | "morning-evening",
    shape: "round" as "half" | "capsule" | "round" | "tablet",
    color: "#e84040",
    cost: 0,
  });

  const takenCount = medications.filter((m) => m.taken).length;
  const totalCount = medications.length;

  const handleAdd = () => {
    if (!form.name.trim() || !form.memberId) return;
    const member = familyMembers.find((m) => m.id === form.memberId);
    addMedication({
      id: String(Date.now()),
      name: form.name.trim(),
      dosage: form.dosage.trim() || "As directed",
      memberId: form.memberId,
      memberName: member?.name.split(" ")[0] || "Unknown",
      schedule: form.timeOfDay,
      timeOfDay: form.timeOfDay,
      shape: form.shape,
      color: form.color,
      taken: false,
    });
    setForm({
      name: "",
      dosage: "",
      memberId: "",
      timeOfDay: "morning",
      shape: "round",
      color: "#e84040",
      cost: 0,
    });
    setShowForm(false);
  };

  const timeLabels: Record<string, string> = {
    morning: "AM",
    afternoon: "PM",
    evening: "Eve",
    "morning-evening": "AM + Eve",
  };

  const timeColors: Record<string, string> = {
    morning: "text-medical-amber",
    afternoon: "text-medical-blue",
    evening: "text-medical-purple",
    "morning-evening": "text-medical-teal",
  };

  const timeBgColors: Record<string, string> = {
    morning: "bg-medical-amber/15",
    afternoon: "bg-medical-blue/15",
    evening: "bg-medical-purple/15",
    "morning-evening": "bg-medical-teal/15",
  };

  return (
    <ScreenContainer title="Medication Center">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full glass flex items-center justify-center">
            <Clock size={14} className="text-white/70" />
          </div>
          <span className="text-sm font-medium text-white font-body">
            Today&apos;s Schedule
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50 font-body">
            {takenCount}/{totalCount} taken
          </span>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/20 focus:bg-white/20 transition-colors"
            aria-label={showForm ? "Close add medication form" : "Add medication"}
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
        {/* Progress */}
        {totalCount > 0 && (
          <GlassPanel className="p-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-white font-body">
                Daily Progress
              </span>
              <span className="text-xs text-white/70 font-body">
                {Math.round((takenCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-medical-green"
                initial={{ width: 0 }}
                animate={{
                  width: `${totalCount > 0 ? (takenCount / totalCount) * 100 : 0}%`,
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </GlassPanel>
        )}

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
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="Medication name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none font-body"
                />
                <input
                  value={form.dosage}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dosage: e.target.value }))
                  }
                  placeholder="Dosage"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none font-body"
                />
                <select
                  value={form.memberId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, memberId: e.target.value }))
                  }
                  className="w-full bg-transparent text-sm text-white outline-none font-body"
                >
                  <option value="" className="bg-navy-deep">
                    Select member
                  </option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id} className="bg-navy-deep">
                      {m.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2 flex-wrap">
                  {(
                    ["morning", "afternoon", "evening", "morning-evening"] as const
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, timeOfDay: t }))}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors font-body ${
                        form.timeOfDay === t
                          ? "bg-medical-blue/20 text-medical-blue"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                      aria-label={`Select time ${t}`}
                    >
                      {t.replace("-", " + ")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2.5 rounded-xl bg-medical-blue text-white text-sm font-medium hover:bg-medical-blue/80 focus:bg-medical-blue/80 transition-colors font-body"
                  aria-label="Add medication"
                >
                  Add Medication
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medication List */}
        {medications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
              <Pill size={24} className="text-white/40" />
            </div>
            <h3 className="text-base font-semibold text-white font-display mb-1">
              No medications
            </h3>
            <p className="text-sm text-white/50 font-body text-center max-w-[240px]">
              Track prescriptions and daily doses for your family. Tap the + button to add your first medication.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {medications.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
                className="relative group"
              >
                <button
                  onClick={() => removeMedication(med.id)}
                  className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-medical-red/15 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                  aria-label={`Remove ${med.name}`}
                >
                  <X size={12} className="text-medical-red" />
                </button>
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
                      <p className="text-sm font-semibold text-white truncate font-body">
                        {med.name}
                      </p>
                      <span
                        className={`inline-flex items-center rounded-full text-[10px] font-medium px-1.5 py-0.5 gap-1 ${timeBgColors[med.timeOfDay]} ${timeColors[med.timeOfDay]} font-body`}
                      >
                        {timeLabels[med.timeOfDay]}
                      </span>
                    </div>
                    <p className="text-xs text-white/70 font-body">
                      {med.memberName} · {med.dosage}
                    </p>
                    {med.taken && med.takenTime && (
                      <p className="text-[11px] text-medical-green mt-0.5 font-body">
                        Taken at {med.takenTime}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleMedicationTaken(med.id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                      med.taken
                        ? "bg-medical-green/20 text-medical-green"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70 focus:bg-white/10 focus:text-white/70"
                    }`}
                    aria-label={
                      med.taken
                        ? `${med.name} taken. Tap to unmark`
                        : `Mark ${med.name} as taken`
                    }
                  >
                    <Check size={16} strokeWidth={med.taken ? 3 : 1.5} />
                  </button>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}

        {/* Missed alert */}
        {totalCount > 0 && takenCount < totalCount && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 glass rounded-2xl p-3 flex items-center gap-2.5"
          >
            <AlertCircle
              size={16}
              className="text-medical-amber shrink-0"
            />
            <p className="text-xs text-white/70 font-body">
              {totalCount - takenCount} medication
              {totalCount - takenCount !== 1 ? "s" : ""} pending for today
            </p>
          </motion.div>
        )}
      </div>
    </ScreenContainer>
  );
}
