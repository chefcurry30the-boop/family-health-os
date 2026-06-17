import { useState, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
  import { useRouter } from "expo-router";
  import { useFamilyStore, type ChatMessage } from "../store/useFamilyStore";
  import { GlassView } from "../components/GlassView";
  import {
    ArrowLeft, Send, Sparkles, User, Bot, X,
  } from "lucide-react-native";

const suggestions = [
  "What's Robert's medication schedule?",
  "Log a headache for James",
  "Add ₹500 pharmacy expense",
  "When is Emma's next vaccine due?",
];

function buildSystemPrompt(state: ReturnType<typeof useFamilyStore.getState>) {
  const members = state.familyMembers.map((m) =>
    `${m.name} (${m.relation}, ${m.age}y, ${m.status}): conditions=[${m.conditions.join(", ")}], allergies=[${m.allergies.join(", ")}], meds=[${m.medications.join(", ")}]`
  ).join("\n");
  const meds = state.medications.map((med) => `${med.name} ${med.dosage} for ${med.memberName} — ${med.schedule}`).join("\n");
  return `You are Nova Health AI, a family health assistant. You have access to these tools via [[TOOL_CALL]] blocks:\n\n` +
    `add_medication, update_medication, remove_medication,\n` +
    `add_journal_entry, update_journal_entry, remove_journal_entry,\n` +
    `add_expense, update_expense, remove_expense,\n` +
    `add_timeline_event, schedule_reminder\n\n` +
    `Family members:\n${members}\n\n` +
    `Medications:\n${meds}\n\n` +
    `When the user asks to modify data, ALWAYS respond with a friendly message AND a [[TOOL_CALL]] block containing the JSON action.`;
}

function parseToolCalls(text: string) {
  const regex = /\[\[TOOL_CALL\]\]([\s\S]*?)\[\[\/TOOL_CALL\]\]/g;
  const tools: any[] = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    try { tools.push(JSON.parse(m[1])); } catch {}
  }
  return tools;
}

export default function CopilotScreen() {
  const router = useRouter();
  const store = useFamilyStore();
  const { chatMessages, addChatMessage, familyMembers, medications } = store;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(chatMessages.length === 0);
  const scrollRef = useRef<ScrollView>(null);

  const executeToolCalls = (tools: any[]) => {
    const state = useFamilyStore.getState();
    for (const tool of tools) {
      const { action, data } = tool;
      switch (action) {
        case "add_medication": state.addMedication(data); break;
        case "update_medication": state.updateMedication(data.id, data); break;
        case "remove_medication": state.removeMedication(data.id); break;
        case "add_journal_entry": state.addJournalEntry(data); break;
        case "update_journal_entry": state.updateJournalEntry(data.id, data); break;
        case "remove_journal_entry": state.removeJournalEntry(data.id); break;
        case "add_expense": state.addExpense(data); break;
        case "update_expense": state.updateExpense(data.id, data); break;
        case "remove_expense": state.removeExpense(data.id); break;
        case "add_timeline_event": state.addTimelineEvent(data); break;
        case "schedule_reminder": break; // no-op for now
      }
    }
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || loading) return;
    setInput("");
    setShowSuggestions(false);

    const userMsg: ChatMessage = {
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(userMsg);
    setLoading(true);

    try {
      const messages = [
        { role: "system", content: buildSystemPrompt(store) },
        ...chatMessages.map((m) => ({ role: m.role, content: m.text })),
        { role: "user", content: text },
      ];

      const res = await fetch("http://localhost:11434/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini-3-flash-preview:cloud",
          messages,
          temperature: 0.7,
        }),
      });

      const json = await res.json();
      const reply = json.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

      const tools = parseToolCalls(reply);
      if (tools.length > 0) executeToolCalls(tools);

      const cleanReply = reply.replace(/\[\[TOOL_CALL\]\][\s\S]*?\[\[\/TOOL_CALL\]\]/g, "").trim();

      addChatMessage({
        role: "assistant",
        text: cleanReply || "Done!",
        timestamp: new Date().toISOString(),
      });
    } catch {
      addChatMessage({
        role: "assistant",
        text: "I'm offline right now. Make sure Ollama is running on your network.",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-3 border-b border-white/5">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
            <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
            <Text className="text-white/60 text-sm">Back</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-1.5">
            <Sparkles size={16} color="#bf5af2" />
            <Text className="text-white font-semibold text-sm">AI Copilot</Text>
          </View>
          <View className="w-12" />
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {/* Empty state / Suggestions */}
          {showSuggestions && chatMessages.length === 0 && (
            <View className="items-center py-10">
              <View className="w-16 h-16 rounded-full bg-medical-purple/10 items-center justify-center mb-4">
                <Bot size={28} color="#bf5af2" />
              </View>
              <Text className="text-white text-lg font-semibold mb-1">AI Health Copilot</Text>
              <Text className="text-white/50 text-sm text-center mb-6 px-4">
                Ask me anything about your family's health. I can read records, log symptoms, add expenses, and more.
              </Text>
              <View className="w-full gap-2">
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s}
                    onPress={() => handleSend(s)}
                    className="bg-white/5 rounded-xl px-4 py-3 border border-white/10"
                  >
                    <Text className="text-white/80 text-sm">{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Chat bubbles */}
          <View className="gap-3 py-4">
            {chatMessages.map((msg, i) => (
              <View
                key={`${msg.role}-${i}-${msg.timestamp}`}
                className={`flex-row ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <View
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-medical-blue"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <View className="flex-row items-center gap-1.5 mb-1">
                    {msg.role === "assistant" ? (
                      <>
                        <Bot size={12} color="#bf5af2" />
                        <Text className="text-medical-purple text-[10px] font-semibold">Nova AI</Text>
                      </>
                    ) : (
                      <>
                        <User size={12} color="#64d2ff" />
                        <Text className="text-medical-blue-light text-[10px] font-semibold">You</Text>
                      </>
                    )}
                  </View>
                  <Text className={`text-sm leading-relaxed ${msg.role === "user" ? "text-white" : "text-white/80"}`}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
            {loading && (
              <View className="flex-row justify-start">
                <GlassView className="px-4 py-3">
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#bf5af2" />
                    <Text className="text-white/50 text-xs">Thinking...</Text>
                  </View>
                </GlassView>
              </View>
            )}
          </View>

          <View className="h-4" />
        </ScrollView>

        {/* Input bar */}
        <View className="px-4 py-3 border-t border-white/5">
          <View className="flex-row items-center gap-2">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask about your family's health..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              maxLength={500}
              className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white text-sm border border-white/10 max-h-[100px]"
              textAlignVertical="center"
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              onPress={() => handleSend()}
              disabled={!input.trim() || loading}
              className={`w-10 h-10 rounded-full items-center justify-center ${input.trim() ? "bg-medical-blue" : "bg-white/5"}`}
            >
              <Send size={18} color={input.trim() ? "#fff" : "rgba(255,255,255,0.3)"} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
