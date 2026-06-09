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

const OLLAMA_BASE = "http://localhost:11434";
const OLLAMA_MODEL = "gemini-3-flash-preview:cloud";

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
      ? `Mark ${firstMed.memberName}'s ${firstMed.name} as taken`
      : "Mark my first medication as taken",
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
        `- ID: ${med.id} | ${med.name} ${med.dosage} for ${med.memberName} (${med.schedule}, ${med.timeOfDay}). Taken: ${med.taken ? "Yes" : "No"}.`
    )
    .join("\n");

  const journal = state.journalEntries
    .slice(0, 6)
    .map((e) => `- ID: ${e.id} | ${e.date} ${e.time}: ${e.text.slice(0, 80)}${e.text.length > 80 ? "..." : ""} [mood: ${e.mood}, tags: ${e.tags.join(", ")}]`)
    .join("\n");

  const expenses = state.expenses
    .slice(0, 6)
    .map((e) => `- ID: ${e.id} | ${e.description}: ₹${e.amount} on ${e.date} [category: ${e.category}]`)
    .join("\n");

  const events = state.timelineEvents
    .slice(0, 6)
    .map((e) => `- ${e.date}: ${e.title} (${e.memberName}). ${e.description}`)
    .join("\n");

  const docs = state.uploadedDocs
    .map((d) => {
      const preview = d.ocrText || d.content.slice(0, 500);
      return `- ${d.name} (${d.type}) uploaded ${d.uploadedAt}. Content: ${preview}${preview.length > 500 ? "..." : ""}`;
    })
    .join("\n");

  return `You are Nova Health OS AI Copilot. You help users understand and manage their family health data. Be concise, accurate, and caring.

FAMILY MEMBERS:
${members || "None yet"}

MEDICATIONS (with IDs):
${meds || "None yet"}

JOURNAL ENTRIES (with IDs):
${journal || "None yet"}

EXPENSES (with IDs):
${expenses || "None yet"}

RECENT TIMELINE:
${events || "None yet"}

UPLOADED DOCUMENTS:
${docs || "None yet"}

---

TOOL INSTRUCTIONS:
You can EDIT existing data by outputting a tool call block. When the user asks to change, update, mark, edit, or modify something, use the appropriate tool instead of just talking about it.

Available tools:
1. update_medication — Update fields on a medication by ID.
   Fields: name, dosage, schedule, timeOfDay, taken (boolean), takenTime
   Example: Mark James's Lisinopril as taken → update_medication id=lisinopril taken=true

2. update_journal_entry — Update a journal entry by ID.
   Fields: text, tags (array), mood (great/good/okay/unwell/bad)
   Example: Edit journal entry to add "headache" tag → update_journal_entry id=1 tags=["Headache","Stress"]

3. update_expense — Update an expense by ID.
   Fields: description, amount (number), date, category
   Example: Change expense amount → update_expense id=1 amount=-500

TOOL CALL FORMAT — wrap exactly like this:
[[TOOL_CALL]]
{"tool": "update_medication", "id": "lisinopril", "updates": {"taken": true}}
[[/TOOL_CALL]]

You may emit multiple tool calls in one response. After tools run, you will receive confirmation. Do NOT mention you cannot edit data — you absolutely can via these tools.`;
}

interface Message {
  role: "assistant" | "user";
  text: string;
  image?: string;
}

