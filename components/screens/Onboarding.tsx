"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Heart,
  Shield,
  Pill,
  Siren,
  ChevronRight,
  Plus,
  X,
  Users,
} from "lucide-react";

const introSlides = [
  {
    icon: Heart,
    title: "Family Health OS",
    subtitle: "Your family's health, organized.",
    description:
      "Track vitals, medications, vaccinations, and appointments for your entire family in one beautiful, secure app.",
    colorClass: "text-medical-green",
    bgClass: "bg-medical-green/10",
    glowClass: "rgba(48, 209, 88, 0.25)",
  },
  {
    icon: Shield,
    title: "AI Health Timeline",
    subtitle: "Never miss a beat.",
    description:
      "Get intelligent reminders for medications, upcoming vaccines, and doctor visits. Our AI copilot helps you stay ahead.",
    colorClass: "text-medical-blue",
    bgClass: "bg-medical-blue/10",
    glowClass: "rgba(10, 132, 255, 0.25)",
  },
  {
    icon: Pill,
    title: "Medication Center",
    subtitle: "Stay on schedule.",
    description:
      "Track daily medications for every family member. Mark doses as taken and get alerts for missed medications.",
    colorClass: "text-medical-purple",
    bgClass: "bg-medical-purple/10",
    glowClass: "rgba(191, 90, 242, 0.25)",
  },
  {
    icon: Siren,
    title: "Emergency Ready",
    subtitle: "Critical info, always accessible.",
    description:
      "Triple-tap anywhere to activate Emergency Mode. Blood type, allergies, conditions, and contacts — even offline.",
    colorClass: "text-medical-red",
    bgClass: "bg-medical-red/10",
    glowClass: "rgba(255, 69, 58, 0.25)",
  },
];

