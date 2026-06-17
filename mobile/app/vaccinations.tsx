import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { vaccinations as mockVax } from "../data/familyData";
import { Avatar } from "../components/Avatar";
import { GlassView } from "../components/GlassView";
import {
  ArrowLeft, Plus, X, Trash2, Shield, Calendar, MapPin,
  CheckCircle2, AlertCircle, Clock,
} from "lucide-react-native";

const statuses = [
  { key: "complete" as const, label: "Complete", color: "#30d158", icon: CheckCircle2 },
  { key: "current" as const, label: "Current", color: "#0a84ff", icon: Clock },
  { key: "due" as const, label: "Due", color: "#ff9f0a", icon: AlertCircle },
  { key: "pending" as const, label: "Pending", color: "#ff375f", icon: Clock },
];

export default function VaccinationsScreen() {
  const router = useRouter();
  const { vaccinations, familyMembers, addVaccination, removeVaccination } = useFamilyStore();
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id || "");
  const [showAdd, setShowAdd] = useState(false);
  const [newVax, setNewVax] = useState({
    name: "", doses: "", status: "complete" as const, date: "", doctor: "", clinic: "",
  });

  const vax = vaccinations.length > 0 ? vaccinations : mockVax;
  const memberVax = vax.filter((v) => v.memberId === selectedMemberId);
  const member = familyMembers.find((m) => m.id === selectedMemberId);

  const complete = memberVax.filter((v) => v.status === "complete").length;
  const current = memberVax.filter((v) => v.status === "current").length;
  const due = memberVax.filter((v) => v.status === "due").length;

  const handleAdd = () => {
    if (!newVax.name.trim() || !selectedMemberId) return;
    addVaccination({
      id: String(Date.now()),
      memberId: selectedMemberId,
      name: newVax.name.trim(),
      doses: newVax.doses.trim() || "—",
      status: newVax.status,
      date: newVax.date.trim() || undefined,
      doctor: newVax.doctor.trim() || undefined,
      clinic: newVax.clinic.trim() || undefined,
    });
    setNewVax({ name: "", doses: "", status: "complete", date: "", doctor: "", clinic: "" });
    setShowAdd(false);
  };

  const getStatusConfig = (status: string) => statuses.find((s) => s.key === status) || statuses[0];

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between pt-2 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
            <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
            <Text className="text-white/60 text-sm">Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-semibold text-sm">Vaccination Tracker</Text>
          <TouchableOpacity onPress={() => setShowAdd((s) => !s)} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
            {showAdd ? <X size={16} color="rgba(255,255,255,0.6)" /> : <Plus size={16} color="rgba(255,255,255,0.6)" />}
          </TouchableOpacity>
        </View>

        {/* Member selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-2">
            {familyMembers.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => setSelectedMemberId(m.id)}
                className={`flex-row items-center gap-2 px-3 py-2 rounded-full border ${selectedMemberId === m.id ? "bg-white/10 border-white/20" : "border-white/5"}`}
              >
                <Avatar initials={m.initials} gradient={m.avatarGradient} size={28} />
                <Text className="text-white text-xs">{m.name.split(" ")[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Stats */}
        {member && (
          <GlassView variant="strong" className="p-4 mb-4">
            <View className="flex-row items-center gap-3 mb-3">
              <Avatar initials={member.initials} gradient={member.avatarGradient} size={48} />
              <View>
                <Text className="text-white text-lg font-semibold">{member.name}</Text>
                <Text className="text-white/50 text-xs">{member.age} yrs · {member.relation}</Text>
              </View>
            </View>
            <View className="flex-row gap-2">
              {[
                { label: "Complete", value: complete, color: "text-medical-green" },
                { label: "Current", value: current, color: "text-medical-blue" },
                { label: "Due Soon", value: due, color: "text-medical-amber" },
              ].map((s) => (
                <View key={s.label} className="flex-1 bg-white/5 rounded-xl p-3 items-center">
                  <Text className={`text-lg font-bold ${s.color}`}>{s.value}</Text>
                  <Text className="text-white/40 text-[10px]">{s.label}</Text>
                </View>
              ))}
            </View>
          </GlassView>
        )}

        {/* Add form */}
        {showAdd && (
          <GlassView variant="strong" className="p-4 mb-4 gap-3">
            <TextInput
              value={newVax.name} onChangeText={(t) => setNewVax((v) => ({ ...v, name: t }))}
              placeholder="Vaccine name" placeholderTextColor="rgba(255,255,255,0.3)"
              className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
            />
            <TextInput
              value={newVax.doses} onChangeText={(t) => setNewVax((v) => ({ ...v, doses: t }))}
              placeholder="Doses (e.g. 2/3)" placeholderTextColor="rgba(255,255,255,0.3)"
              className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
            />
            <View className="flex-row flex-wrap gap-2">
              {statuses.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => setNewVax((v) => ({ ...v, status: s.key }))}
                  className={`flex-row items-center gap-1 px-3 py-2 rounded-xl border ${newVax.status === s.key ? "bg-white/10 border-white/20" : "border-white/5"}`}
                >
                  <s.icon size={14} color={s.color} />
                  <Text className="text-white text-xs">{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              value={newVax.date} onChangeText={(t) => setNewVax((v) => ({ ...v, date: t }))}
              placeholder="Date (optional)" placeholderTextColor="rgba(255,255,255,0.3)"
              className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
            />
            <TouchableOpacity onPress={handleAdd} className="bg-medical-purple rounded-xl py-2.5 items-center">
              <Text className="text-white font-semibold text-sm">Add Vaccination</Text>
            </TouchableOpacity>
          </GlassView>
        )}

        {/* Vaccine list */}
        <View className="gap-2 mb-6">
          {memberVax.map((v) => {
            const sc = getStatusConfig(v.status);
            return (
              <GlassView key={v.id} className="p-4 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: sc.color + "20" }}>
                  <Shield size={18} color={sc.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-semibold">{v.name}</Text>
                  <Text className="text-white/50 text-xs">{v.doses} doses</Text>
                  {v.date && (
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <Calendar size={10} color="rgba(255,255,255,0.4)" />
                      <Text className="text-white/40 text-[10px]">{v.date}</Text>
                    </View>
                  )}
                </View>
                <View className="items-end">
                  <View className="flex-row items-center gap-1">
                    <View className="w-2 h-2 rounded-full" style={{ backgroundColor: sc.color }} />
                    <Text className="text-white/60 text-[10px] capitalize">{v.status}</Text>
                  </View>
                  <TouchableOpacity onPress={() => removeVaccination(v.id)} className="mt-1">
                    <Trash2 size={12} color="rgba(255,255,255,0.3)" />
                  </TouchableOpacity>
                </View>
              </GlassView>
            );
          })}
          {memberVax.length === 0 && (
            <Text className="text-white/30 text-xs text-center py-6">No vaccinations recorded for this member.</Text>
          )}
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
