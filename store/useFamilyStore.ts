import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  memberId: string;
  name: string;
  doses: string;
  status: "complete" | "pending" | "due" | "current";
  date?: string;
  doctor?: string;
  clinic?: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  content: string; // extracted text or base64 for images
  ocrText?: string; // extracted text from images via Tesseract.js
  uploadedAt: string;
}

interface FamilyStore {
  currentScreen: string;
  prevScreen: string | null;
  isModalOpen: boolean;
  modalType: string | null;
  selectedMemberId: string | null;
  onboardingComplete: boolean;
  isEmergencyMode: boolean;
  sidebarOpen: boolean;

  // Editable data
  familyName: string;
  familyMembers: FamilyMember[];
  medications: Medication[];
  timelineEvents: TimelineEvent[];
  journalEntries: JournalEntry[];
  expenses: Expense[];
  vaccinations: Vaccination[];
  uploadedDocs: UploadedDoc[];

  // Actions — navigation
  setScreen: (screen: string) => void;
  goBack: () => void;
  openModal: (type: string, memberId?: string) => void;
  closeModal: () => void;
  setOnboardingComplete: (value: boolean) => void;
  setSelectedMember: (id: string | null) => void;
  toggleEmergencyMode: (value?: boolean) => void;
  toggleSidebar: (value?: boolean) => void;

  // Actions — family
  setFamilyName: (name: string) => void;

  // Actions — family members
  setFamilyMembers: (members: FamilyMember[]) => void;
  addFamilyMember: (member: FamilyMember) => void;
  updateFamilyMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;

  // Actions — medications
  addMedication: (med: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  removeMedication: (id: string) => void;
  toggleMedicationTaken: (id: string) => void;

  // Actions — timeline
  addTimelineEvent: (event: TimelineEvent) => void;
  removeTimelineEvent: (id: string) => void;

  // Actions — journal
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  removeJournalEntry: (id: string) => void;

  // Actions — expenses
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  removeExpense: (id: string) => void;

  // Actions — vaccines
  addVaccination: (vax: Vaccination) => void;
  updateVaccination: (id: string, updates: Partial<Vaccination>) => void;
  removeVaccination: (id: string) => void;

  // Actions — docs
  addUploadedDoc: (doc: UploadedDoc) => void;
  removeUploadedDoc: (id: string) => void;
}

export const useFamilyStore = create<FamilyStore>()(
  persist(
    (set, get) => ({
      currentScreen: "dashboard",
      prevScreen: null,
      isModalOpen: false,
      modalType: null,
      selectedMemberId: null,
      onboardingComplete: false,
      isEmergencyMode: false,
      sidebarOpen: false,
      familyName: "",

      familyMembers: [],
      medications: [],
      timelineEvents: [],
      journalEntries: [],
      expenses: [],
      vaccinations: [],
      uploadedDocs: [],

      setScreen: (screen) =>
        set((state) => ({
          prevScreen: state.currentScreen === screen ? state.prevScreen : state.currentScreen,
          currentScreen: screen,
        })),

      goBack: () =>
        set((state) => ({
          currentScreen: state.prevScreen || "dashboard",
          prevScreen: null,
        })),

      openModal: (type, memberId) =>
        set({ isModalOpen: true, modalType: type, selectedMemberId: memberId || null }),
      closeModal: () =>
        set({ isModalOpen: false, modalType: null, selectedMemberId: null }),

      setOnboardingComplete: (value) =>
        set({ onboardingComplete: value, currentScreen: value ? "dashboard" : "onboarding" }),

      setSelectedMember: (id) => set({ selectedMemberId: id }),

      toggleEmergencyMode: (value) =>
        set((state) => {
          const next = value !== undefined ? value : !state.isEmergencyMode;
          return {
            isEmergencyMode: next,
            prevScreen: next ? state.currentScreen : state.prevScreen,
            currentScreen: next ? "emergency" : state.prevScreen || "dashboard",
          };
        }),

      toggleSidebar: (value) =>
        set((state) => ({
          sidebarOpen: value !== undefined ? value : !state.sidebarOpen,
        })),

      setFamilyMembers: (members) =>
        set(() => ({ familyMembers: members })),
      addFamilyMember: (member) =>
        set((state) => ({ familyMembers: [...state.familyMembers, member] })),
      updateFamilyMember: (id, updates) =>
        set((state) => ({
          familyMembers: state.familyMembers.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      removeFamilyMember: (id) =>
        set((state) => ({ familyMembers: state.familyMembers.filter((m) => m.id !== id) })),

      addMedication: (med) =>
        set((state) => ({ medications: [...state.medications, med] })),
      updateMedication: (id, updates) =>
        set((state) => ({
          medications: state.medications.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      removeMedication: (id) =>
        set((state) => ({ medications: state.medications.filter((m) => m.id !== id) })),
      toggleMedicationTaken: (id) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id
              ? { ...m, taken: !m.taken, takenTime: !m.taken ? new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : undefined }
              : m
          ),
        })),

      addTimelineEvent: (event) =>
        set((state) => ({ timelineEvents: [event, ...state.timelineEvents] })),
      removeTimelineEvent: (id) =>
        set((state) => ({ timelineEvents: state.timelineEvents.filter((e) => e.id !== id) })),

      addJournalEntry: (entry) =>
        set((state) => ({ journalEntries: [entry, ...state.journalEntries] })),
      updateJournalEntry: (id, updates) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      removeJournalEntry: (id) =>
        set((state) => ({ journalEntries: state.journalEntries.filter((e) => e.id !== id) })),

      addExpense: (expense) =>
        set((state) => ({ expenses: [expense, ...state.expenses] })),
      updateExpense: (id, updates) =>
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        })),
      removeExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      addVaccination: (vax) =>
        set((state) => ({ vaccinations: [...state.vaccinations, vax] })),
      updateVaccination: (id, updates) =>
        set((state) => ({
          vaccinations: state.vaccinations.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),
      removeVaccination: (id) =>
        set((state) => ({ vaccinations: state.vaccinations.filter((v) => v.id !== id) })),

      addUploadedDoc: (doc) =>
        set((state) => ({ uploadedDocs: [...state.uploadedDocs, doc] })),
      removeUploadedDoc: (id) =>
        set((state) => ({ uploadedDocs: state.uploadedDocs.filter((d) => d.id !== id) })),

      setFamilyName: (name) => set(() => ({ familyName: name })),
    }),
    {
      name: "nova-health-store",
      partialize: (state) => ({
        familyName: state.familyName,
        familyMembers: state.familyMembers,
        medications: state.medications,
        timelineEvents: state.timelineEvents,
        journalEntries: state.journalEntries,
        expenses: state.expenses,
        vaccinations: state.vaccinations,
        uploadedDocs: state.uploadedDocs,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
