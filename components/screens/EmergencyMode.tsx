"use client";

import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Siren,
  AlertTriangle,
  Pill,
  HeartPulse,
  User,
  Activity,
} from "lucide-react";

export default function EmergencyMode() {
  const { familyMembers } = useFamilyStore();
  const primary = familyMembers[0];

  return (
    <ScreenContainer className="emergency-bg">
      <div className="px-5 pt-6 pb-6">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-5 w-24 h-24 flex items-center justify-center">
            {/* Red glow layers */}
            <div className="absolute inset-0 rounded-full bg-medical-red/20 blur-xl anim-emergency-glow" />
            <div className="absolute inset-0 rounded-full bg-medical-red/10 blur-lg anim-emergency-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-medical-red/15 flex items-center justify-center border border-medical-red/30 anim-emergency-pulse">
              <Siren size={38} className="text-medical-red" />
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-white font-display mb-2"
            style={{
              textShadow: "0 0 24px rgba(255, 69, 58, 0.5)",
            }}
          >
            Emergency Mode
          </h1>
          <p className="text-sm text-white/70">
            Medical profile for first responders
          </p>
        </div>

        {/* Primary Profile */}
        {primary ? (
          <>
            <GlassPanel
              variant="strong"
              className="p-5 mb-4 border border-medical-red/25"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0"
                  style={{ background: primary.avatarGradient }}
                  aria-label={`${primary.name} avatar`}
                >
                  {primary.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-white truncate">
                    {primary.name}
                  </p>
                  <p className="text-sm text-white/70">
                    {primary.relation} · {primary.age} yrs
                  </p>
                </div>
                <div className="ml-auto shrink-0 flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
                  <HeartPulse size={14} className="text-medical-red" />
                  <span className="text-xs font-semibold text-white">
                    O+
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle size={12} className="text-medical-amber" />
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                      Allergies
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {primary.allergies.filter((a) => a && a !== "None known").join(", ") || "None known"}
                  </p>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Activity size={12} className="text-medical-blue" />
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                      Conditions
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {primary.conditions.filter((c) => c && c !== "None").join(", ") || "None known"}
                  </p>
                </div>
                <div className="glass rounded-xl p-3 col-span-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Pill size={12} className="text-medical-purple" />
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                      Medications
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {primary.medications.filter((m) => m && m !== "None listed").join(", ") || "None listed"}
                  </p>
                </div>
              </div>
            </GlassPanel>

            {/* Other family members */}
            {familyMembers.length > 1 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 px-1">
                  Other Family Members
                </p>
                <div className="space-y-2">
                  {familyMembers.slice(1).map((member) => (
                    <GlassPanel
                      key={member.id}
                      variant="default"
                      className="p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm shrink-0"
                          style={{ background: member.avatarGradient }}
                          aria-label={`${member.name} avatar`}
                        >
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-white/50">
                            {member.relation} · {member.age} yrs
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              member.status === "healthy"
                                ? "bg-medical-green"
                                : member.status === "monitored"
                                ? "bg-medical-amber"
                                : "bg-medical-red"
                            }`}
                            aria-label={`Status: ${member.status}`}
                          />
                          <span className="text-[10px] text-white/50 capitalize">
                            {member.status}
                          </span>
                        </div>
                      </div>
                    </GlassPanel>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <GlassPanel
            variant="strong"
            className="p-6 mb-4 border border-medical-red/25 text-center"
          >
            <div className="w-14 h-14 rounded-full glass flex items-center justify-center mx-auto mb-3">
              <User size={24} className="text-white/30" />
            </div>
            <p className="text-sm text-white/80 mb-1">
              No family profile configured
            </p>
            <p className="text-xs text-white/50">
              Complete onboarding to populate emergency data
            </p>
          </GlassPanel>
        )}

        {/* Offline indicator */}
        <div className="text-center">
          <p className="text-[10px] text-white/40">
            Emergency data cached offline · Available without internet
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
}
