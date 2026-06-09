"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { BottomNav } from "./BottomNav";
import { useFamilyStore } from "@/store/useFamilyStore";
import { ArrowLeft, Phone } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppShell({ children, showNav = true }: AppShellProps) {
  const { isEmergencyMode, familyMembers } = useFamilyStore();

  const closeEmergency = () => {
    const store = useFamilyStore.getState();
    store.toggleEmergencyMode(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-900 p-4 md:p-8">
      {/* Phone frame */}
      <motion.div
        className="relative w-full max-w-[430px] h-[880px] rounded-[60px] overflow-hidden shadow-2xl"
        style={{
          boxShadow:
            "0 0 0 12px #1a1a1a, 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 14px #333",
        }}
        animate={isEmergencyMode ? { boxShadow: "0 0 0 12px #1a1a1a, 0 0 40px rgba(231, 76, 60, 0.6), 0 0 0 14px #e74c3c" } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Screen content */}
        <div
          className={`relative h-full w-full overflow-hidden flex flex-col ${
            isEmergencyMode ? "bg-[#7a1e1e]" : "bg-navy-deep"
          }`}
        >
          {/* Status bar */}
          <div className="h-[59px] shrink-0 z-50 flex items-center justify-between px-6 pt-2">
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
            <div className="w-[134px] h-[5px] rounded-full bg-white/30" />
          </div>

          {/* Emergency overlay */}
          {isEmergencyMode && (
            <motion.div
              className="absolute inset-0 z-40 bg-[#7a1e1e] flex flex-col items-center justify-center text-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={closeEmergency}
                className="absolute top-6 left-6 flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="w-24 h-24 rounded-full bg-[#ff4444]/20 flex items-center justify-center mb-6 animate-pulse">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h2
                className="text-4xl font-bold text-white mb-2 font-display"
                style={{ textShadow: "0 0 20px rgba(255, 68, 68, 0.8)" }}
              >
                EMERGENCY
              </h2>
              <p className="text-base text-white/90 mb-4">
                Medical Profile Active
              </p>
              <div className="w-full max-w-[320px] space-y-3">
                {familyMembers.length > 0 ? (
                  familyMembers.map((member) => (
                    <button
                      key={member.id}
                      className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-left flex items-center gap-3 hover:bg-white/20 transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm"
                        style={{ background: member.avatarGradient }}
                      >
                        {member.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {member.name}
                        </p>
                        <p className="text-xs text-white/70">
                          {member.relation} · {member.conditions.join(", ") || "No conditions"}
                        </p>
                      </div>
                      <Phone size={20} className="text-white/80" />
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-white/70">No family members configured.</p>
                )}
              </div>
              <button
                className="mt-6 text-sm text-white/80 hover:text-white transition-colors"
                onClick={closeEmergency}
              >
                Tap to exit
              </button>
            </motion.div>
          )}
        </div>

        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
          <div className="w-[120px] h-[35px] rounded-full bg-black" />
        </div>
      </motion.div>

      {showNav && <BottomNav />}
    </div>
  );
}
