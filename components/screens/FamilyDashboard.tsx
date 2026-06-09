"use client";

import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { Avatar } from "@/components/design-system/Avatar";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { AmbientGlow } from "@/components/design-system/AmbientGlow";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Users, ChevronRight, Activity } from "lucide-react";

export default function FamilyDashboard() {
  const { familyMembers, familyName, setSelectedMember, openModal } = useFamilyStore();

  const monitored = familyMembers.filter((m) => m.status === "monitored").length;
  const healthy = familyMembers.filter((m) => m.status === "healthy").length;
  const critical = familyMembers.filter((m) => m.status === "critical").length;

  return (
    <ScreenContainer title={familyName || "Family Health OS"}>
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-white/70" />
          <span className="text-sm font-medium text-white/90">{familyName || "My Family"}</span>
        </div>
        <span className="text-xs text-white/80">{familyMembers.length} members</span>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: Activity, label: "Monitored", value: String(monitored), color: "text-amber-warn" },
            { icon: Users, label: "Healthy", value: String(healthy), color: "text-green-hospital" },
            { icon: Activity, label: "Critical", value: String(critical), color: "text-red-emergency" },
          ].map((stat, i) => (
            <GlassPanel key={i} className="p-3 text-center">
              <stat.icon size={16} className={`mx-auto mb-1 ${stat.color}`} />
              <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/90">{stat.label}</p>
            </GlassPanel>
          ))}
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {familyMembers.map((member, i) => (
            <motion.button
              key={member.id}
              className="w-full text-left"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                setSelectedMember(member.id);
                openModal("memberDetail");
              }}
            >
              <GlassPanel
                variant="strong"
                className="p-4 flex items-center gap-3 hover:bg-white/[0.08] transition-colors"
              >
                <div className="relative">
                  <Avatar
                    initials={member.initials}
                    gradient={member.avatarGradient}
                    size="lg"
                  />
                  {member.status === "critical" && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-emergency border-2 border-navy-deep animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-white text-sm truncate">
                      {member.name}
                    </p>
                    <StatusBadge status={member.status} size="sm" />
                  </div>
                  <p className="text-xs text-white/90">
                    {member.relation} · {member.age} yrs · {member.activeRx} active Rx
                  </p>
                </div>

                <ChevronRight size={16} className="text-white/50 shrink-0" />
              </GlassPanel>
            </motion.button>
          ))}
        </div>
      </div>

      <AmbientGlow
        color="rgba(74, 126, 255, 0.12)"
        size={300}
        blur={100}
        top="10%"
        left="-20%"
      />
      <AmbientGlow
        color="rgba(74, 126, 255, 0.08)"
        size={250}
        blur={80}
        bottom="20%"
        right="-10%"
      />
    </ScreenContainer>
  );
}
