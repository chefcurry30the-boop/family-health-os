import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore, type FamilyMember } from "../store/useFamilyStore";
import { Avatar } from "../components/Avatar";
import { GlassView } from "../components/GlassView";
import {
  Siren,
  HeartPulse,
  AlertTriangle,
  Activity,
  Pill,
  Pencil,
  Check,
  X,
  Plus,
  Trash2,
  Phone,
  ArrowLeft,
} from "lucide-react-native";

export default function EmergencyScreen() {
  const router = useRouter();
  const {
    familyMembers,
    updateFamilyMember,
    emergencyContacts,
    addEmergencyContact,
    removeEmergencyContact,
  } = useFamilyStore();

  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    bloodType: "",
    allergies: "",
    conditions: "",
    medications: "",
  });

  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });

  const primary = familyMembers[0];

  const startEdit = (member: FamilyMember) => {
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

  const handleCall911 = () => {
    Linking.openURL("tel:911").catch(() => {
      Alert.alert("Unable to dial", "Please call emergency services manually.");
    });
  };

  return (
    <SafeAreaView className="flex-1" edges={["top"]} style={{ backgroundColor: "#0c0404" }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between pt-2 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
            <ArrowLeft size={18} className="text-white/60" />
            <Text className="text-white/60 text-sm">Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-semibold text-sm">Emergency</Text>
          <View className="w-12" />
        </View>

        {/* Emergency Icon */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-medical-red/10 items-center justify-center mb-4">
            <View className="w-16 h-16 rounded-full bg-medical-red/20 items-center justify-center">
              <Siren size={32} color="#ff453a" />
            </View>
          </View>
          <Text className="text-white text-2xl font-bold font-display">
            Emergency Mode
          </Text>
          <Text className="text-white/60 text-sm mt-1">
            Medical profile for first responders
          </Text>
        </View>

        {/* Primary Profile */}
        {primary && (
          <GlassView variant="strong" className="p-5 mb-4 border border-medical-red/20">
            <View className="flex-row items-center gap-3 mb-4">
              <Avatar initials={primary.initials} gradient={primary.avatarGradient} size={56} />
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">{primary.name}</Text>
                <Text className="text-white/60 text-sm">
                  {primary.relation} · {primary.age} yrs
                </Text>
              </View>
              <View className="flex-row items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5">
                <HeartPulse size={14} color="#ff453a" />
                <Text className="text-white text-xs font-semibold">
                  {primary.bloodType || "Unknown"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => (editingMemberId === primary.id ? cancelEdit() : startEdit(primary))}
                className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
              >
                {editingMemberId === primary.id ? (
                  <X size={14} color="rgba(255,255,255,0.6)" />
                ) : (
                  <Pencil size={14} color="rgba(255,255,255,0.6)" />
                )}
              </TouchableOpacity>
            </View>

            {editingMemberId === primary.id ? (
              <View className="gap-3">
                <View>
                  <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Blood Type
                  </Text>
                  <TextInput
                    value={editForm.bloodType}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, bloodType: t }))}
                    placeholder="e.g. O+, A-"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
                  />
                </View>
                <View>
                  <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Allergies (comma separated)
                  </Text>
                  <TextInput
                    value={editForm.allergies}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, allergies: t }))}
                    placeholder="e.g. Penicillin, Sulfa drugs"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
                  />
                </View>
                <View>
                  <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Conditions (comma separated)
                  </Text>
                  <TextInput
                    value={editForm.conditions}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, conditions: t }))}
                    placeholder="e.g. Hypertension, Diabetes"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
                  />
                </View>
                <View>
                  <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                    Medications (comma separated)
                  </Text>
                  <TextInput
                    value={editForm.medications}
                    onChangeText={(t) => setEditForm((f) => ({ ...f, medications: t }))}
                    placeholder="e.g. Lisinopril 10mg, Metformin 500mg"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => saveEdit(primary.id)}
                  className="bg-medical-red rounded-xl py-3 items-center flex-row justify-center gap-2"
                >
                  <Check size={16} color="#fff" />
                  <Text className="text-white font-semibold text-sm">Save Emergency Profile</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row flex-wrap gap-2">
                <View className="flex-1 bg-white/5 rounded-xl p-3 min-w-[48%]">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <AlertTriangle size={12} color="#ff9f0a" />
                    <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                      Allergies
                    </Text>
                  </View>
                  <Text className="text-white/80 text-sm">
                    {primary.allergies.filter((a) => a && a !== "None known").join(", ") || "None known"}
                  </Text>
                </View>
                <View className="flex-1 bg-white/5 rounded-xl p-3 min-w-[48%]">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Activity size={12} color="#0a84ff" />
                    <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                      Conditions
                    </Text>
                  </View>
                  <Text className="text-white/80 text-sm">
                    {primary.conditions.filter((c) => c && c !== "None active").join(", ") || "None known"}
                  </Text>
                </View>
                <View className="w-full bg-white/5 rounded-xl p-3">
                  <View className="flex-row items-center gap-1.5 mb-1">
                    <Pill size={12} color="#bf5af2" />
                    <Text className="text-white/50 text-[10px] font-semibold uppercase tracking-wider">
                      Medications
                    </Text>
                  </View>
                  <Text className="text-white/80 text-sm">
                    {primary.medications.filter((m) => m && m !== "None current").join(", ") || "None listed"}
                  </Text>
                </View>
              </View>
            )}
          </GlassView>
        )}

        {/* Other Members */}
        {familyMembers.length > 1 && (
          <View className="mb-4">
            <Text className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 px-1">
              Other Family Members
            </Text>
            <View className="gap-2">
              {familyMembers.slice(1).map((member) => (
                <GlassView key={member.id} className="p-3">
                  <View className="flex-row items-center gap-3">
                    <Avatar initials={member.initials} gradient={member.avatarGradient} size={40} />
                    <View className="flex-1">
                      <Text className="text-white text-sm font-medium">{member.name}</Text>
                      <Text className="text-white/40 text-xs">
                        {member.relation} · {member.age} yrs · Blood: {member.bloodType || "?"}
                      </Text>
                    </View>
                    <View className="items-end">
                      <View
                        className={`w-2 h-2 rounded-full ${
                          member.status === "healthy"
                            ? "bg-medical-green"
                            : member.status === "monitored"
                            ? "bg-medical-amber"
                            : "bg-medical-red"
                        }`}
                      />
                      <Text className="text-white/40 text-[10px] capitalize mt-0.5">{member.status}</Text>
                    </View>
                  </View>
                </GlassView>
              ))}
            </View>
          </View>
        )}

        {/* Emergency Contacts */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2 px-1">
            <Text className="text-white/40 text-xs font-medium uppercase tracking-wider">
              Emergency Contacts
            </Text>
            <TouchableOpacity
              onPress={() => setShowAddContact((s) => !s)}
              className="w-7 h-7 rounded-full bg-white/5 items-center justify-center"
            >
              {showAddContact ? (
                <X size={14} color="rgba(255,255,255,0.5)" />
              ) : (
                <Plus size={14} color="rgba(255,255,255,0.5)" />
              )}
            </TouchableOpacity>
          </View>

          {showAddContact && (
            <View className="bg-white/5 rounded-xl p-3 mb-2 gap-2 border border-white/10">
              <TextInput
                value={newContact.name}
                onChangeText={(t) => setNewContact((c) => ({ ...c, name: t }))}
                placeholder="Name"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2 text-white text-sm border border-white/10"
              />
              <TextInput
                value={newContact.relation}
                onChangeText={(t) => setNewContact((c) => ({ ...c, relation: t }))}
                placeholder="Relation (e.g. Spouse, Doctor)"
                placeholderTextColor="rgba(255,255,255,0.3)"
                className="bg-white/5 rounded-lg px-3 py-2 text-white text-sm border border-white/10"
              />
              <TextInput
                value={newContact.phone}
                onChangeText={(t) => setNewContact((c) => ({ ...c, phone: t }))}
                placeholder="Phone number"
                placeholderTextColor="rgba(255,255,255,0.3)"
                keyboardType="phone-pad"
                className="bg-white/5 rounded-lg px-3 py-2 text-white text-sm border border-white/10"
              />
              <TouchableOpacity
                onPress={handleAddContact}
                className="bg-medical-red/20 rounded-xl py-2 items-center border border-medical-red/15"
              >
                <Text className="text-medical-red text-sm font-medium">Add Contact</Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="gap-2">
            {emergencyContacts.map((contact) => (
              <GlassView key={contact.id} className="p-3 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-medical-red/10 items-center justify-center">
                  <Phone size={16} color="#ff453a" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-medium">{contact.name}</Text>
                  <Text className="text-white/50 text-xs">{contact.relation} · {contact.phone}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${contact.phone.replace(/\D/g, "")}`).catch(() => {})}
                  className="w-9 h-9 rounded-full bg-medical-red/20 items-center justify-center"
                >
                  <Phone size={14} color="#ff453a" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeEmergencyContact(contact.id)}
                  className="w-8 h-8 rounded-full bg-white/5 items-center justify-center"
                >
                  <Trash2 size={12} color="rgba(255,255,255,0.4)" />
                </TouchableOpacity>
              </GlassView>
            ))}
            {emergencyContacts.length === 0 && !showAddContact && (
              <Text className="text-white/25 text-xs text-center py-3">
                No emergency contacts added. Tap + to add one.
              </Text>
            )}
          </View>
        </View>

        {/* 911 Button */}
        <TouchableOpacity
          onPress={handleCall911}
          className="bg-medical-red rounded-2xl py-4 items-center flex-row justify-center gap-2.5 mb-4"
        >
          <Phone size={18} color="#fff" />
          <Text className="text-white font-semibold text-sm">Call Emergency Services (911)</Text>
        </TouchableOpacity>

        <Text className="text-white/25 text-[10px] text-center mb-6">
          Emergency data cached offline · Available without internet
        </Text>

        <View className="h-4" />
      </ScrollView>
    </SafeAreaView>
  );
}
