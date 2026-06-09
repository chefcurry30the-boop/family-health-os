"use client";

import { motion } from "framer-motion";
import { useFamilyStore } from "@/store/useFamilyStore";
import { familyMembers } from "@/data/familyData";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { Avatar } from "@/components/design-system/Avatar";
import { X, Activity, Pill, AlertTriangle, Droplets } from "lucide-react";

export function FolderDetailModal() {
  const { selectedMemberId, closeModal } = useFamilyStore();
  const member = familyMembers.find((m) => m.id === selectedMemberId);

  if (!member) return null;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <motion.div
        className="relative w-full max-h-[80%] overflow-y-auto"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-navy-deep rounded-t-[32px] p-6 pb-10 border-t border-ivory/10">
          {/* Handle */}
          <div className="w-10 h-1 rounded-full bg-ivory/20 mx-auto mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar
                initials={member.initials}
                gradient={member.avatarGradient}
                size="lg"
              />
              <div>
                <p className="text-lg font-semibold text-ivory">
                  {member.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-ivory/80">
                    {member.relation} · {member.age} yrs
                  </span>
                  <StatusBadge status={member.status} size="sm" />
                </div>
              </div>
            </div>
            <button
              onClick={closeModal}
              className="w-8 h-8 rounded-full bg-ivory/10 flex items-center justify-center hover:bg-ivory/20 transition-colors"
            >
              <X size={16} className="text-ivory/60" />
            </button>
          </div>

          {/* Vitals */}
          <GlassPanel className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Activity size={16} className="text-blue-accent" />
              <span className="text-sm font-semibold text-ivory">Vitals</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {member.vitals.map((vital) => (
                <div key={vital.label} className="bg-ivory/5 rounded-xl p-3">
                  <p className="text-[10px] text-ivory/70 uppercase tracking-wider mb-1">
                    {vital.label}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-ivory">
                      {vital.value}
                    </span>
                    <span className="text-xs text-ivory/80">{vital.unit}</span>
                  </div>
                  {vital.trend && (
                    <span
                      className="text-xs font-medium"
                      style={{ color: vital.trendColor }}
                    >
                      {vital.trend}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Conditions */}
          <GlassPanel className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} className="text-amber-warn" />
              <span className="text-sm font-semibold text-ivory">Conditions</span>
            </div>
            <div className="space-y-2">
              {member.conditions.map((condition) => (
                <div
                  key={condition}
                  className="text-sm text-ivory/80 py-2 border-b border-ivory/5 last:border-0"
                >
                  {condition}
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Allergies */}
          <GlassPanel className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={16} className="text-red-light" />
              <span className="text-sm font-semibold text-ivory">Allergies</span>
            </div>
            <div className="space-y-2">
              {member.allergies.map((allergy) => (
                <div
                  key={allergy}
                  className="text-sm text-ivory/80 py-2 border-b border-ivory/5 last:border-0"
                >
                  {allergy}
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Medications */}
          <GlassPanel className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Pill size={16} className="text-purple-accent" />
              <span className="text-sm font-semibold text-ivory">Medications</span>
            </div>
            <div className="space-y-2">
              {member.medications.map((med) => (
                <div
                  key={med}
                  className="text-sm text-ivory/80 py-2 border-b border-ivory/5 last:border-0"
                >
                  {med}
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </motion.div>
    </motion.div>
  );
}
