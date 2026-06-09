import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { timelineEvents as mockTimeline } from "../data/familyData";
import { GlassView } from "../components/GlassView";
import {
  ArrowLeft, Plus, X, Trash2, Stethoscope, FlaskConical,
  Siren, Pill, Activity, Tag,
} from "lucide-react-native";

const eventTypes = [
  { key: "visit" as const, label: "Visit", icon: Stethoscope, color: "#0a84ff" },
  { key: "lab" as const, label: "Lab", icon: FlaskConical, color: "#bf5af2" },
  { key: "emergency" as const, label: "Emergency", icon: Siren, color: "#ff453a" },
  { key: "rx" as const, label: "Rx", icon: Pill, color: "#ff9f0a" },
  { key: "vital" as const, label: "Vital", icon: Activity, color: "#30d158" },
];

export default function TimelineScreen() {
  const router = useRouter();
  const { timelineEvents, addTimelineEvent, removeTimelineEvent, familyMembers } = useFamilyStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "", description: "", memberName: "", type: "visit" as const, tags: "",
  });

  const events = timelineEvents.length > 0 ? timelineEvents : mockTimeline;

  const handleAdd = () => {
    if (!newEvent.title.trim()) return;
    addTimelineEvent({
      id: String(Date.now()),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      memberName: newEvent.memberName || familyMembers[0]?.name || "Family",
      title: newEvent.title.trim(),
      description: newEvent.description.trim(),
      type: newEvent.type,
      tags: newEvent.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    setNewEvent({ title: "", description: "", memberName: "", type: "visit", tags: "" });
    setShowAdd(false);
  };

  const getTypeConfig = (type: string) => eventTypes.find((t) => t.key === type) || eventTypes[0];

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between pt-2 pb-4">
            <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
              <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
              <Text className="text-white/60 text-sm">Back</Text>
            </TouchableOpacity>
            <Text className="text-white font-semibold text-sm">AI Health Timeline</Text>
            <TouchableOpacity onPress={() => setShowAdd((s) => !s)} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
              {showAdd ? <X size={16} color="rgba(255,255,255,0.6)" /> : <Plus size={16} color="rgba(255,255,255,0.6)" />}
            </TouchableOpacity>
          </View>

          <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">
            Recent Events
          </Text>
          <Text className="text-white text-[28px] font-semibold font-display leading-tight mb-4">
            {events.length} events
          </Text>

          {/* Add Form */}
          {showAdd && (
            <GlassView variant="strong" className="p-4 mb-4 gap-3">
              <TextInput
                value={newEvent.title}
                onChangeText={(t) => setNewEvent((e) => ({ ...e, title: t }))}
                placeholder="Event title"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
              />
              <TextInput
                value={newEvent.description}
                onChangeText={(t) => setNewEvent((e) => ({ ...e, description: t }))}
                placeholder="Description"
                placeholderTextColor="rgba(255,255,255,0.3)"
                multiline
                numberOfLines={2}
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
              />
              <TextInput
                value={newEvent.tags}
                onChangeText={(t) => setNewEvent((e) => ({ ...e, tags: t }))}
                placeholder="Tags (comma separated)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
              />
              {/* Type selector */}
              <View className="flex-row flex-wrap gap-2">
                {eventTypes.map((t) => (
                  <TouchableOpacity
                    key={t.key}
                    onPress={() => setNewEvent((e) => ({ ...e, type: t.key }))}
                    className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                      newEvent.type === t.key ? "bg-white/10 border-white/20" : "bg-transparent border-white/5"
                    }`}
                  >
                    <t.icon size={14} color={t.color} />
                    <Text className="text-white text-xs">{t.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={handleAdd} className="bg-medical-blue rounded-xl py-2.5 items-center">
                <Text className="text-white font-semibold text-sm">Add Event</Text>
              </TouchableOpacity>
            </GlassView>
          )}

          {/* Timeline */}
          <View className="gap-3 mb-6">
            {events.map((event, index) => {
              const typeCfg = getTypeConfig(event.type);
              const dateParts = event.date.split(" ");
              return (
                <View key={event.id} className="flex-row gap-3">
                  {/* Date column */}
                  <View className="items-center w-12">
                    <Text className="text-white font-bold text-lg">{dateParts[1]?.replace(",", "")}</Text>
                    <Text className="text-white/40 text-[10px] uppercase">{dateParts[0]}</Text>
                    {index !== events.length - 1 && (
                      <View className="w-px flex-1 bg-white/10 mt-1" />
                    )}
                  </View>

                  {/* Card */}
                  <GlassView className="flex-1 p-4">
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-1.5">
                        <View className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: typeCfg.color + "20" }}>
                          <typeCfg.icon size={12} color={typeCfg.color} />
                        </View>
                        <Text className="text-white text-sm font-semibold">{event.title}</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeTimelineEvent(event.id)}>
                        <Trash2 size={14} color="rgba(255,255,255,0.3)" />
                      </TouchableOpacity>
                    </View>
                    <Text className="text-white/60 text-xs mb-2">{event.memberName}</Text>
                    <Text className="text-white/70 text-sm leading-relaxed">{event.description}</Text>
                    {event.tags.length > 0 && (
                      <View className="flex-row flex-wrap gap-1.5 mt-2">
                        {event.tags.map((tag) => (
                          <View key={tag} className="flex-row items-center gap-1 bg-white/5 rounded-md px-2 py-1">
                            <Tag size={10} color="rgba(255,255,255,0.4)" />
                            <Text className="text-white/50 text-[10px]">{tag}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </GlassView>
                </View>
              );
            })}
          </View>

          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
