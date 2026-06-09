"use client";

import { useFamilyStore } from "@/store/useFamilyStore";
import { motion } from "framer-motion";
import {
  Home,
  Heart,
  Pill,
  Shield,
  Stethoscope,
  ClipboardList,
  Wallet,
  Siren,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", screen: "dashboard" as const },
  { icon: Heart, label: "Timeline", screen: "timeline" as const },
  { icon: Pill, label: "Meds", screen: "medications" as const },
  { icon: Shield, label: "Vaccines", screen: "vaccinations" as const },
  { icon: Stethoscope, label: "Journal", screen: "journal" as const },
  { icon: ClipboardList, label: "Visit", screen: "visit-prep" as const },
  { icon: Wallet, label: "Expenses", screen: "expenses" as const },
  { icon: Siren, label: "Emergency", screen: "emergency" as const },
];

export function BottomNav() {
  const { currentScreen, setScreen } = useFamilyStore();

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px]">
      <nav className="glass-strong rounded-[28px] px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => setScreen(item.screen)}
              className="relative flex flex-col items-center gap-0.5 p-2 rounded-2xl transition-colors"
              aria-label={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-2xl bg-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors ${
                  isActive ? "text-ivory" : "text-ivory/60"
                }`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span
                className={`relative z-10 text-[9px] font-medium transition-colors ${
                  isActive ? "text-ivory" : "text-ivory/70"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
