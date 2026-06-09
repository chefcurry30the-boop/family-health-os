import { create } from "zustand";

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  status: "healthy" | "monitored" | "critical";
  initials: string;
  avatarGradient: string;
  records: number;
  activeRx: number;
  conditions: string[];
  allergies: string[];
  vitals: Vital[];
  medications: string[];
}

export interface Vital {
  label: string;
  value: string;
  unit: string;
  trend: string;
  trendColor: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  memberName: string;
  title: string;
  description: string;
  tags: string[];
  type: "visit" | "lab" | "emergency" | "rx" | "vital";
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  memberId: string;
  memberName: string;
  schedule: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "morning-evening";
  shape: "half" | "capsule" | "round" | "tablet";
  color: string;
  taken: boolean;
  takenTime?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  time: string;
  text: string;
  tags: string[];
  mood: "great" | "good" | "okay" | "unwell" | "bad";
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  memberId: string;
  category: string;
  icon: string;
}

export interface Vaccination {
  id: string;
  name: string;
  doses: string;
  status: "complete" | "pending" | "due" | "current";
  date?: string;
  doctor?: string;
}

interface FamilyStore {
  currentScreen: string;
  isModalOpen: boolean;
  modalType: string | null;
  selectedMemberId: string | null;
  onboardingComplete: boolean;
  isEmergencyMode: boolean;

  // Actions
  setScreen: (screen: string) => void;
  openModal: (type: string, memberId?: string) => void;
  closeModal: () => void;
  setOnboardingComplete: (value: boolean) => void;
  setSelectedMember: (id: string | null) => void;
  toggleEmergencyMode: (value?: boolean) => void;
}

export const useFamilyStore = create<FamilyStore>((set) => ({
  currentScreen: "dashboard",
  isModalOpen: false,
  modalType: null,
  selectedMemberId: null,
  onboardingComplete: false,
  isEmergencyMode: false,

  setScreen: (screen) => set({ currentScreen: screen }),
  openModal: (type, memberId) =>
    set({ isModalOpen: true, modalType: type, selectedMemberId: memberId || null }),
  closeModal: () => set({ isModalOpen: false, modalType: null, selectedMemberId: null }),
  setOnboardingComplete: (value) => set({ onboardingComplete: value, currentScreen: value ? "dashboard" : "onboarding" }),
  setSelectedMember: (id) => set({ selectedMemberId: id }),
  toggleEmergencyMode: (value) =>
    set((state) => ({ isEmergencyMode: value !== undefined ? value : !state.isEmergencyMode })),
}));
