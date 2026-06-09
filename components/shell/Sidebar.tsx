"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Home,
  Heart,
  Pill,
  Shield,
  Stethoscope,
  ClipboardList,
  Wallet,
  Sparkles,
  Siren,
  Settings,
  X,
} from "lucide-react";

const allNavItems = [
  { icon: Home, label: "Dashboard", screen: "dashboard" as const, adminOnly: false },
  { icon: Heart, label: "Family", screen: "timeline" as const, adminOnly: true },
  { icon: Pill, label: "Medications", screen: "medications" as const, adminOnly: true },
  { icon: Shield, label: "Vaccinations", screen: "vaccinations" as const, adminOnly: true },
  { icon: Stethoscope, label: "Health Journal", screen: "journal" as const, adminOnly: false },
  { icon: ClipboardList, label: "Visits", screen: "visit-prep" as const, adminOnly: true },
  { icon: Wallet, label: "Expenses", screen: "expenses" as const, adminOnly: true },
  { icon: Sparkles, label: "AI Copilot", screen: "copilot" as const, adminOnly: false },
];

export function Sidebar() {
  const { currentScreen, setScreen, sidebarOpen, toggleSidebar, familyMembers, currentUserId } = useFamilyStore();

  const currentUser = familyMembers.find((m) => m.id === currentUserId);
  const isAdmin = currentUser?.role === "admin";

  const navItems = allNavItems.filter((item) => isAdmin || !item.adminOnly);

  const handleNav = (screen: string) => {
    setScreen(screen);
    toggleSidebar(false);
  };

  const memberCount = familyMembers.length;
  const criticalCount = familyMembers.filter((m) => m.status === "critical").length;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-[55] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => toggleSidebar(false)}
          />

          {/* Sidebar */}
          <motion.div
            className="absolute top-0 left-0 z-[60] h-full w-[280px] flex flex-col"
            initial={{ x: -280, opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0.8 }}
            transition={{ type: "spring", stiffness: 350, damping: 32 }}
            style={{
              background: "linear-gradient(180deg, rgba(10,17,32,0.95) 0%, rgba(6,11,20,0.98) 100%)",
              backdropFilter: "blur(60px) saturate(180%)",
              WebkitBackdropFilter: "blur(60px) saturate(180%)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 0 60px rgba(0,0,0,0.5), inset -1px 0 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Header */}
            <div className="px-5 pt-6 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-tight">Nova Health</h2>
                <div className="flex items-center gap-2 mt-1">
                  {isAdmin ? (
                    <span className="text-[11px] text-white/50">
                      {memberCount} {memberCount === 1 ? "member" : "members"}
                    </span>
                  ) : (
                    <span className="text-[11px] text-white/50">
                      {currentUser?.name || "Member"}
                    </span>
                  )}
                  {isAdmin && criticalCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-medical-red/15 text-[10px] text-medical-red font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-medical-red animate-pulse" />
                      {criticalCount} critical
                    </span>
                  )}
                  {!isAdmin && currentUser?.status === "critical" && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-medical-red/15 text-[10px] text-medical-red font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-medical-red animate-pulse" />
                      Critical
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => toggleSidebar(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Close sidebar"
              >
                <X size={16} className="text-white/60" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-white/8" />

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.screen;
                return (
                  <button
                    key={item.screen}
                    onClick={() => handleNav(item.screen)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:bg-white/5 hover:text-white/90"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`transition-colors ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    <span className={`text-sm font-medium transition-colors ${isActive ? "text-white" : ""}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActive"
                        className="absolute left-0 w-[3px] h-6 rounded-r-full bg-medical-blue"
                        style={{ marginLeft: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-3 pb-6 pt-2 space-y-2">
              <div className="mx-3 h-px bg-white/8 mb-2" />
              <button
                onClick={() => {
                  toggleSidebar(false);
                  setScreen("emergency");
                }}
                className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl bg-gradient-to-r from-medical-red/20 to-medical-red/5 text-medical-red hover:from-medical-red/30 hover:to-medical-red/10 transition-all duration-200 border border-medical-red/15"
              >
                <div className="w-8 h-8 rounded-full bg-medical-red/20 flex items-center justify-center">
                  <Siren size={18} className="text-medical-red" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-medical-red">Emergency</span>
                  <p className="text-[10px] text-medical-red/60">Tap for urgent access</p>
                </div>
              </button>
              <button
                onClick={() => handleNav("settings")}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:bg-white/5 hover:text-white/80 transition-all duration-200"
              >
                <Settings size={18} />
                <span className="text-sm font-medium">Settings</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
