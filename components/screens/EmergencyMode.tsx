"use client";

import { useState } from "react";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Siren,
  AlertTriangle,
  Pill,
  Phone,
  HeartPulse,
  Activity,
  Pencil,
  Check,
  X,
  Plus,
  Trash2,
} from "lucide-react";

export default function EmergencyMode() {
  const {
    familyMembers,
    updateFamilyMember,
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
  } = useFamilyStore();

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    bloodType: string;
    allergies: string;
    conditions: string;
    medications: string;
  }>({ bloodType: "", allergies: "", conditions: "", medications: "" });

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const primary = familyMembers[0];

  const startEdit = (member: (typeof familyMembers)[number]) => {
    setEditingMemberId(member.id);
    setEditForm({
      bloodType: member.bloodType || "",
      allergies: member.allergies.filter((a) => a && a !== "None known").join(", "),
      conditions: member.conditions.filter((c) => c && c !== "None active").join(", "),
      medications: member.medications.filter((m) => m && m !== "None current").join(", "),
    });
  };

  const saveEdit = (id: string) => {
    updateFamilyMember(id, {
      bloodType: editForm.bloodType.trim(),
      allergies: editForm.allergies.trim()
        ? editForm.allergies.split(",").map((s) => s.trim()).filter(Boolean)
        : ["None known"],
      conditions: editForm.conditions.trim()
        ? editForm.conditions.split(",").map((s) => s.trim()).filter(Boolean)
        : ["None active"],
      medications: editForm.medications.trim()
        ? editForm.medications.split(",").map((s) => s.trim()).filter(Boolean)
        : ["None current"],
    });
    setEditingMemberId(null);
  };

  const cancelEdit = () => setEditingMemberId(null);

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return;
    addEmergencyContact({
      id: String(Date.now()),
      name: newContact.name.trim(),
      relation: newContact.relation.trim() || "Contact",
      phone: newContact.phone.trim(),
    });
    setNewContact({ name: "", relation: "", phone: "" });
    setShowAddContact(false);
  };

  return (
    <ScreenContainer className="emergency-bg">
      <div className="px-5 pt-6 pb-6">
        {/* Emergency Header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto mb-5 w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-medical-red/20 blur-xl anim-emergency-glow" />
            <div className="absolute inset-0 rounded-full bg-medical-red/10 blur-lg anim-emergency-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-medical-red/15 flex items-center justify-center border border-medical-red/30 anim-emergency-pulse">
              <Siren size={38} className="text-medical-red" />
            </div>
          </div>
          <h1
            className="text-3xl font-bold text-white font-display mb-2"
            style={{ textShadow: "0 0 24px rgba(255, 69, 58, 0.5)" }}
          >
            Emergency Mode
          </h1>
          <p className="text-sm text-white/70">
            Medical profile for first responders
          </p>
        </div>

        {/* Primary Profile */}
        {primary && (
          <GlassPanel
            variant="strong"
            className="p-5 mb-4 border border-medical-red/25"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0"
                style={{ background: primary.avatarGradient }}
                aria-label={`${primary.name} avatar`}
              >
                {primary.initials}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-white truncate">
                  {primary.name}
                </p>
                <p className="text-sm text-white/70">
                  {primary.relation} · {primary.age} yrs
                </p>
              </div>
              <div className="ml-auto shrink-0 flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
                <HeartPulse size={14} className="text-medical-red" />
                <span className="text-xs font-semibold text-white">
                  {primary.bloodType || "Unknown"}
                </span>
              </div>
              <button
                onClick={() => (editingMemberId === primary.id ? cancelEdit() : startEdit(primary))}
                className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label={editingMemberId === primary.id ? "Cancel edit" : "Edit emergency profile"}
              >
                {editingMemberId === primary.id ? (
                  <X size={14} className="text-white/70" />
                ) : (
                  <Pencil size={14} className="text-white/70" />
                )}
              </button>
            </div>

            {editingMemberId === primary.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 block">
                    Blood Type
                  </label>
                  <input
                    value={editForm.bloodType}
                    onChange={(e) => setEditForm((f) => ({ ...f, bloodType: e.target.value }))}
                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
                    placeholder="e.g. O+, A-, B+"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 block">
                    Allergies (comma separated)
                  </label>
                  <input
                    value={editForm.allergies}
                    onChange={(e) => setEditForm((f) => ({ ...f, allergies: e.target.value }))}
                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
                    placeholder="e.g. Penicillin, Sulfa drugs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 block">
                    Conditions (comma separated)
                  </label>
                  <input
                    value={editForm.conditions}
                    onChange={(e) => setEditForm((f) => ({ ...f, conditions: e.target.value }))}
                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
                    placeholder="e.g. Hypertension, Diabetes"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1 block">
                    Medications (comma separated)
                  </label>
                  <input
                    value={editForm.medications}
                    onChange={(e) => setEditForm((f) => ({ ...f, medications: e.target.value }))}
                    className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
                    placeholder="e.g. Lisinopril 10mg, Metformin 500mg"
                  />
                </div>
                <button
                  onClick={() => saveEdit(primary.id)}
                  className="w-full py-2.5 rounded-xl bg-medical-red text-white text-sm font-semibold hover:bg-medical-red/80 transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={16} />
                  Save Emergency Profile
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle size={12} className="text-medical-amber" />
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                      Allergies
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {primary.allergies.filter((a) => a && a !== "None known").join(", ") || "None known"}
                  </p>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Activity size={12} className="text-medical-blue" />
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                      Conditions
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {primary.conditions.filter((c) => c && c !== "None active").join(", ") || "None known"}
                  </p>
                </div>
                <div className="glass rounded-xl p-3 col-span-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Pill size={12} className="text-medical-purple" />
                    <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">
                      Medications
                    </span>
                  </div>
                  <p className="text-sm text-white/90">
                    {primary.medications.filter((m) => m && m !== "None current").join(", ") || "None listed"}
                  </p>
                </div>
              </div>
            )}
          </GlassPanel>
        )}

        {/* Other family members */}
        {familyMembers.length > 1 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 px-1">
              Other Family Members
            </p>
            <div className="space-y-2">
              {familyMembers.slice(1).map((member) => (
                <GlassPanel key={member.id} variant="default" className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm shrink-0"
                      style={{ background: member.avatarGradient }}
                      aria-label={`${member.name} avatar`}
                    >
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {member.relation} · {member.age} yrs · Blood: {member.bloodType || "?"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          member.status === "healthy"
                            ? "bg-medical-green"
                            : member.status === "monitored"
                            ? "bg-medical-amber"
                            : "bg-medical-red"
                        }`}
                        aria-label={`Status: ${member.status}`}
                      />
                      <span className="text-[10px] text-white/50 capitalize">
                        {member.status}
                      </span>
                    </div>
                  </div>
                </GlassPanel>
              ))}
            </div>
          </div>
        )}

        {/* Emergency Contacts */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Emergency Contacts
            </p>
            <button
              onClick={() => setShowAddContact((s) => !s)}
              className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Add emergency contact"
            >
              {showAddContact ? <X size={14} className="text-white/70" /> : <Plus size={14} className="text-white/70" />}
            </button>
          </div>

          {showAddContact && (
            <div className="glass rounded-xl p-3 mb-2 space-y-2">
              <input
                value={newContact.name}
                onChange={(e) => setNewContact((c) => ({ ...c, name: e.target.value }))}
                placeholder="Name"
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
              />
              <input
                value={newContact.relation}
                onChange={(e) => setNewContact((c) => ({ ...c, relation: e.target.value }))}
                placeholder="Relation (e.g. Spouse, Doctor)"
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
              />
              <input
                value={newContact.phone}
                onChange={(e) => setNewContact((c) => ({ ...c, phone: e.target.value }))}
                placeholder="Phone number"
                className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none border border-white/10 focus:border-medical-red/50"
              />
              <button
                onClick={handleAddContact}
                className="w-full py-2 rounded-xl bg-medical-red/20 text-medical-red text-sm font-medium hover:bg-medical-red/30 transition-colors"
              >
                Add Contact
              </button>
            </div>
          )}

          <div className="space-y-2">
            {emergencyContacts.map((contact) => (
              <GlassPanel key={contact.id} className="p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-medical-red/10 flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-medical-red" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{contact.name}</p>
                  <p className="text-xs text-white/50">{contact.relation} · {contact.phone}</p>
                </div>
                <a
                  href={`tel:${contact.phone.replace(/\D/g, "")}`}
                  className="w-9 h-9 rounded-full bg-medical-red/20 flex items-center justify-center hover:bg-medical-red/30 transition-colors shrink-0"
                  aria-label={`Call ${contact.name}`}
                >
                  <Phone size={14} className="text-medical-red" />
                </a>
                <button
                  onClick={() => removeEmergencyContact(contact.id)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-medical-red/20 transition-colors shrink-0"
                  aria-label={`Remove ${contact.name}`}
                >
                  <Trash2 size={12} className="text-white/50" />
                </button>
              </GlassPanel>
            ))}
            {emergencyContacts.length === 0 && !showAddContact && (
              <p className="text-xs text-white/30 text-center py-3">
                No emergency contacts added. Tap + to add one.
              </p>
            )}
          </div>
        </div>

        {/* 911 Call Button */}
        <a
          href="tel:911"
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-medical-red hover:bg-medical-red/90 transition-colors text-white font-semibold text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-medical-red/50"
          aria-label="Call emergency services 911"
        >
          <Phone size={18} />
          Call Emergency Services (911)
        </a>

        {/* Offline indicator */}
        <div className="text-center">
          <p className="text-[10px] text-white/40">
            Emergency data cached offline · Available without internet
          </p>
        </div>
      </div>
    </ScreenContainer>
  );
}
