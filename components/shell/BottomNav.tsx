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
  ArrowLeft,
} from "lucide-react";

const leftItems = [
  { icon: Home, label: "Home", screen: "dashboard" as const },
  { icon: Heart, label: "Timeline", screen: "timeline" as const },
  { icon: Pill, label: "Meds", screen: "medications" as const },
];

const rightItems = [
  { icon: Shield, label: "Vaccines", screen: "vaccinations" as const },
  { icon: Stethoscope, label: "Journal", screen: "journal" as const },
  { icon: ClipboardList, label: "Visit", screen: "visit-prep" as const },
  { icon: Wallet, label: "Expenses", screen: "expenses" as const },
];

export function BottomNav() {
  const { currentScreen, setScreen, goBack, isEmergencyMode } = useFamilyStore();
  const isEmergencyScreen = currentScreen === "emergency";
  const isDashboard = currentScreen === "dashboard";

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[390px]">
      <nav className="glass-strong rounded-[28px] px-1 py-2 flex items-center justify-between relative">
        {/* Left tabs */}
        <div className="flex items-center">
          {leftItems.map((item) => (
            <NavButton
              key={item.screen}
              item={item}
              isActive={currentScreen === item.screen}
              onClick={() => setScreen(item.screen)}
            />
          ))}
        </div>

        {/* Center Emergency or Back button */}
        <div className="mx-1 shrink-0">
          {isEmergencyScreen || isEmergencyMode ? (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goBack}
              className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors shadow-lg"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-white" />
            </motion.button>
          ) : isDashboard ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setScreen("emergency")}
              className="w-12 h-12 rounded-full bg-red-emergency flex items-center justify-center hover:bg-red-light transition-colors shadow-lg shadow-red-900/40"
              aria-label="Emergency"
            >
              <Siren size={20} className="text-white" />
            </motion.button>
          ) : (
            <div className="w-12 h-12" />
          )}
        </div>

        {/* Right tabs */}
        <div className="flex items-center">
          {rightItems.map((item) => (
            <NavButton
              key={item.screen}
              item={item}
              isActive={currentScreen === item.screen}
              onClick={() => setScreen(item.screen)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: { icon: React.ElementType; label: string; screen: string };
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center gap-0.5 p-1.5 rounded-2xl transition-colors min-w-[40px]"
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
        size={18}
        className={`relative z-10 transition-colors ${
          isActive ? "text-white" : "text-white/60"
        }`}
        strokeWidth={isActive ? 2.5 : 1.5}
      />
      <span
        className={`relative z-10 text-[9px] font-medium transition-colors ${
          isActive ? "text-white" : "text-white/60"
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}
