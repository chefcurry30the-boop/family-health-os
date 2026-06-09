"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Heart, Shield, Pill, Siren, ChevronRight } from "lucide-react";

const slides = [
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
  const { setOnboardingComplete } = useFamilyStore();

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === slides.length - 1;

  const next = () => {
    if (isLast) {
      setOnboardingComplete(true);
    } else {
      setCurrentSlide((s) => s + 1);
    }
  };

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

          <h2 className="text-3xl font-bold font-display text-ivory mb-2">
            {slide.title}
          </h2>
          <p className={`text-sm font-medium mb-4 ${slide.color}`}>
            {slide.subtitle}
          </p>
          <p className="text-sm text-ivory/80 leading-relaxed">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="flex gap-2 mt-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentSlide ? "bg-ivory" : "bg-ivory/20"
            }`}
          />
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        className="mt-8 px-8 py-3.5 rounded-full bg-ivory text-navy-deep font-semibold text-sm flex items-center gap-2 hover:bg-ivory/90 transition-colors"
        onClick={next}
        whileTap={{ scale: 0.96 }}
      >
        {isLast ? "Get Started" : "Continue"}
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
}
