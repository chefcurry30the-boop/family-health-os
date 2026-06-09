"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Siren, PanelLeft } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppShell({ children, showNav = true }: AppShellProps) {
  const { isEmergencyMode, familyMembers, toggleSidebar, toggleEmergencyMode, currentScreen } = useFamilyStore();

  const showEmergencyButton = showNav && !isEmergencyMode && currentScreen === "dashboard";

  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4 md:p-8">
      {/* Phone frame */}
      <motion.div
        className="relative w-full max-w-[430px] h-[880px] rounded-[48px] overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 10px #1a1a1a, 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 12px #2a2a2a",
        }}
        animate={isEmergencyMode ? { boxShadow: "0 0 0 10px #1a1a1a, 0 0 40px rgba(255,69,58,0.5), 0 0 0 12px #ff453a" } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Screen content */}
        <div
          className={`relative h-full w-full overflow-hidden flex flex-col ${
            isEmergencyMode ? "bg-[#0c0404]" : "bg-navy-deep"
          }`}
        >
          {/* Status bar */}
          <div className="h-[59px] shrink-0 z-50 flex items-center justify-between px-6 pt-2">
            <button
              onClick={() => toggleSidebar()}
              className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              aria-label="Open sidebar"
            >
              <PanelLeft size={18} />
              <span className="text-xs font-semibold">Menu</span>
            </button>
            <span className="text-xs font-semibold text-white/90 font-body">
              9:41
            </span>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="12" viewBox="0 0 18 12">
                <path
                  d="M2 8.5C2 8.5 4 8.5 4 6.5C4 4.5 2 4.5 2 4.5"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M6 9.5C6 9.5 9 9.5 9 6.5C9 3.5 6 3.5 6 3.5"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M10 10.5C10 10.5 14 10.5 14 6.5C14 2.5 10 2.5 10 2.5"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <rect x="15" y="3" width="3" height="7" rx="1" fill="white" />
              </svg>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>

          {/* Home indicator */}
          <div className="h-[34px] shrink-0 flex items-center justify-center z-50">
            <div className="w-[134px] h-[5px] rounded-full bg-white/20" />
          </div>

          {/* Sidebar */}
          {showNav && <Sidebar />}

          {/* Emergency overlay */}
          {isEmergencyMode && (
            <motion.div
              className="absolute inset-0 z-40 flex flex-col text-center p-6 emergency-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-medical-red/10 flex items-center justify-center mb-6 anim-emergency-pulse">
                  <div className="w-20 h-20 rounded-full bg-medical-red/20 flex items-center justify-center">
                    <Siren size={44} className="text-medical-red" />
                  </div>
                </div>
                <h2
                  className="text-4xl font-bold text-white mb-2 font-display tracking-tight"
                  style={{ textShadow: "0 0 30px rgba(255, 69, 58, 0.6)" }}
                >
                  Emergency
                </h2>
                <p className="text-base text-white/80 mb-8">
                  Medical profile for first responders
                </p>

                <div className="w-full max-w-[320px] space-y-3">
                  {familyMembers.length > 0 ? (
                    familyMembers.map((member) => (
                      <button
                        key={member.id}
                        className="w-full p-4 rounded-2xl text-left flex items-center gap-3 transition-all duration-200 hover:scale-[1.02]"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.10)",
                        }}
                      >
                        <div
                          className="w-11 h-11 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: member.avatarGradient }}
                        >
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-white/60">
                            {member.relation} · {member.age} yrs · {member.conditions.join(", ") || "No conditions"}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-white/50">No family members configured.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          <div className="w-[120px] h-[35px] rounded-full bg-black" />
        </div>

        {/* Floating Emergency Button */}
        {showEmergencyButton && (
          <motion.button
            className="absolute bottom-16 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #ff453a, #ff375f)",
              boxShadow: "0 4px 20px rgba(255,69,58,0.5), 0 0 0 4px rgba(255,69,58,0.15)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => toggleEmergencyMode(true)}
            aria-label="Emergency mode"
          >
            <Siren size={22} className="text-white" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
