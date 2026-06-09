"use client";

import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { VaxSticker } from "@/components/design-system/VaxSticker";
import { Avatar } from "@/components/design-system/Avatar";
import { vaccinations, upcomingVaccination } from "@/data/familyData";
import { Shield, Calendar, MapPin } from "lucide-react";

export default function VaccinationTracker() {
  const complete = vaccinations.filter((v) => v.status === "complete").length;
  const current = vaccinations.filter((v) => v.status === "current").length;
  const due = vaccinations.filter((v) => v.status === "due").length;

  return (
    <ScreenContainer title="Vaccination Tracker">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-ivory/60" />
          <span className="text-sm font-medium text-ivory/80">Emma Mitchell</span>
        </div>
        <span className="text-xs text-ivory/70">Age 8</span>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Summary */}
        <GlassPanel className="p-4 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <Avatar
              initials="EM"
              gradient="linear-gradient(135deg, #4ecdc4, #44bd9e)"
              size="lg"
            />
            <div>
              <p className="text-sm font-semibold text-ivory">Emma Mitchell</p>
              <p className="text-xs text-ivory/80">8 years old · 7 vaccines tracked</p>
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
                <p className="text-[10px] text-ivory/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Upcoming */}
        {upcomingVaccination && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassPanel variant="strong" className="p-4 border border-amber-warn/20">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={16} className="text-amber-warn" />
                <span className="text-sm font-semibold text-ivory">Upcoming Appointment</span>
              </div>
              <p className="text-sm font-medium text-ivory mb-1">{upcomingVaccination.name}</p>
              <div className="flex items-center gap-4 text-xs text-ivory/80">
                <span>{upcomingVaccination.date}</span>
                <span>{upcomingVaccination.time}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-ivory/80">
                <MapPin size={12} />
                <span>
                  {upcomingVaccination.clinic} · {upcomingVaccination.doctor}
                </span>
              </div>
            </GlassPanel>
          </motion.div>
        )}

        {/* Vaccine Stickers */}
        <div className="space-y-3">
          {vaccinations.map((vax, i) => (
            <motion.div
              key={vax.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
            >
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
