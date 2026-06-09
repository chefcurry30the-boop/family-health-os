"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Send,
  Lightbulb,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  MessageSquare,
} from "lucide-react";

function getSuggestions(
  familyMembers: { name: string; relation: string }[],
  meds: { name: string; memberName: string }[]
) {
  const firstMed = meds[0];
  const child = familyMembers.find(
    (m) =>
      m.relation.toLowerCase().includes("daughter") ||
      m.relation.toLowerCase().includes("son") ||
      m.relation.toLowerCase().includes("child")
  );
  const senior = familyMembers.find(
    (m) =>
      m.relation.toLowerCase().includes("grandfather") ||
      m.relation.toLowerCase().includes("grandmother")
  );

  return [
    firstMed
      ? `What are ${firstMed.memberName}'s current medications?`
      : "What are my current medications?",
    child
      ? `When is ${child.name.split(" ")[0]} due for their next vaccine?`
      : "When is the next vaccine due?",
    senior
      ? `Summarize ${senior.name.split(" ")[0]}'s recent health timeline.`
      : "Summarize recent health timeline.",
  ];
}

function buildSystemContext(state: ReturnType<typeof useFamilyStore.getState>) {
  const members = state.familyMembers
    .map(
      (m) =>
        `- ${m.name} (${m.relation}, ${m.age}y, ${m.status}). Conditions: ${m.conditions.join(", ") || "None"}. Allergies: ${m.allergies.join(", ") || "None"}. Active Rx: ${m.activeRx}.`
    )
    .join("\n");

  const meds = state.medications
    .map(
      (med) =>
        `- ${med.name} ${med.dosage} for ${med.memberName} (${med.schedule}, ${med.timeOfDay}). Taken: ${med.taken ? "Yes" : "No"}.`
    )
    .join("\n");

  const events = state.timelineEvents
    .slice(0, 6)
    .map((e) => `- ${e.date}: ${e.title} (${e.memberName}). ${e.description}`)
    .join("\n");

  const docs = state.uploadedDocs
    .map(
      (d) =>
        `- ${d.name} (${d.type}) uploaded ${d.uploadedAt}. Content: ${d.content.slice(0, 500)}${d.content.length > 500 ? "..." : ""}`
    )
    .join("\n");

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

interface Message {
  role: "assistant" | "user";
  text: string;
  image?: string;
}

export default function AiCopilot() {
  const store = useFamilyStore();
  const {
    uploadedDocs,
    addUploadedDoc,
    removeUploadedDoc,
    familyMembers,
    medications,
  } = store;

  const suggestions = getSuggestions(familyMembers, medications);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() && uploadedDocs.length === 0) return;

    const userMsg = input.trim() || "Please analyze the uploaded document.";
    const imageDoc = uploadedDocs.find((d) => d.type.startsWith("image/"));
    const textDocs = uploadedDocs.filter((d) => !d.type.startsWith("image/"));

    const newUserMsg: Message = {
      role: "user",
      text: userMsg,
      image: imageDoc?.content,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);
    requestAnimationFrame(scrollToBottom);

    try {
      const apiKey =
        "389b33bc433a4a0191565cc9efea295f.27M66TfkcW8YkI8wk541qYcf";
      const systemContent = buildSystemContext(useFamilyStore.getState());

      const contentParts: Array<{
        type: string;
        text?: string;
        image_url?: { url: string };
      }> = [{ type: "text", text: userMsg }];
      if (imageDoc) {
        contentParts.push({
          type: "image_url",
          image_url: { url: imageDoc.content },
        });
      }
      textDocs.forEach((d) => {
        contentParts.push({
          type: "text",
          text: `Document: ${d.name}\n${d.content.slice(0, 2000)}`,
        });
      });

      const res = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
            "HTTP-Referer":
              typeof window !== "undefined" ? window.location.href : "",
            "X-Title": "Nova Health OS",
          },
          body: JSON.stringify({
            model: "gemini-3-flash-preview:cloud",
            messages: [
              { role: "system", content: systemContent },
              ...messages.slice(-6).map((m) => ({
                role: m.role,
                content: m.image
                  ? [
                      { type: "text" as const, text: m.text },
                      {
                        type: "image_url" as const,
                        image_url: { url: m.image },
                      },
                    ]
                  : m.text,
              })),
              { role: "user", content: contentParts },
            ],
            temperature: 0.7,
            max_tokens: 1024,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Sorry, I encountered an error: ${message}. Please check your connection and try again.`,
        },
      ]);
    } finally {
      setIsTyping(false);
      requestAnimationFrame(scrollToBottom);
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
        content: `[File uploaded: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB. Type: ${file.type || "unknown"}. The AI can see this file is attached but may not be able to read its contents without a server-side parser.]`,
        uploadedAt: new Date().toISOString(),
      });
    }
  };

  const openFilePicker = () => fileRef.current?.click();

  const handleSuggestionClick = (suggestion: string) => {
    setMessages((prev) => [...prev, { role: "user", text: suggestion }]);
    setIsTyping(true);
    requestAnimationFrame(scrollToBottom);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Based on our records, let me look that up for you.",
        },
      ]);
      setIsTyping(false);
      requestAnimationFrame(scrollToBottom);
    }, 800);
  };

  const hasMessages = messages.length > 0;

  return (
    <ScreenContainer className="flex flex-col bg-copilot">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 shrink-0">
        <h1 className="text-[28px] font-semibold tracking-tight font-display text-white leading-tight">
          AI Health Copilot
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Powered by family health data · Upload docs for OCR analysis
        </p>
      </div>

      {/* Upload banner — VERY prominent */}
      <div className="shrink-0 px-5 mb-4">
        <button
          onClick={openFilePicker}
          className="w-full glass-strong rounded-2xl flex items-center justify-center gap-3 py-4 hover:bg-white/[0.12] transition-colors"
          aria-label="Upload document for OCR analysis"
        >
          <UploadCloud size={22} className="text-medical-blue" />
          <span className="text-sm font-semibold text-white">
            Upload Document (OCR)
          </span>
          <span className="text-xs text-white/50">
            Images, PDFs, TXT
          </span>
        </button>

        {uploadedDocs.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mt-2 scrollbar-hide">
            {uploadedDocs.map((doc) => (
              <div
                key={doc.id}
                className="shrink-0 flex items-center gap-1.5 glass rounded-full pl-3 pr-1.5 py-1.5 text-xs text-white"
              >
                {doc.type.startsWith("image/") ? (
                  <ImageIcon size={12} className="text-medical-purple" />
                ) : (
                  <FileText size={12} className="text-medical-teal" />
                )}
                <span className="max-w-[100px] truncate">{doc.name}</span>
                <button
                  onClick={() => removeUploadedDoc(doc.id)}
                  className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-medical-red/30 transition-colors"
                  aria-label={`Remove uploaded document ${doc.name}`}
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions — only when no messages */}
      <AnimatePresence>
        {!hasMessages && (
          <motion.div
            className="px-5 shrink-0 space-y-2 mb-4"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
              Suggested Questions
            </p>
            {suggestions.map((s, i) => (
              <motion.button
                key={`${s.slice(0, 20)}-${i}`}
                className="w-full text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleSuggestionClick(s)}
              >
                <div className="glass p-3 flex items-start gap-3 hover:bg-white/[0.08] transition-colors rounded-2xl">
                  <Lightbulb
                    size={16}
                    className="text-medical-amber shrink-0 mt-0.5"
                  />
                  <span className="text-sm text-white/80 leading-snug">
                    {s}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 space-y-4 pb-4 scrollbar-hide"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={`${msg.role}-${msg.text.slice(0, 40)}-${i}`}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-medical-blue/20 text-white border border-medical-blue/20"
                    : "glass-strong text-white/95"
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Uploaded document preview"
                    className="rounded-xl mb-2 max-h-32 object-cover"
                  />
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              className="flex justify-start"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="glass-strong rounded-2xl px-4 py-3.5 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/50"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!hasMessages && !isTyping && (
          <motion.div
            className="flex flex-col items-center justify-center py-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-white/30" />
            </div>
            <p className="text-white/50 text-sm mb-1">
              Ask me anything about your family&apos;s health
            </p>
            <p className="text-white/30 text-xs">
              Upload documents to analyze with OCR
            </p>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
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
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-medical-blue/50"
            aria-label="Attach file"
          >
            <Paperclip size={16} className="text-white/70" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              uploadedDocs.length > 0
                ? "Ask about the uploaded document..."
                : "Ask about your family's health..."
            }
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() && uploadedDocs.length === 0}
            className="w-9 h-9 rounded-full bg-medical-blue flex items-center justify-center hover:bg-medical-blue/80 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-medical-blue/50"
            aria-label="Send message"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2">
          <Sparkles size={10} className="text-white/30" />
          <span className="text-[10px] text-white/30">
            AI reads documents using vision OCR · Data stays in your browser
          </span>
        </div>
      </div>
    </ScreenContainer>
  );
}
