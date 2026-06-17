import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { journalEntries as mockJournal } from "../data/familyData";
import { GlassView } from "../components/GlassView";
import {
  ArrowLeft, Plus, X, Trash2, Tag, PenLine,
} from "lucide-react-native";

const moods = [
  { key: "great" as const, emoji: "🌟", label: "Great", color: "#30d158" },
  { key: "good" as const, emoji: "😊", label: "Good", color: "#5fc9f8" },
  { key: "okay" as const, emoji: "😐", label: "Okay", color: "#ff9f0a" },
  { key: "unwell" as const, emoji: "😷", label: "Unwell", color: "#ff375f" },
  { key: "bad" as const, emoji: "🤒", label: "Bad", color: "#ff453a" },
];

export default function JournalScreen() {
  const router = useRouter();
  const { journalEntries, addJournalEntry, removeJournalEntry } = useFamilyStore();
  const [showAdd, setShowAdd] = useState(false);
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [mood, setMood] = useState<"great" | "good" | "okay" | "unwell" | "bad">("okay");

  const entries = journalEntries.length > 0 ? journalEntries : mockJournal;

  const handleAdd = () => {
    if (!text.trim()) return;
    const now = new Date();
    addJournalEntry({
      id: String(Date.now()),
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      text: text.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      mood,
    });
    setText("");
    setTags("");
    setMood("okay");
    setShowAdd(false);
  };

  const getMoodConfig = (m: string) => moods.find((x) => x.key === m) || moods[2];

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
            <Text className="text-white font-semibold text-sm">Symptom Journal</Text>
            <TouchableOpacity onPress={() => setShowAdd((s) => !s)} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
              {showAdd ? <X size={16} color="rgba(255,255,255,0.6)" /> : <Plus size={16} color="rgba(255,255,255,0.6)" />}
            </TouchableOpacity>
          </View>

          <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Entries</Text>
          <Text className="text-white text-[28px] font-semibold font-display leading-tight mb-4">
            {entries.length} recorded
          </Text>

          {/* Add form */}
          {showAdd && (
            <GlassView variant="strong" className="p-4 mb-4 gap-3">
              {/* Mood selector */}
              <View className="flex-row gap-2">
                {moods.map((m) => (
                  <TouchableOpacity
                    key={m.key}
                    onPress={() => setMood(m.key)}
                    className={`flex-1 items-center py-2 rounded-xl border ${mood === m.key ? "bg-white/10 border-white/20" : "border-white/5"}`}
                  >
                    <Text className="text-xl">{m.emoji}</Text>
                    <Text className="text-white text-[10px] mt-0.5">{m.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                value={text} onChangeText={setText}
                placeholder="How are you feeling today?"
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline numberOfLines={4}
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
                textAlignVertical="top"
              />
              <TextInput
                value={tags} onChangeText={setTags}
                placeholder="Tags (comma separated)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
              />
              <TouchableOpacity onPress={handleAdd} className="bg-medical-teal rounded-xl py-2.5 items-center">
                <Text className="text-white font-semibold text-sm">Add Entry</Text>
              </TouchableOpacity>
            </GlassView>
          )}

          {/* Entries */}
          <View className="gap-2 mb-6">
            {entries.map((entry) => {
              const mc = getMoodConfig(entry.mood);
              return (
                <GlassView key={entry.id} className="p-4">
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2">
                      <Text className="text-lg">{mc.emoji}</Text>
                      <Text className="text-white/50 text-xs">{entry.date} · {entry.time}</Text>
                    </View>
                    <TouchableOpacity onPress={() => removeJournalEntry(entry.id)}>
                      <Trash2 size={14} color="rgba(255,255,255,0.3)" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-white/80 text-sm leading-relaxed">{entry.text}</Text>
                  {entry.tags.length > 0 && (
                    <View className="flex-row flex-wrap gap-1.5 mt-2">
                      {entry.tags.map((tag) => (
                        <View key={tag} className="flex-row items-center gap-1 bg-white/5 rounded-md px-2 py-1">
                          <Tag size={10} color="rgba(255,255,255,0.4)" />
                          <Text className="text-white/50 text-[10px]">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </GlassView>
              );
            })}
            {entries.length === 0 && (
              <Text className="text-white/30 text-xs text-center py-6">No journal entries yet.</Text>
            )}
          </View>

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
