"use client";

import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Siren, Droplets, AlertTriangle, Pill, ArrowLeft } from "lucide-react";

export default function EmergencyMode() {
  const { familyMembers, goBack } = useFamilyStore();
  const primary = familyMembers[0];

  return (
    <ScreenContainer>
      <div className="px-5 pt-6 pb-6">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-red-emergency/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Siren size={40} className="text-red-emergency" />
          </div>
          <h1
            className="text-3xl font-bold text-white font-display mb-2"
            style={{ textShadow: "0 0 20px rgba(231, 76, 60, 0.8)" }}
          >
            Emergency Mode
          </h1>
          <p className="text-sm text-white/90">
            Medical profile for first responders
          </p>
        </div>

        {/* Primary Profile */}
        {primary ? (
          <GlassPanel className="p-5 mb-4 border-2 border-red-emergency/30">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
                style={{ background: primary.avatarGradient }}
              >
                {primary.initials}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">
                  {primary.name}
                </p>
                <p className="text-sm text-white/90">
                  {primary.relation} · {primary.age} yrs · Blood Type: O+
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle size={12} className="text-red-light" />
                  <span className="text-[10px] text-white/90 uppercase tracking-wider">
                    Allergies
                  </span>
                </div>
                <p className="text-sm text-white/90">
                  {primary.allergies.join(", ") || "None known"}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Droplets size={12} className="text-red-light" />
                  <span className="text-[10px] text-white/90 uppercase tracking-wider">
                    Conditions
                  </span>
                </div>
                <p className="text-sm text-white/90">
                  {primary.conditions.join(", ") || "None known"}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 col-span-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <Pill size={12} className="text-red-light" />
                  <span className="text-[10px] text-white/90 uppercase tracking-wider">
                    Medications
                  </span>
                </div>
                <p className="text-sm text-white/90">
                  {primary.medications.join(", ") || "None listed"}
                </p>
              </div>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="p-5 mb-4 border-2 border-red-emergency/30 text-center">
            <p className="text-sm text-white/90 mb-2">
              No family profile configured.
            </p>
            <p className="text-xs text-white/70">
              Complete onboarding to populate emergency data.
            </p>
          </GlassPanel>
        )}

        {/* Offline indicator */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-white/80">
            Emergency data cached offline · Available without internet
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
}
