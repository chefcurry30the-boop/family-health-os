"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { VaxSticker } from "@/components/design-system/VaxSticker";
import { Avatar } from "@/components/design-system/Avatar";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Shield, Calendar, MapPin, Plus, X, ChevronDown } from "lucide-react";

export default function VaccinationTracker() {
  const { vaccinations, addVaccination, removeVaccination, familyMembers } = useFamilyStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("");
  const [form, setForm] = useState({
    name: "",
    doses: "",
    status: "complete" as "complete" | "pending" | "due" | "current",
    date: "",
    doctor: "",
    clinic: "",
  });

  const selectedMember = familyMembers.find((m) => m.id === selectedMemberId) || familyMembers[0];

  const memberVaccinations = selectedMember
    ? vaccinations.filter((v) => v.memberId === selectedMember.id)
    : vaccinations;

  const complete = memberVaccinations.filter((v) => v.status === "complete").length;
  const current = memberVaccinations.filter((v) => v.status === "current").length;
  const due = memberVaccinations.filter((v) => v.status === "due").length;
  const upcoming = memberVaccinations.find((v) => v.status === "due");

  const handleAdd = () => {
    if (!form.name.trim() || !selectedMember) return;
    addVaccination({
      id: String(Date.now()),
      memberId: selectedMember.id,
      name: form.name.trim(),
      doses: form.doses.trim(),
      status: form.status,
      date: form.date.trim() || undefined,
      doctor: form.doctor.trim() || undefined,
      clinic: form.clinic.trim() || undefined,
    });
    setForm({ name: "", doses: "", status: "complete", date: "", doctor: "", clinic: "" });
    setShowForm(false);
  };

  return (
    <ScreenContainer title="Vaccination Tracker">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-white/70" />
          {familyMembers.length > 1 ? (
            <div className="relative">
              <select
                value={selectedMember?.id || ""}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="appearance-none bg-transparent text-sm font-medium text-white/90 pr-4 outline-none cursor-pointer"
              >
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id} className="bg-navy-deep text-white">
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
            </div>
          ) : (
            <span className="text-sm font-medium text-white/90">
              {selectedMember?.name || "Vaccinations"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedMember && (
            <span className="text-xs text-white/80">Age {selectedMember.age}</span>
          )}
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Add vaccination"
          >
            {showForm ? <X size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
          </button>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Summary */}
        <GlassPanel className="p-4 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              initials={selectedMember?.initials || "?"}
              gradient={selectedMember?.avatarGradient || "linear-gradient(135deg, #4ecdc4, #44bd9e)"}
              size="lg"
            />
            <div>
              <p className="text-sm font-semibold text-white">{selectedMember?.name || "Select a member"}</p>
              <p className="text-xs text-white/90">
                {selectedMember ? `${selectedMember.age} years old · ` : ""}
                {memberVaccinations.length} vaccines tracked
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Complete", value: complete, color: "text-green-hospital" },
              { label: "Current", value: current, color: "text-blue-accent" },
              { label: "Due Soon", value: due, color: "text-amber-warn" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-white/90">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Upcoming */}
        {upcoming && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassPanel variant="strong" className="p-4 border border-amber-warn/20">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-amber-warn" />
                <span className="text-sm font-semibold text-white">Upcoming Appointment</span>
              </div>
              <p className="text-sm font-medium text-white mb-1">{upcoming.name}</p>
              <div className="flex items-center gap-4 text-xs text-white/90">
                <span>{upcoming.date}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-white/90">
                <MapPin size={12} />
                <span>
                  {upcoming.clinic} · {upcoming.doctor}
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        )}

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
                  placeholder="Vaccine name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <input
                  value={form.doses}
                  onChange={(e) => setForm((f) => ({ ...f, doses: e.target.value }))}
                  placeholder="Doses (e.g. 2 doses)"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <input
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  placeholder="Date"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <input
                  value={form.doctor}
                  onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
                  placeholder="Doctor"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <input
                  value={form.clinic}
                  onChange={(e) => setForm((f) => ({ ...f, clinic: e.target.value }))}
                  placeholder="Clinic"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <div className="flex gap-2">
                  {(["complete", "current", "due", "pending"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors ${
                        form.status === s ? "bg-blue-accent/20 text-blue-accent" : "bg-white/5 text-white/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2 rounded-xl bg-blue-accent text-white text-sm font-medium hover:bg-blue-accent/80 transition-colors"
                >
                  Add Vaccination
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vaccine Stickers */}
        <div className="space-y-3">
          {memberVaccinations.map((vax, i) => (
            <motion.div
              key={vax.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="relative group"
            >
              <button
                onClick={() => removeVaccination(vax.id)}
                className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-red-emergency/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove vaccination"
              >
                <X size={12} className="text-red-emergency" />
              </button>
              <VaxSticker
                status={vax.status === "pending" ? "due" : vax.status}
                name={vax.name}
                doses={vax.doses}
                date={vax.date}
                doctor={vax.doctor}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
