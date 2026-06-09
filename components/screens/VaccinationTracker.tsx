"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { VaxSticker } from "@/components/design-system/VaxSticker";
import { Avatar } from "@/components/design-system/Avatar";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Shield, Calendar, MapPin, Plus, X, ChevronDown, Sticker } from "lucide-react";

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
                className="appearance-none bg-transparent text-sm font-medium text-white pr-5 outline-none cursor-pointer"
              >
                {familyMembers.map((m) => (
                  <option key={m.id} value={m.id} className="bg-navy-deep text-white">
                    {m.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
            </div>
          ) : (
            <span className="text-sm font-medium text-white">
              {selectedMember?.name || "Vaccinations"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedMember && (
            <span className="text-xs text-white/70">Age {selectedMember.age}</span>
          )}
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-white/15 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue/40"
            aria-label={showForm ? "Cancel add vaccination" : "Add vaccination"}
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
              <p className="text-xs text-white/70">
                {selectedMember ? `${selectedMember.age} years old · ` : ""}
                {memberVaccinations.length} vaccines tracked
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Complete", value: complete, color: "text-medical-green" },
              { label: "Current", value: current, color: "text-medical-blue" },
              { label: "Due Soon", value: due, color: "text-medical-amber" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Upcoming */}
        <AnimatePresence>
          {upcoming && (
            <motion.div
              className="mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <GlassPanel variant="strong" className="p-4 border border-medical-amber/20">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={16} className="text-medical-amber" />
                  <span className="text-sm font-semibold text-white">Upcoming Appointment</span>
                </div>
                <p className="text-sm font-medium text-white mb-1">{upcoming.name}</p>
                <div className="flex items-center gap-4 text-xs text-white/70">
                  <span>{upcoming.date}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-white/70">
                  <MapPin size={12} />
                  <span>
                    {upcoming.clinic} · {upcoming.doctor}
                  </span>
                </div>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

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
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                />
                <input
                  value={form.doses}
                  onChange={(e) => setForm((f) => ({ ...f, doses: e.target.value }))}
                  placeholder="Doses (e.g. 2 doses)"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                />
                <input
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  placeholder="Date"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                />
                <input
                  value={form.doctor}
                  onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))}
                  placeholder="Doctor"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                />
                <input
                  value={form.clinic}
                  onChange={(e) => setForm((f) => ({ ...f, clinic: e.target.value }))}
                  placeholder="Clinic"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
                />
                <div className="flex gap-2">
                  {(["complete", "current", "due", "pending"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue/40 ${
                        form.status === s ? "bg-medical-blue/20 text-medical-blue" : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}
                      aria-label={`Set status to ${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAdd}
                  className="w-full py-2 rounded-xl bg-medical-blue text-white text-sm font-medium hover:bg-medical-blue/80 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-blue/40"
                  aria-label="Add vaccination"
                >
                  Add Vaccination
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Vaccine Stickers */}
        <div className="space-y-3">
          {memberVaccinations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                <Sticker size={24} className="text-white/30" />
              </div>
              <p className="text-sm font-medium text-white/70 mb-1">No vaccinations yet</p>
              <p className="text-xs text-white/50 max-w-[200px]">
                Add vaccines to track your family&apos;s immunization history.
              </p>
            </motion.div>
          ) : (
            memberVaccinations.map((vax, i) => (
              <motion.div
                key={vax.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="relative group"
              >
                <button
                  onClick={() => removeVaccination(vax.id)}
                  className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-medical-red/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-medical-red/40"
                  aria-label={`Remove ${vax.name} vaccination`}
                >
                  <X size={12} className="text-medical-red" />
                </button>
                <VaxSticker
                  status={vax.status === "pending" ? "due" : vax.status}
                  name={vax.name}
                  doses={vax.doses}
                  date={vax.date}
                  doctor={vax.doctor}
                />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </ScreenContainer>
  );
}
