"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { PillContainer } from "@/components/design-system/PillContainer";
import { MedicationTimeBadge } from "@/components/design-system/MedicationTimeBadge";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Check, Clock, AlertCircle, Plus, X } from "lucide-react";

export default function MedicationCenter() {
  const { medications, toggleMedicationTaken, addMedication, removeMedication, familyMembers } = useFamilyStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    memberId: "",
    timeOfDay: "morning" as "morning" | "afternoon" | "evening" | "morning-evening",
    shape: "round" as "half" | "capsule" | "round" | "tablet",
    color: "#e84040",
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
    setForm({ name: "", dosage: "", memberId: "", timeOfDay: "morning", shape: "round", color: "#e84040" });
    setShowForm(false);
  };

  return (
    <ScreenContainer title="Medication Center">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-white/70" />
          <span className="text-sm font-medium text-white/90">Today&apos;s Schedule</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80">
            {takenCount}/{totalCount} taken
          </span>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Add medication"
          >
            {showForm ? <X size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
          </button>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Progress */}
        <GlassPanel className="p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-white">Daily Progress</span>
            <span className="text-xs text-white/90">
              {totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-green-hospital"
              initial={{ width: 0 }}
              animate={{ width: `${totalCount > 0 ? (takenCount / totalCount) * 100 : 0}%` }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </GlassPanel>

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
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Medication name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <input
                  value={form.dosage}
                  onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
                  placeholder="Dosage"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <select
                  value={form.memberId}
                  onChange={(e) => setForm((f) => ({ ...f, memberId: e.target.value }))}
                  className="w-full bg-transparent text-sm text-white outline-none"
                >
                  <option value="" className="bg-navy-deep">Select member</option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id} className="bg-navy-deep">
                      {m.name}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  {(["morning", "afternoon", "evening", "morning-evening"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setForm((f) => ({ ...f, timeOfDay: t }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors ${
                        form.timeOfDay === t ? "bg-blue-accent/20 text-blue-accent" : "bg-white/5 text-white/60"
                      }`}
                    >
                      {t.replace("-", "+")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2 rounded-xl bg-blue-accent text-white text-sm font-medium hover:bg-blue-accent/80 transition-colors"
                >
                  Add Medication
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Medication List */}
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
                className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-red-emergency/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove medication"
              >
                <X size={12} className="text-red-emergency" />
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
                    <p className="text-sm font-semibold text-white truncate">
                      {med.name}
                    </p>
                    <MedicationTimeBadge timeOfDay={med.timeOfDay === "morning-evening" ? "morning" : med.timeOfDay} size="sm" />
                  </div>
                  <p className="text-xs text-white/90">
                    {med.memberName} · {med.dosage}
                  </p>
                  {med.taken && med.takenTime && (
                    <p className="text-[11px] text-green-hospital mt-0.5">
                      Taken at {med.takenTime}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleMedicationTaken(med.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    med.taken
                      ? "bg-green-hospital/20 text-green-hospital"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
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
            <p className="text-xs text-white/80">
              {totalCount - takenCount} medication{totalCount - takenCount !== 1 ? "s" : ""}{" "}
              pending for today
            </p>
          </div>
        )}
      </div>
    </ScreenContainer>
  );
}
