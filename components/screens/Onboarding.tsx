"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Heart, Shield, Pill, Siren, ChevronRight, Plus, X, Users } from "lucide-react";

const introSlides = [
  {
    icon: Heart,
    title: "Family Health OS",
    subtitle: "Your family's health, organized.",
    description:
      "Track vitals, medications, vaccinations, and appointments for your entire family in one beautiful, secure app.",
    color: "text-green-hospital",
    bg: "bg-green-hospital/10",
  },
  {
    icon: Shield,
    title: "AI Health Timeline",
    subtitle: "Never miss a beat.",
    description:
      "Get intelligent reminders for medications, upcoming vaccines, and doctor visits. Our AI copilot helps you stay ahead.",
    color: "text-blue-accent",
    bg: "bg-blue-accent/10",
  },
  {
    icon: Pill,
    title: "Medication Center",
    subtitle: "Stay on schedule.",
    description:
      "Track daily medications for every family member. Mark doses as taken and get alerts for missed medications.",
    color: "text-purple-accent",
    bg: "bg-purple-accent/10",
  },
  {
    icon: Siren,
    title: "Emergency Ready",
    subtitle: "Critical info, always accessible.",
    description:
      "Triple-tap anywhere to activate Emergency Mode. Blood type, allergies, conditions, and contacts — even offline.",
    color: "text-red-emergency",
    bg: "bg-red-emergency/10",
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [setupMode, setSetupMode] = useState(false);
  const [familyName, setFamilyNameLocal] = useState("My Family");
  const [members, setMembers] = useState([
    { id: "1", name: "", relation: "", age: "", status: "healthy" as "healthy" | "monitored" | "critical" },
  ]);
  const { setOnboardingComplete, setFamilyMembers, setFamilyName } = useFamilyStore();

  const isLastIntro = currentSlide === introSlides.length - 1;

  const next = () => {
    if (isLastIntro) {
      setSetupMode(true);
    } else {
      setCurrentSlide((s) => s + 1);
    }
  };

  const addMember = () => {
    setMembers((prev) => [
      ...prev,
      { id: String(Date.now()), name: "", relation: "", age: "", status: "healthy" },
    ]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, field: string, value: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const finish = () => {
    const validMembers = members.filter((m) => m.name.trim() && m.relation.trim());
    const newFamilyMembers = validMembers.map((m) => {
      const initials = m.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      return {
        id: m.id,
        name: m.name.trim(),
        relation: m.relation.trim(),
        age: Number(m.age) || 0,
        status: m.status,
        initials,
        avatarGradient: `linear-gradient(135deg, hsl(${Math.random() * 360}, 70%, 60%), hsl(${Math.random() * 360}, 70%, 50%))`,
        records: 0,
        activeRx: 0,
        conditions: [],
        allergies: ["None known"],
        vitals: [],
        medications: [],
      };
    });
    setFamilyName(familyName.trim() || "My Family");
    setFamilyMembers(newFamilyMembers);
    setOnboardingComplete(true);
  };

  if (setupMode) {
    return (
      <div className="h-full w-full flex flex-col px-6 pt-8 pb-6 relative overflow-hidden">
        <div className="shrink-0 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-blue-accent" />
            <h2 className="text-xl font-bold text-white font-display">Set Up Your Family</h2>
          </div>
          <p className="text-sm text-white/80">Enter your family details to get started.</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/90">Family Name</label>
            <input
              value={familyName}
              onChange={(e) => setFamilyNameLocal(e.target.value)}
              placeholder="e.g. Mitchell Family"
              className="w-full bg-white/5 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/60 outline-none focus:ring-1 focus:ring-blue-accent"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-medium text-white/90">Family Members</label>
            {members.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 rounded-xl p-3 space-y-2 relative"
              >
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-emergency/20 flex items-center justify-center"
                    aria-label="Remove member"
                  >
                    <X size={12} className="text-red-emergency" />
                  </button>
                )}
                <input
                  value={member.name}
                  onChange={(e) => updateMember(member.id, "name", e.target.value)}
                  placeholder="Full name"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                />
                <div className="flex gap-2">
                  <input
                    value={member.relation}
                    onChange={(e) => updateMember(member.id, "relation", e.target.value)}
                    placeholder="Relation (e.g. Father)"
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                  />
                  <input
                    value={member.age}
                    onChange={(e) => updateMember(member.id, "age", e.target.value)}
                    placeholder="Age"
                    type="number"
                    className="w-16 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {(["healthy", "monitored", "critical"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => updateMember(member.id, "status", s)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide transition-colors ${
                        member.status === s
                          ? s === "healthy"
                            ? "bg-green-hospital/20 text-green-hospital"
                            : s === "monitored"
                            ? "bg-amber-warn/20 text-amber-warn"
                            : "bg-red-emergency/20 text-red-emergency"
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}

            <button
              onClick={addMember}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/20 text-sm text-white/80 hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={14} />
              Add Another Member
            </button>
          </div>
        </div>

        <motion.button
          className="mt-4 w-full py-3.5 rounded-full bg-white text-navy-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shrink-0"
          onClick={finish}
          whileTap={{ scale: 0.96 }}
        >
          Get Started
          <ChevronRight size={16} />
        </motion.button>
      </div>
    );
  }

  const slide = introSlides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center px-8 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20"
        style={{ background: slide.color.replace("text-", "var(--") + ")" }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="flex flex-col items-center text-center max-w-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={`w-20 h-20 rounded-3xl ${slide.bg} flex items-center justify-center mb-6`}
          >
            <Icon size={36} className={slide.color} />
          </div>

          <h2 className="text-3xl font-bold font-display text-white mb-2">
            {slide.title}
          </h2>
          <p className={`text-sm font-medium mb-4 ${slide.color}`}>
            {slide.subtitle}
          </p>
          <p className="text-sm text-white/90 leading-relaxed">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-2 mt-10">
        {introSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentSlide ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        className="mt-8 px-8 py-3.5 rounded-full bg-white text-navy-deep font-semibold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors"
        onClick={next}
        whileTap={{ scale: 0.96 }}
      >
        {isLastIntro ? "Set Up Family" : "Continue"}
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}
