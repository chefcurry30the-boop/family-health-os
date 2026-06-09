"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { useFamilyStore } from "@/store/useFamilyStore";
import { ArrowLeft, Phone, Siren, PanelLeft } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

export function AppShell({ children, showNav = true }: AppShellProps) {
  const { isEmergencyMode, familyMembers, toggleSidebar, toggleEmergencyMode, currentScreen } = useFamilyStore();

  const closeEmergency = () => {
    const store = useFamilyStore.getState();
    store.toggleEmergencyMode(false);
  };

  const showEmergencyButton = showNav && !isEmergencyMode && currentScreen === "dashboard";

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-navy-deep flex flex-col">
      {/* Top bar — safe-area aware */}
      <div
        className="shrink-0 z-50 flex items-center justify-between px-5"
        style={{
          paddingTop: "max(12px, env(safe-area-inset-top))",
          paddingBottom: "8px",
        }}
      >
        {!isEmergencyMode ? (
          <button
            onClick={() => toggleSidebar()}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
            aria-label="Open sidebar"
          >
            <PanelLeft size={20} />
            <span className="text-xs font-semibold">Menu</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-white/30">
            <PanelLeft size={20} />
            <span className="text-xs font-semibold">Menu</span>
          </div>
        )}
        <span className="text-sm font-semibold text-white/90 font-body">
          Nova Health
        </span>
        <div className="w-12" /> {/* spacer for balance */}
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>

      {/* Safe-area bottom spacer */}
      <div className="shrink-0 z-50" style={{ height: "max(4px, env(safe-area-inset-bottom))" }} />

      {/* Sidebar drawer */}
      {showNav && <Sidebar />}

      {/* Emergency overlay — full viewport takeover */}
      {isEmergencyMode && (
        <motion.div
          className="absolute inset-0 z-40 flex flex-col text-center p-6 emergency-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            paddingTop: "max(24px, env(safe-area-inset-top))",
            paddingBottom: "max(16px, env(safe-area-inset-bottom))",
          }}
        >
          <button
            onClick={closeEmergency}
            className="absolute top-[max(24px,env(safe-area-inset-top))] left-5 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors z-10"
          >
            <ArrowLeft size={16} />
            Back
          </button>

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
                    <Phone size={18} className="text-white/50" />
                  </button>
                ))
              ) : (
                <p className="text-sm text-white/50">No family members configured.</p>
              )}
            </div>
          </div>

          <button
            className="text-sm text-white/50 hover:text-white/80 transition-colors"
            onClick={closeEmergency}
          >
            Tap to exit emergency mode
          </button>
        </motion.div>
      )}

      {/* Floating Emergency Button — dashboard only */}
      {showEmergencyButton && (
        <motion.button
          className="absolute z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            right: "20px",
            bottom: "max(20px, calc(env(safe-area-inset-bottom) + 12px))",
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
    </div>
  );
}
