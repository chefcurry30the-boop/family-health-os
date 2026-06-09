"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { Send, Sparkles, Lightbulb } from "lucide-react";

const suggestions = [
  "Robert's CHF med dosage is due for a refill in 3 days",
  "Emma is due for her HPV vaccine dose 2 on Dec 15",
  "James BP readings trending slightly up — schedule follow-up?",
];

const mockResponses: Record<string, string> = {
  "blood pressure": "James has had slightly elevated BP readings (138/88 avg). Dr. Patel recommended continuing Lisinopril 10mg and rechecking in 2 weeks. Sodium intake should stay under 2,300mg/day.",
  "vaccine": "Emma completed HPV dose 1 on June 15. Dose 2 is scheduled for December 15, 2024 at City Pediatric Clinic with Dr. Williams.",
  "medication": "Robert takes Metformin 500mg BID, Lasix 20mg daily AM, and Carvedilol 12.5mg BID. Metformin evening dose is pending for today.",
  "emergency": "Robert is the critical family member (78, CHF + Diabetes). Methodist Hospital ER is his designated emergency facility. Sarah is the primary emergency contact.",
};

export default function AiCopilot() {
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string }[]>([
    {
      role: "assistant",
      text: "I'm your AI Health Copilot. Ask me anything about your family's health records, medications, or upcoming appointments.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let response = "I don't have specific data on that yet. Try asking about blood pressure, medications, vaccines, or emergency info.";
      for (const key of Object.keys(mockResponses)) {
        if (lower.includes(key)) {
          response = mockResponses[key];
          break;
        }
      }
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <ScreenContainer className="flex flex-col">
      <div className="px-5 pt-3 pb-2 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight font-display text-ivory">
          AI Health Copilot
        </h1>
        <p className="text-xs text-ivory/80 mt-1">Powered by family health data</p>
      </div>

      {/* Suggestions */}
      <div className="px-5 shrink-0 space-y-2 mb-4">
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            className="w-full text-left"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => {
              setMessages((prev) => [...prev, { role: "user", text: s }]);
              setIsTyping(true);
              setTimeout(() => {
                setMessages((prev) => [
                  ...prev,
                  { role: "assistant", text: "Based on our records: " + s },
                ]);
                setIsTyping(false);
              }, 1000);
            }}
          >
            <GlassPanel className="p-2.5 flex items-start gap-2.5 hover:bg-white/[0.06] transition-colors">
              <Lightbulb size={14} className="text-amber-warn shrink-0 mt-0.5" />
              <span className="text-xs text-ivory/80 leading-snug">{s}</span>
            </GlassPanel>
          </motion.button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={msg.role + msg.text.slice(0, 20) + i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-accent/20 text-ivory"
                    : "glass-strong text-ivory/90"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="glass-strong rounded-2xl px-4 py-3 flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-ivory/40 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="shrink-0 px-5 pb-4 pt-2">
        <div className="glass-heavy rounded-full flex items-center gap-2 px-4 py-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about your family's health..."
            className="flex-1 bg-transparent text-sm text-ivory placeholder:text-ivory/50 outline-none"
          />
          <button
            onClick={handleSend}
            className="w-8 h-8 rounded-full bg-blue-accent flex items-center justify-center hover:bg-blue-accent/80 transition-colors"
            aria-label="Send"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Sparkles size={10} className="text-ivory/40" />
          <span className="text-[10px] text-ivory/40">AI suggestions are based on your family records</span>
        </div>
      </div>
    </ScreenContainer>
  );
}
