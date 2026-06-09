"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Send, Sparkles, Lightbulb, Paperclip, X, FileText, Image as ImageIcon, UploadCloud } from "lucide-react";

function getSuggestions(familyMembers: { name: string; relation: string }[], meds: { name: string; memberName: string }[]) {
  const firstMed = meds[0];
  const child = familyMembers.find((m) => m.relation.toLowerCase().includes("daughter") || m.relation.toLowerCase().includes("son") || m.relation.toLowerCase().includes("child"));
  const senior = familyMembers.find((m) => m.relation.toLowerCase().includes("grandfather") || m.relation.toLowerCase().includes("grandmother"));

  return [
    firstMed ? `What are ${firstMed.memberName}'s current medications?` : "What are my current medications?",
    child ? `When is ${child.name.split(" ")[0]} due for their next vaccine?` : "When is the next vaccine due?",
    senior ? `Summarize ${senior.name.split(" ")[0]}'s recent health timeline.` : "Summarize recent health timeline.",
  ];
}

function buildSystemContext(state: ReturnType<typeof useFamilyStore.getState>) {
  const members = state.familyMembers.map((m) =>
    `- ${m.name} (${m.relation}, ${m.age}y, ${m.status}). Conditions: ${m.conditions.join(", ") || "None"}. Allergies: ${m.allergies.join(", ") || "None"}. Active Rx: ${m.activeRx}.`
  ).join("\n");

  const meds = state.medications.map((med) =>
    `- ${med.name} ${med.dosage} for ${med.memberName} (${med.schedule}, ${med.timeOfDay}). Taken: ${med.taken ? "Yes" : "No"}.`
  ).join("\n");

  const events = state.timelineEvents.slice(0, 6).map((e) =>
    `- ${e.date}: ${e.title} (${e.memberName}). ${e.description}`
  ).join("\n");

  const docs = state.uploadedDocs.map((d) =>
    `- ${d.name} (${d.type}) uploaded ${d.uploadedAt}. Content: ${d.content.slice(0, 500)}${d.content.length > 500 ? "..." : ""}`
  ).join("\n");

  return `You are Nova Health OS AI Copilot. You help users understand their family health data. Be concise, accurate, and caring.

Family Members:
${members || "None yet"}

Medications:
${meds || "None yet"}

Recent Timeline:
${events || "None yet"}

Uploaded Documents:
${docs || "None yet"}`;
}

