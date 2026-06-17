import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { medications as mockMeds } from "../data/familyData";
import { GlassView } from "../components/GlassView";
import {
  ArrowLeft, Plus, X, Check, Pill, Sun, Sunset, Moon,
} from "lucide-react-native";

const timesOfDay = [
  { key: "morning" as const, label: "Morning", icon: Sun, color: "#ff9f0a" },
  { key: "afternoon" as const, label: "Afternoon", icon: Sun, color: "#0a84ff" },
  { key: "evening" as const, label: "Evening", icon: Sunset, color: "#bf5af2" },
  { key: "morning-evening" as const, label: "Both", icon: Moon, color: "#30d158" },
];

const shapes = ["round", "capsule", "half", "tablet"] as const;
const colors = ["#0a84ff", "#ff9f0a", "#ff375f", "#bf5af2", "#30d158", "#5fc9f8"];

export default function MedicationsScreen() {
  const router = useRouter();
  const {
    medications, familyMembers,
    addMedication, removeMedication, toggleMedicationTaken,
  } = useFamilyStore();

  const [showAdd, setShowAdd] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "", dosage: "", memberId: "", timeOfDay: "morning" as const,
    shape: "round" as const, color: "#0a84ff", schedule: "Daily morning",
  });

  const meds = medications.length > 0 ? medications : mockMeds;
  const takenCount = meds.filter((m) => m.taken).length;
  const progress = meds.length > 0 ? takenCount / meds.length : 0;

  const handleAdd = () => {
    if (!newMed.name.trim() || !newMed.memberId) return;
    const member = familyMembers.find((m) => m.id === newMed.memberId);
    addMedication({
      id: String(Date.now()),
      name: newMed.name.trim(),
      dosage: newMed.dosage.trim() || "—",
      memberId: newMed.memberId,
      memberName: member?.name || "Family",
      schedule: newMed.schedule,
      timeOfDay: newMed.timeOfDay,
      shape: newMed.shape,
      color: newMed.color,
      taken: false,
    });
    setNewMed({ name: "", dosage: "", memberId: "", timeOfDay: "morning", shape: "round", color: "#0a84ff", schedule: "Daily morning" });
    setShowAdd(false);
  };

  const getTimeConfig = (tod: string) => timesOfDay.find((t) => t.key === tod) || timesOfDay[0];

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between pt-2 pb-4">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
              <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
              <Text className="text-white/60 text-sm">Back</Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold text-sm">Medication Center</Text>
            <TouchableOpacity onPress={() => setShowAdd((s) => !s)} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
              {showAdd ? <X size={16} color="rgba(255,255,255,0.6)" /> : <Plus size={16} color="rgba(255,255,255,0.6)" />}
            </TouchableOpacity>
          </View>

          <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Today's Schedule</Text>
          <Text className="text-white text-[28px] font-semibold font-display leading-tight mb-4">
            {takenCount}/{meds.length} taken
          </Text>

          {/* Progress bar */}
          <View className="h-2 bg-white/5 rounded-full mb-5 overflow-hidden">
            <View className="h-full bg-medical-green rounded-full" style={{ width: `${progress * 100}%` }} />
          </View>

          {/* Add form */}
          {showAdd && (
            <GlassView variant="strong" className="p-4 mb-4 gap-3">
              <TextInput
                value={newMed.name} onChangeText={(t) => setNewMed((m) => ({ ...m, name: t }))}
                placeholder="Medication name" placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
              />
              <TextInput
                value={newMed.dosage} onChangeText={(t) => setNewMed((m) => ({ ...m, dosage: t }))}
                placeholder="Dosage (e.g. 10mg)" placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
              />
              {/* Member select */}
              <View className="flex-row flex-wrap gap-2">
                {familyMembers.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    onPress={() => setNewMed((med) => ({ ...med, memberId: m.id }))}
                    className={`px-3 py-2 rounded-xl border ${newMed.memberId === m.id ? "bg-white/10 border-white/20" : "border-white/5"}`}
                  >
                    <Text className="text-white text-xs">{m.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Time of day */}
              <View className="flex-row flex-wrap gap-2">
                {timesOfDay.map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setNewMed((m) => ({ ...m, timeOfDay: t.key }))}
                    className={`flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg border ${newMed.timeOfDay === t.key ? "bg-white/10 border-white/20" : "border-white/5"}`}
                  >
                    <t.icon size={12} color={t.color} />
                    <Text className="text-white text-[10px]">{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* Shape */}
              <View className="flex-row gap-2">
                {shapes.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setNewMed((m) => ({ ...m, shape: s }))}
                    className={`w-10 h-10 rounded-full items-center justify-center border ${newMed.shape === s ? "bg-white/10 border-white/20" : "border-white/5"}`}
                  >
                    <View className="w-4 h-4 rounded-full" style={{ backgroundColor: newMed.color, borderRadius: s === "capsule" ? 8 : s === "half" ? 2 : 999 }} />
                  </TouchableOpacity>
                ))}
              </View>
              {/* Color */}
              <View className="flex-row gap-2">
                {colors.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setNewMed((m) => ({ ...m, color: c }))}
                    className={`w-8 h-8 rounded-full border-2 ${newMed.color === c ? "border-white" : "border-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </View>
              <TouchableOpacity onPress={handleAdd} className="bg-medical-blue rounded-xl py-2.5 items-center">
                <Text className="text-white font-semibold text-sm">Add Medication</Text>
              </TouchableOpacity>
            </GlassView>
          )}

          {/* Medication list */}
          <View className="gap-2 mb-6">
            {meds.map((med) => {
              const timeCfg = getTimeConfig(med.timeOfDay);
              return (
                <GlassView key={med.id} variant="strong" className="p-4 flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: med.color + "20" }}>
                    <Pill size={18} color={med.color} />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-white text-sm font-semibold ${med.taken ? "line-through opacity-50" : ""}`}>{med.name}</Text>
                    <Text className="text-white/50 text-xs">{med.dosage} · {med.memberName}</Text>
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <timeCfg.icon size={10} color={timeCfg.color} />
                      <Text className="text-white/40 text-[10px]">{med.schedule}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleMedicationTaken(med.id)}
                    className={`w-9 h-9 rounded-full border items-center justify-center ${med.taken ? "bg-medical-green border-medical-green" : "border-white/20"}`}
                  >
                    {med.taken && <Check size={16} color="#fff" />}
                  </TouchableOpacity>
                </GlassView>
              );
            })}
          </View>

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
