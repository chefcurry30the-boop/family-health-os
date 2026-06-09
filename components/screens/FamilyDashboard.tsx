"use client";

import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { Avatar } from "@/components/design-system/Avatar";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { AmbientGlow } from "@/components/design-system/AmbientGlow";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Users,
  ChevronRight,
  Activity,
  Pill,
  Calendar,
  Shield,
  TrendingUp,
} from "lucide-react";

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function FamilyDashboard() {
  const {
    familyMembers,
    familyName,
    currentUserId,
    setSelectedMember,
    openModal,
    medications,
    vaccinations,
    timelineEvents,
    expenses,
  } = useFamilyStore();

  const currentUser = familyMembers.find((m) => m.id === currentUserId);
  const isAdmin = currentUser?.role === "admin";

  const monitored = familyMembers.filter((m) => m.status === "monitored").length;
  const healthy = familyMembers.filter((m) => m.status === "healthy").length;
  const critical = familyMembers.filter((m) => m.status === "critical").length;

  const activeMeds = medications.filter((m) => !m.taken).length;
  const dueVaccines = vaccinations.filter((v) => v.status === "due").length;
  const upcomingEvents = timelineEvents.filter((e) => e.type === "visit").slice(0, 2);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const hasData = familyMembers.length > 0;
  const displayMembers = isAdmin ? familyMembers : familyMembers.filter((m) => m.id === currentUserId);

  return (
    <ScreenContainer title={hasData ? familyName : "Nova Health"} subtitle={hasData ? `${familyMembers.length} family members tracked` : "Your family's health hub"}>
      <div className="px-5 pb-6">
        {/* Quick Stats Row */}
        {hasData && isAdmin && (
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              {
                icon: Users,
                value: String(familyMembers.length),
                label: "Members",
                color: "text-medical-blue",
                bg: "bg-medical-blue/10",
              },
              {
                icon: Pill,
                value: String(activeMeds),
                label: "Meds Due",
                color: "text-medical-amber",
                bg: "bg-medical-amber/10",
              },
              {
                icon: Shield,
                value: String(dueVaccines),
                label: "Vaccines",
                color: "text-medical-purple",
                bg: "bg-medical-purple/10",
              },
              {
                icon: TrendingUp,
                value: formatINR(totalExpenses),
                label: "Expenses",
                color: "text-medical-teal",
                bg: "bg-medical-teal/10",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassPanel className="p-3 text-center">
                  <div className={`w-7 h-7 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-1.5`}>
                    <stat.icon size={14} className={stat.color} />
                  </div>
                  <p className={`text-sm font-bold ${stat.color} leading-tight`}>{stat.value}</p>
                  <p className="text-[10px] text-white/50 mt-0.5">{stat.label}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </div>
        )}

        {/* Health Overview */}
        {hasData && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mb-6"
          >
            <GlassPanel variant="strong" className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-medical-blue" />
                  <span className="text-sm font-semibold text-white">Family Health Overview</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2.5 rounded-xl bg-medical-green/8">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-medical-green shadow-[0_0_6px_rgba(48,209,88,0.4)]" />
                    <span className="text-lg font-bold text-medical-green">{healthy}</span>
                  </div>
                  <span className="text-[10px] text-white/60">Healthy</span>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-medical-amber/8">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-medical-amber shadow-[0_0_6px_rgba(255,159,10,0.4)]" />
                    <span className="text-lg font-bold text-medical-amber">{monitored}</span>
                  </div>
                  <span className="text-[10px] text-white/60">Attention</span>
                </div>
                <div className="text-center p-2.5 rounded-xl bg-medical-red/8">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-medical-red shadow-[0_0_6px_rgba(255,69,58,0.4)] animate-pulse" />
                    <span className="text-lg font-bold text-medical-red">{critical}</span>
                  </div>
                  <span className="text-[10px] text-white/60">Critical</span>
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* Upcoming Events */}
        {hasData && isAdmin && upcomingEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="mb-6"
          >
            <h3 className="text-sm font-semibold text-white/90 mb-2.5 px-0.5">Upcoming</h3>
            <div className="space-y-2">
              {upcomingEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  <GlassPanel className="p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-medical-blue/15 flex items-center justify-center shrink-0">
                      <Calendar size={16} className="text-medical-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{event.title}</p>
                      <p className="text-xs text-white/50">
                        {event.date} · {event.memberName}
                      </p>
                    </div>
                  </GlassPanel>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Members List */}
        <div className="space-y-3">
          {hasData && (
            <h3 className="text-sm font-semibold text-white/90 mb-2.5 px-0.5">
              {isAdmin ? "Family Members" : "My Profile"}
            </h3>
          )}
          {displayMembers.map((member, i) => (
            <motion.button
              key={member.id}
              className="w-full text-left"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => {
                setSelectedMember(member.id);
                openModal("memberDetail");
              }}
            >
              <GlassPanel
                variant="strong"
                className="p-4 flex items-center gap-3.5 hover:bg-white/[0.08] transition-colors duration-200"
              >
                <div className="relative shrink-0">
                  <Avatar
                    initials={member.initials}
                    gradient={member.avatarGradient}
                    size="lg"
                  />
                  {member.status === "critical" && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-medical-red border-[2.5px] border-navy-deep animate-pulse" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white text-[15px] truncate">
                      {member.name}
                    </p>
                    <StatusBadge status={member.status} size="sm" />
                  </div>
                  <p className="text-[13px] text-white/60 leading-snug">
                    {member.relation} · {member.age} years old
                  </p>
                  {member.conditions.length > 0 && (
                    <p className="text-[11px] text-white/40 mt-0.5 truncate">
                      {member.conditions.join(", ")}
                    </p>
                  )}
                </div>

                <ChevronRight size={18} className="text-white/30 shrink-0" />
              </GlassPanel>
            </motion.button>
          ))}

          {!hasData && (
            <GlassPanel className="p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-medical-blue/10 flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-medical-blue/60" />
              </div>
              <p className="text-base font-semibold text-white mb-1">No Family Added Yet</p>
              <p className="text-sm text-white/50 mb-4">
                Complete onboarding to set up your family health profiles.
              </p>
            </GlassPanel>
          )}
        </div>
      </div>

      <AmbientGlow
        color="rgba(10,132,255,0.08)"
        size={300}
        blur={100}
        top="5%"
        left="-20%"
      />
      <AmbientGlow
        color="rgba(10,132,255,0.05)"
        size={250}
        blur={80}
        bottom="15%"
        right="-10%"
      />
    </ScreenContainer>
  );
}
