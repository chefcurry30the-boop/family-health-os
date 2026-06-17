import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { Avatar } from "../components/Avatar";
import { GlassView } from "../components/GlassView";
import {
  ArrowLeft, Check, Plus, X, Trash2, Stethoscope, ClipboardCheck,
} from "lucide-react-native";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

const defaultChecklist: ChecklistItem[] = [
  { id: "1", text: "Insurance card", done: false },
  { id: "2", text: "List of current medications", done: false },
  { id: "3", text: "Recent lab reports", done: false },
  { id: "4", text: "Questions for doctor", done: false },
  { id: "5", text: "ID proof", done: false },
];

export default function VisitPrepScreen() {
  const router = useRouter();
  const { familyMembers } = useFamilyStore();
  const [selectedMemberId, setSelectedMemberId] = useState(familyMembers[0]?.id || "");
  const [checklists, setChecklists] = useState<Record<string, ChecklistItem[]>>(() => {
    const map: Record<string, ChecklistItem[]> = {};
    familyMembers.forEach((m) => {
      map[m.id] = defaultChecklist.map((item) => ({ ...item, id: `${m.id}-${item.id}` }));
    });
    return map;
  });
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [newItem, setNewItem] = useState("");

  const member = familyMembers.find((m) => m.id === selectedMemberId);
  const checklist = checklists[selectedMemberId] || [];
  const doneCount = checklist.filter((i) => i.done).length;
  const progress = checklist.length > 0 ? doneCount / checklist.length : 0;

  const toggleItem = (itemId: string) => {
    setChecklists((prev) => ({
      ...prev,
      [selectedMemberId]: prev[selectedMemberId]?.map((i) =>
        i.id === itemId ? { ...i, done: !i.done } : i
      ) || [],
    }));
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setChecklists((prev) => ({
      ...prev,
      [selectedMemberId]: [
        ...(prev[selectedMemberId] || []),
        { id: String(Date.now()), text: newItem.trim(), done: false },
      ],
    }));
    setNewItem("");
  };

  const removeItem = (itemId: string) => {
    setChecklists((prev) => ({
      ...prev,
      [selectedMemberId]: (prev[selectedMemberId] || []).filter((i) => i.id !== itemId),
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between pt-2 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
            <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
            <Text className="text-white/60 text-sm">Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-semibold text-sm">Doctor Visit Prep</Text>
          <View className="w-8" />
        </View>

        <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Visit Checklists</Text>
        <Text className="text-white text-[28px] font-semibold font-display leading-tight mb-4">
          {familyMembers.length} members
        </Text>

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

        {member && (
          <>
            {/* Progress */}
            <GlassView variant="strong" className="p-4 mb-4">
              <View className="flex-row items-center gap-3 mb-3">
                <Avatar initials={member.initials} gradient={member.avatarGradient} size={44} />
                <View className="flex-1">
                  <Text className="text-white text-base font-semibold">{member.name}</Text>
                  <Text className="text-white/50 text-xs">{doneCount}/{checklist.length} items ready</Text>
                </View>
              </View>
              <View className="h-2 bg-white/5 rounded-full overflow-hidden">
                <View className="h-full bg-medical-blue rounded-full" style={{ width: `${progress * 100}%` }} />
              </View>
            </GlassView>

            {/* Checklist */}
            <GlassView className="p-4 mb-4 gap-2">
              <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                Checklist
              </Text>
              {checklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => toggleItem(item.id)}
                  className="flex-row items-center gap-3 py-2"
                >
                  <View className={`w-5 h-5 rounded-md border items-center justify-center ${item.done ? "bg-medical-blue border-medical-blue" : "border-white/20"}`}>
                    {item.done && <Check size={12} color="#fff" />}
                  </View>
                  <Text className={`text-white text-sm flex-1 ${item.done ? "line-through opacity-50" : ""}`}>
                    {item.text}
                  </Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Trash2 size={14} color="rgba(255,255,255,0.2)" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              {/* Add item */}
              <View className="flex-row items-center gap-2 mt-2">
                <TextInput
                  value={newItem}
                  onChangeText={setNewItem}
                  placeholder="Add item..."
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  onSubmitEditing={addItem}
                  className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-white text-sm border border-white/10"
                />
                <TouchableOpacity onPress={addItem} className="w-8 h-8 rounded-full bg-medical-blue/20 items-center justify-center">
                  <Plus size={16} color="#0a84ff" />
                </TouchableOpacity>
              </View>
            </GlassView>

            {/* Notes */}
            <GlassView className="p-4 mb-6">
              <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
                Notes for Doctor
              </Text>
              <TextInput
                value={notes[selectedMemberId] || ""}
                onChangeText={(t) => setNotes((prev) => ({ ...prev, [selectedMemberId]: t }))}
                placeholder="Write questions or concerns..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10 min-h-[80px]"
              />
            </GlassView>
          </>
        )}

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