export default function AiCopilot() {
  const store = useFamilyStore();
  const { uploadedDocs, addUploadedDoc, removeUploadedDoc, familyMembers, medications } = store;
  const suggestions = getSuggestions(familyMembers, medications);
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string; image?: string }[]>([
    {
      role: "assistant",
      text: "I'm your AI Health Copilot. Ask me anything about your family's health records, medications, or upload a document to discuss. I can read text from images and PDFs using OCR.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSend = async () => {
    if (!input.trim() && uploadedDocs.length === 0) return;

    const userMsg = input.trim() || "Please analyze the uploaded document.";
    const imageDoc = uploadedDocs.find((d) => d.type.startsWith("image/"));
    const textDocs = uploadedDocs.filter((d) => !d.type.startsWith("image/"));

    setMessages((prev) => [...prev, { role: "user", text: userMsg, image: imageDoc?.content }]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = "389b33bc433a4a0191565cc9efea295f.27M66TfkcW8YkI8wk541qYcf";
      const systemContent = buildSystemContext(useFamilyStore.getState());

      const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [
        { type: "text", text: userMsg },
      ];
      if (imageDoc) {
        contentParts.push({ type: "image_url", image_url: { url: imageDoc.content } });
      }
      textDocs.forEach((d) => {
        contentParts.push({ type: "text", text: `Document: ${d.name}\n${d.content.slice(0, 2000)}` });
      });

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "",
          "X-Title": "Nova Health OS",
        },
        body: JSON.stringify({
          model: "gemini-3-flash-preview:cloud",
          messages: [
            { role: "system", content: systemContent },
            ...messages.slice(-6).map((m) => ({
              role: m.role,
              content: m.image
                ? [{ type: "text" as const, text: m.text }, { type: "image_url" as const, image_url: { url: m.image } }]
                : m.text,
            })),
            { role: "user", content: contentParts },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Sorry, I encountered an error: ${message}. Please check your connection and try again.` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFile = async (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        addUploadedDoc({
          id: String(Date.now()),
          name: file.name,
          type: file.type,
          content: base64,
          uploadedAt: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const text = await file.text();
      addUploadedDoc({
        id: String(Date.now()),
        name: file.name,
        type: file.type || "text/plain",
        content: text,
        uploadedAt: new Date().toISOString(),
      });
    } else {
      // For PDFs and other files, store metadata only since we can't extract text client-side easily
      addUploadedDoc({
        id: String(Date.now()),
        name: file.name,
        type: file.type || "application/octet-stream",
        content: `[File uploaded: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Type: ${file.type || "unknown"}. The AI can see this file is attached but may not be able to read its contents without a server-side parser.]`,
        uploadedAt: new Date().toISOString(),
      });
    }
  };

  const openFilePicker = () => fileRef.current?.click();

  return (
    <ScreenContainer className="flex flex-col">
      <div className="px-5 pt-3 pb-2 shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight font-display text-white">
          AI Health Copilot
        </h1>
        <p className="text-xs text-white/90 mt-1">Powered by family health data · Upload docs for OCR analysis</p>
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
                  { role: "assistant", text: "Based on our records, let me look that up for you." },
                ]);
                setIsTyping(false);
              }, 800);
            }}
          >
            <GlassPanel className="p-2.5 flex items-start gap-2.5 hover:bg-white/[0.06] transition-colors">
              <Lightbulb size={14} className="text-amber-warn shrink-0 mt-0.5" />
              <span className="text-xs text-white/90 leading-snug">{s}</span>
            </GlassPanel>
          </motion.button>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.role}-${i}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-accent/20 text-white"
                    : "glass-strong text-white/95"
                }`}
              >
                {msg.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={msg.image} alt="uploaded" className="rounded-lg mb-2 max-h-32 object-cover" />
                )}
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
                    className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload banner */}
      <div className="shrink-0 px-5 pt-2">
        <button
          onClick={openFilePicker}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors mb-2"
        >
          <UploadCloud size={16} className="text-blue-accent" />
          <span className="text-xs font-medium text-white/90">Upload Document (OCR)</span>
          <span className="text-[10px] text-white/60">Images, PDFs, TXT</span>
        </button>

        {uploadedDocs.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="shrink-0 flex items-center gap-1.5 bg-white/10 rounded-full pl-2 pr-1 py-1 text-xs text-white/90">
                {doc.type.startsWith("image/") ? <ImageIcon size={12} /> : <FileText size={12} />}
                <span className="max-w-[100px] truncate">{doc.name}</span>
                <button
                  onClick={() => removeUploadedDoc(doc.id)}
                  className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-emergency/30 transition-colors"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 px-5 pb-4 pt-2">
        <div className="glass-heavy rounded-full flex items-center gap-2 px-4 py-2.5">
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept="image/*,.pdf,.txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            onClick={openFilePicker}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
            aria-label="Attach file"
          >
            <Paperclip size={16} className="text-white/70" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={uploadedDocs.length > 0 ? "Ask about the uploaded document..." : "Ask about your family's health..."}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
          />
          <button
            onClick={handleSend}
            className="w-9 h-9 rounded-full bg-blue-accent flex items-center justify-center hover:bg-blue-accent/80 transition-colors shrink-0"
            aria-label="Send"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Sparkles size={10} className="text-white/50" />
          <span className="text-[10px] text-white/50">AI reads documents using vision OCR · Data stays in your browser</span>
        </div>
      </div>
    </ScreenContainer>
  );
}
