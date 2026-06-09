"use client";

import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { familyMembers } from "@/data/familyData";
import { Siren, Droplets, AlertTriangle, Pill, Phone } from "lucide-react";

export default function EmergencyMode() {
  const james = familyMembers.find((m) => m.id === "james");

  return (
    <ScreenContainer>
      <div className="px-5 pt-6 pb-6">
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
        <GlassPanel className="p-5 mb-4 border-2 border-red-emergency/30">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg"
              style={{ background: james?.avatarGradient }}
            >
              {james?.initials}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">
                {james?.name}
              </p>
              <p className="text-sm text-white/90">
                {james?.relation} · {james?.age} yrs · Blood Type: O+
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={12} className="text-red-light" />
                <span className="text-[10px] text-white/80 uppercase tracking-wider">
                  Allergies
                </span>
              </div>
              <p className="text-sm text-white/80">
                {james?.allergies.join(", ")}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Droplets size={12} className="text-red-light" />
                <span className="text-[10px] text-white/80 uppercase tracking-wider">
                  Conditions
                </span>
              </div>
              <p className="text-sm text-white/80">
                {james?.conditions.join(", ")}
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-3 col-span-2">
              <div className="flex items-center gap-1.5 mb-1">
                <Pill size={12} className="text-red-light" />
                <span className="text-[10px] text-white/80 uppercase tracking-wider">
                  Medications
                </span>
              </div>
              <p className="text-sm text-white/80">
                {james?.medications.join(", ")}
              </p>
            </div>
          </div>
        </GlassPanel>

        {/* Emergency Actions */}
        <div className="space-y-3">
          <button className="w-full py-4 rounded-2xl bg-red-emergency text-white font-bold text-lg tracking-wide hover:bg-red-light transition-colors shadow-lg shadow-red-900/50 flex items-center justify-center gap-2">
            <Phone size={20} />
            CALL 911
          </button>
          <button className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
            <Siren size={18} />
            Alert Family Members
          </button>
        </div>

        {/* Offline indicator */}
        <div className="mt-6 text-center">
          <p className="text-[10px] text-white/70">
            Emergency data cached offline · Available without internet
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
}
