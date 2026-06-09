"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppShell } from "@/components/shell/AppShell";
import { useFamilyStore } from "@/store/useFamilyStore";
import Onboarding from "@/components/screens/Onboarding";
import FamilyDashboard from "@/components/screens/FamilyDashboard";
import HealthTimeline from "@/components/screens/HealthTimeline";
import AiCopilot from "@/components/screens/AiCopilot";
import MedicationCenter from "@/components/screens/MedicationCenter";
import VaccinationTracker from "@/components/screens/VaccinationTracker";
import SymptomJournal from "@/components/screens/SymptomJournal";
import DoctorVisitPrep from "@/components/screens/DoctorVisitPrep";
import ExpenseTracker from "@/components/screens/ExpenseTracker";
import EmergencyMode from "@/components/screens/EmergencyMode";
import SettingsScreen from "@/components/screens/Settings";
import { FolderDetailModal } from "@/components/modals/FolderDetailModal";
import { useTripleTap } from "@/hooks/useTripleTap";

const screens: Record<string, React.ComponentType> = {
  onboarding: Onboarding,
  dashboard: FamilyDashboard,
  timeline: HealthTimeline,
  copilot: AiCopilot,
  medications: MedicationCenter,
  vaccinations: VaccinationTracker,
  journal: SymptomJournal,
  "visit-prep": DoctorVisitPrep,
  expenses: ExpenseTracker,
  emergency: EmergencyMode,
  settings: SettingsScreen,
};

export default function Home() {
  const store = useFamilyStore();
  const { currentScreen, isModalOpen, modalType, onboardingComplete } = store;

  // Support ?screen=xxx for deep-linking / screenshots
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const screen = params.get("screen");
    if (screen && screens[screen]) {
      store.setScreen(screen);
      if (!store.onboardingComplete) {
        store.setOnboardingComplete(true);
      }
    }
  }, []);

  // Triple-tap emergency trigger
  useTripleTap(() => {
    useFamilyStore.getState().toggleEmergencyMode(true);
  });

  const ScreenComponent = screens[
    !onboardingComplete ? "onboarding" : currentScreen
  ] || screens.dashboard;

  return (
    <AppShell showNav={onboardingComplete && currentScreen !== "emergency"}>
      <AnimatePresence mode="wait">
        <motion.div
          key={!onboardingComplete ? "onboarding" : currentScreen}
          className="h-full w-full"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScreenComponent />
        </motion.div>
      </AnimatePresence>

      {isModalOpen && modalType === "memberDetail" && <FolderDetailModal />}
    </AppShell>
  );
}
