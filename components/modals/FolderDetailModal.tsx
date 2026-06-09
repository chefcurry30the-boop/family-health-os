"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFamilyStore } from "@/store/useFamilyStore";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { StatusBadge } from "@/components/design-system/StatusBadge";
import { Avatar } from "@/components/design-system/Avatar";
import {
  X,
  Activity,
  Pill,
  AlertTriangle,
  Droplets,
  Send,
  Paperclip,
  Sparkles,
  UploadCloud,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

type Tab = "profile" | "ai";

function buildMemberSystemContext(member: ReturnType<typeof useFamilyStore.getState>["familyMembers"][number]) {
  return `You are Nova Health OS AI Copilot focused on ${member.name} (${member.relation}, ${member.age}y, status: ${member.status}).

Known conditions: ${member.conditions.join(", ") || "None"}.
Allergies: ${member.allergies.join(", ") || "None"}.
Active medications: ${member.medications.join(", ") || "None"}.

Answer concisely and accurately about this patient's health. If asked about something not in the records, say you don't have that information.`;
}

export function FolderDetailModal() {
  const { selectedMemberId, closeModal, familyMembers, uploadedDocs, addUploadedDoc, removeUploadedDoc } = useFamilyStore();
  const member = familyMembers.find((m) => m.id === selectedMemberId);

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; text: string; image?: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!member) return null;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = "389b33bc433a4a0191565cc9efea295f.27M66TfkcW8YkI8wk541qYcf";
      const systemContent = buildMemberSystemContext(member);

      const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [{ type: "text", text: userMsg }];
      const imageDoc = uploadedDocs.find((d) => d.type.startsWith("image/"));
      if (imageDoc) {
        contentParts.push({ type: "image_url", image_url: { url: imageDoc.content } });
      }

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
        { role: "assistant", text: `Sorry, I encountered an error: ${message}. Please try again.` },
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
      addUploadedDoc({
        id: String(Date.now()),
        name: file.name,
        type: file.type || "application/octet-stream",
        content: `[File uploaded: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Type: ${file.type || "unknown"}.]`,
        uploadedAt: new Date().toISOString(),
      });
    }
  };

  const openFilePicker = () => fileRef.current?.click();

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <motion.div
        className="relative w-full max-h-[80%] overflow-hidden flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-navy-deep rounded-t-[32px] border-t border-white/10 flex flex-col h-full">
          {/* Handle */}
          <div className="w-10 h-1 rounded-full bg-white/30 mx-auto mt-4 mb-2 shrink-0" />

          {/* Header */}
          <div className="px-6 pt-2 pb-4 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar initials={member.initials} gradient={member.avatarGradient} size="lg" />
                <div>
                  <p className="text-lg font-semibold text-white">{member.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/90">
                      {member.relation} · {member.age} yrs
                    </span>
                    <StatusBadge status={member.status} size="sm" />
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X size={16} className="text-white/70" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-accent text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setActiveTab("ai");
                  if (messages.length === 0) {
                    setMessages([
                      {
                        role: "assistant",
                        text: `I'm focused on ${member.name}'s health records. Ask me anything about their conditions, medications, or upload a document to analyze.`,
                      },
                    ]);
                  }
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === "ai"
                    ? "bg-blue-accent text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10"
                }`}
              >
                <Sparkles size={12} />
                AI Chat
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <AnimatePresence mode="wait">
              {activeTab === "profile" ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Vitals */}
                  <GlassPanel className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={16} className="text-blue-accent" />
                      <span className="text-sm font-semibold text-white">Vitals</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {member.vitals.map((vital) => (
                        <div key={vital.label} className="bg-white/5 rounded-xl p-3">
                          <p className="text-[10px] text-white/80 uppercase tracking-wider mb-1">{vital.label}</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-bold text-white">{vital.value}</span>
                            <span className="text-xs text-white/90">{vital.unit}</span>
                          </div>
                          {vital.trend && (
                            <span className="text-xs font-medium" style={{ color: vital.trendColor }}>
                              {vital.trend}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </GlassPanel>

                  {/* Conditions */}
                  <GlassPanel className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle size={16} className="text-amber-warn" />
                      <span className="text-sm font-semibold text-white">Conditions</span>
                    </div>
                    <div className="space-y-2">
                      {member.conditions.length > 0 ? (
                        member.conditions.map((condition) => (
                          <div key={condition} className="text-sm text-white/90 py-2 border-b border-white/5 last:border-0">
                            {condition}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/60">No conditions recorded.</p>
                      )}
                    </div>
                  </GlassPanel>

                  {/* Allergies */}
                  <GlassPanel className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Droplets size={16} className="text-red-light" />
                      <span className="text-sm font-semibold text-white">Allergies</span>
                    </div>
                    <div className="space-y-2">
                      {member.allergies.length > 0 ? (
                        member.allergies.map((allergy) => (
                          <div key={allergy} className="text-sm text-white/90 py-2 border-b border-white/5 last:border-0">
                            {allergy}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/60">No allergies recorded.</p>
                      )}
                    </div>
                  </GlassPanel>

                  {/* Medications */}
                  <GlassPanel className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Pill size={16} className="text-purple-accent" />
                      <span className="text-sm font-semibold text-white">Medications</span>
                    </div>
                    <div className="space-y-2">
                      {member.medications.length > 0 ? (
                        member.medications.map((med) => (
                          <div key={med} className="text-sm text-white/90 py-2 border-b border-white/5 last:border-0">
                            {med}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-white/60">No medications recorded.</p>
                      )}
                    </div>
                  </GlassPanel>
                </motion.div>
              ) : (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={`${msg.role}-${i}`}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user" ? "bg-blue-accent/20 text-white" : "glass-strong text-white/95"
                          }`}
                        >
                          {msg.image && (
                            <img src={msg.image} alt="uploaded" className="rounded-lg mb-2 max-h-32 object-cover" />
                          )}
                          {msg.text}
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                  </div>

                  {/* Upload banner */}
                  <div className="shrink-0 mb-2">
                    <button
                      onClick={openFilePicker}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <UploadCloud size={14} className="text-blue-accent" />
                      <span className="text-xs font-medium text-white/90">Upload Document (OCR)</span>
                      <span className="text-[10px] text-white/60">Images, PDFs, TXT</span>
                    </button>
                    {uploadedDocs.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto mt-2">
                        {uploadedDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="shrink-0 flex items-center gap-1.5 bg-white/10 rounded-full pl-2 pr-1 py-1 text-xs text-white/90"
                          >
                            {doc.type.startsWith("image/") ? <ImageIcon size={12} /> : <FileText size={12} />}
                            <span className="max-w-[80px] truncate">{doc.name}</span>
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
                  <div className="shrink-0">
                    <div className="glass-heavy rounded-full flex items-center gap-2 px-4 py-2">
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
                        className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
                        aria-label="Attach file"
                      >
                        <Paperclip size={14} className="text-white/70" />
                      </button>
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        placeholder={`Ask about ${member.name}...`}
                        className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
                      />
                      <button
                        onClick={handleSend}
                        className="w-8 h-8 rounded-full bg-blue-accent flex items-center justify-center hover:bg-blue-accent/80 transition-colors shrink-0"
                        aria-label="Send"
                      >
                        <Send size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