interface MemberForm {
  id: string;
  name: string;
  relation: string;
  age: string;
  status: "healthy" | "monitored" | "critical";
}

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [setupMode, setSetupMode] = useState(false);
  const [familyName, setFamilyNameLocal] = useState("My Family");
  const [members, setMembers] = useState<MemberForm[]>([
    {
      id: "1",
      name: "",
      relation: "",
      age: "",
      status: "healthy",
    },
  ]);
  const {
    setOnboardingComplete,
    setFamilyMembers,
    setFamilyName,
  } = useFamilyStore();

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
      {
        id: String(Date.now()),
        name: "",
        relation: "",
        age: "",
        status: "healthy",
      },
    ]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMember = (
    id: string,
    field: keyof MemberForm,
    value: string
  ) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const finish = () => {
    const validMembers = members.filter(
      (m) => m.name.trim() && m.relation.trim()
    );
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
        bloodType: "",
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

  const canFinish = members.some(
    (m) => m.name.trim() && m.relation.trim()
  );

  if (setupMode) {
    return (
      <div className="h-full w-full flex flex-col px-6 pt-8 pb-6 relative overflow-hidden bg-navy-deep">
        <div className="shrink-0 mb-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl glass flex items-center justify-center">
              <Users size={18} className="text-medical-blue" />
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              Set Up Your Family
            </h2>
          </div>
          <p className="text-sm text-white/50">
            Enter your family details to get started.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1 scrollbar-hide">
          {/* Family Name */}
          <div className="glass rounded-2xl p-4 space-y-2">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
              Family Name
            </label>
            <input
              value={familyName}
              onChange={(e) => setFamilyNameLocal(e.target.value)}
              placeholder="e.g. Mitchell Family"
              className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              aria-label="Family name"
            />
          </div>

          {/* Members */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider px-1">
              Family Members
            </label>
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass rounded-2xl p-4 space-y-3 relative"
              >
                {members.length > 1 && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="absolute top-3 right-3 w-7 h-7 rounded-full glass flex items-center justify-center hover:bg-medical-red/20 transition-colors focus:outline-none focus:ring-2 focus:ring-medical-red/50"
                    aria-label={`Remove member ${member.name || index + 1}`}
                  >
                    <X size={14} className="text-white/70" />
                  </button>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    value={member.name}
                    onChange={(e) =>
                      updateMember(member.id, "name", e.target.value)
                    }
                    placeholder="e.g. James Mitchell"
                    className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                    aria-label={`Member ${index + 1} full name`}
                  />
                </div>

                {/* Relation + Age */}
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                      Relation
                    </label>
                    <input
                      value={member.relation}
                      onChange={(e) =>
                        updateMember(member.id, "relation", e.target.value)
                      }
                      placeholder="e.g. Father"
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                      aria-label={`Member ${index + 1} relation`}
                    />
                  </div>
                  <div className="w-20 space-y-1">
                    <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                      Age
                    </label>
                    <input
                      value={member.age}
                      onChange={(e) =>
                        updateMember(member.id, "age", e.target.value)
                      }
                      placeholder="42"
                      type="number"
                      min={0}
                      max={120}
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
                      aria-label={`Member ${index + 1} age`}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                    Health Status
                  </label>
                  <div className="flex gap-2">
                    {(["healthy", "monitored", "critical"] as const).map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() =>
                            updateMember(member.id, "status", s)
                          }
                          className={`flex-1 px-2 py-2 rounded-xl text-[11px] font-medium capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 ${
                            member.status === s
                              ? s === "healthy"
                                ? "bg-medical-green/20 text-medical-green ring-1 ring-medical-green/30"
                                : s === "monitored"
                                ? "bg-medical-amber/20 text-medical-amber ring-1 ring-medical-amber/30"
                                : "bg-medical-red/20 text-medical-red ring-1 ring-medical-red/30"
                              : "bg-white/5 text-white/50 hover:bg-white/10"
                          }`}
                          aria-label={`Set status to ${s}`}
                        >
                          {s}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Add member */}
            <button
              onClick={addMember}
              className="w-full py-3 rounded-2xl border border-dashed border-white/15 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Add another family member"
            >
              <Plus size={16} />
              Add Another Member
            </button>
          </div>
        </div>

        {/* Finish button */}
        <motion.button
          className="mt-5 w-full py-4 rounded-full bg-white text-navy-deep font-semibold text-sm flex items-center justify-center gap-2 hover:bg-white/90 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={finish}
          disabled={!canFinish}
          whileTap={{ scale: 0.96 }}
          aria-label="Finish onboarding and get started"
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
    <div className="h-full w-full flex flex-col items-center justify-center px-8 relative overflow-hidden bg-navy-deep">
      {/* Background glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-[100px] opacity-30 pointer-events-none"
        style={{ background: slide.glowClass }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="flex flex-col items-center text-center max-w-xs relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className={`w-20 h-20 rounded-3xl ${slide.bgClass} flex items-center justify-center mb-6`}
          >
            <Icon size={36} className={slide.colorClass} />
          </div>

          <h2 className="text-3xl font-bold font-display text-white mb-2">
            {slide.title}
          </h2>
          <p className={`text-sm font-semibold mb-4 ${slide.colorClass}`}>
            {slide.subtitle}
          </p>
          <p className="text-sm text-white/70 leading-relaxed">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-2.5 mt-10 relative z-10"
        role="tablist"
        aria-label="Onboarding slides"
      >
        {introSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${
              i === currentSlide
                ? "bg-white w-5"
                : "bg-white/30 hover:bg-white/50"
            }`}
            role="tab"
            aria-selected={i === currentSlide}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        className="mt-8 px-8 py-3.5 rounded-full bg-white text-navy-deep font-semibold text-sm flex items-center gap-2 hover:bg-white/90 transition-colors relative z-10 focus:outline-none focus:ring-2 focus:ring-white/50"
        onClick={next}
        whileTap={{ scale: 0.96 }}
        aria-label={isLastIntro ? "Set up family" : "Continue to next slide"}
      >
        {isLastIntro ? "Set Up Family" : "Continue"}
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}