function executeToolCalls(text: string): { success: boolean; logs: string[] } {
  const logs: string[] = [];
  const regex = /\[\[TOOL_CALL\]\]([\s\S]*?)\[\[\/TOOL_CALL\]\]/g;
  let match;
  let found = false;

  while ((match = regex.exec(text)) !== null) {
    found = true;
    try {
      const payload = JSON.parse(match[1].trim());
      const { tool, id, updates } = payload;

      if (tool === "update_medication") {
        useFamilyStore.getState().updateMedication(id, updates);
        logs.push(`Updated medication ${id}: ${JSON.stringify(updates)}`);
      } else if (tool === "update_journal_entry") {
        useFamilyStore.getState().updateJournalEntry(id, updates);
        logs.push(`Updated journal entry ${id}: ${JSON.stringify(updates)}`);
      } else if (tool === "update_expense") {
        useFamilyStore.getState().updateExpense(id, updates);
        logs.push(`Updated expense ${id}: ${JSON.stringify(updates)}`);
      } else {
        logs.push(`Unknown tool: ${tool}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "parse error";
      logs.push(`Tool call failed: ${msg}`);
    }
  }

  return { success: found && logs.every((l) => !l.includes("failed") && !l.includes("Unknown")), logs };
}

function stripToolCalls(text: string): string {
  return text.replace(/\[\[TOOL_CALL\]\][\s\S]*?\[\[\/TOOL_CALL\]\]/g, "").trim();
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
  const [ocrStatus, setOcrStatus] = useState<string | null>(null);
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

      const res = await fetch(`${OLLAMA_BASE}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
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
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data = await res.json();
      const reply =
        data.choices?.[0]?.message?.content ||
        "I couldn't generate a response. Please try again.";

      // Check for tool calls in the AI response
      const toolResult = executeToolCalls(reply);
      const cleanReply = stripToolCalls(reply);

      if (toolResult.success) {
        // Execute tools succeeded — append confirmation inline
        const confirmation = toolResult.logs.map((l) => `✓ ${l}`).join("\n");
        const fullReply = cleanReply
          ? `${cleanReply}\n\n━━━ Edits applied ━━━\n${confirmation}`
          : `Done. I've updated the data:\n${confirmation}`;
        setMessages((prev) => [...prev, { role: "assistant", text: fullReply }]);
      } else if (toolResult.logs.length > 0) {
        // Tools were attempted but some failed
        const failText = toolResult.logs.join("\n");
        const fullReply = cleanReply
          ? `${cleanReply}\n\n⚠ Some edits failed:\n${failText}`
          : `Some edits failed:\n${failText}`;
        setMessages((prev) => [...prev, { role: "assistant", text: fullReply }]);
      } else {
        // No tools — normal reply
        setMessages((prev) => [...prev, { role: "assistant", text: cleanReply || reply }]);
      }
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
      reader.onload = async () => {
        const base64 = reader.result as string;
        const docId = String(Date.now());
        addUploadedDoc({
          id: docId,
          name: file.name,
          type: file.type,
          content: base64,
          uploadedAt: new Date().toISOString(),
        });

        // Run Tesseract OCR in background
        setOcrStatus(`Reading ${file.name}...`);
        try {
          const tesseract = await import("tesseract.js");
          const result = await tesseract.recognize(base64, "eng");
          const ocrText = result.data.text.trim();
          if (ocrText) {
            // Update the doc with OCR text
            useFamilyStore.setState((state) => ({
              uploadedDocs: state.uploadedDocs.map((d) =>
                d.id === docId ? { ...d, ocrText } : d
              ),
            }));
            setOcrStatus(`OCR complete · ${ocrText.slice(0, 40)}...`);
            setTimeout(() => setOcrStatus(null), 3000);
          } else {
            setOcrStatus("No text detected in image");
            setTimeout(() => setOcrStatus(null), 3000);
          }
        } catch {
          setOcrStatus("OCR failed · using vision only");
          setTimeout(() => setOcrStatus(null), 3000);
        }
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
          <span className="text-xs text-white/50">Images, PDFs, TXT</span>
        </button>

        {ocrStatus && (
          <p className="text-[11px] text-medical-blue mt-1.5 text-center animate-pulse">
            {ocrStatus}
          </p>
        )}

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
                {doc.ocrText && (
                  <span className="text-[9px] text-medical-green bg-medical-green/10 rounded-full px-1.5 py-0.5">
                    OCR
                  </span>
                )}
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
            Local AI via Ollama · Tesseract.js OCR · Data stays in your browser
          </span>
        </div>
      </div>
    </ScreenContainer>
  );
}
