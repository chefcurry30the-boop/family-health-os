import { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { expenses as mockExpenses } from "../data/familyData";
import { Avatar } from "../components/Avatar";
import { GlassView } from "../components/GlassView";
import {
  ArrowLeft, Plus, X, Trash2, Receipt, Stethoscope, Pill,
  FlaskConical, Building2, TrendingUp,
} from "lucide-react-native";

const categories = [
  { key: "Consultation", icon: Stethoscope, color: "#0a84ff" },
  { key: "Lab", icon: FlaskConical, color: "#bf5af2" },
  { key: "Pharmacy", icon: Pill, color: "#ff9f0a" },
  { key: "Hospital", icon: Building2, color: "#ff375f" },
  { key: "Other", icon: Receipt, color: "#5fc9f8" },
];

function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function ExpensesScreen() {
  const router = useRouter();
  const { expenses, familyMembers, familyName, addExpense, removeExpense } = useFamilyStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newExp, setNewExp] = useState({
    description: "", amount: "", memberId: "", category: "Consultation",
  });

  const exps = expenses.length > 0 ? expenses : mockExpenses;
  const total = exps.reduce((sum, e) => sum + e.amount, 0);

  const memberTotals = familyMembers.map((m) => ({
    member: m,
    total: exps.filter((e) => e.memberId === m.id).reduce((s, e) => s + e.amount, 0),
  })).filter((mt) => mt.total > 0);

  const maxMemberTotal = Math.max(...memberTotals.map((mt) => mt.total), 1);

  const handleAdd = () => {
    if (!newExp.description.trim() || !newExp.amount || !newExp.memberId) return;
    addExpense({
      id: String(Date.now()),
      description: newExp.description.trim(),
      amount: Number(newExp.amount) || 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      memberId: newExp.memberId,
      category: newExp.category,
      icon: categories.find((c) => c.key === newExp.category)?.key || "Other",
    });
    setNewExp({ description: "", amount: "", memberId: "", category: "Consultation" });
    setShowAdd(false);
  };

  const getCatConfig = (cat: string) => categories.find((c) => c.key === cat) || categories[0];

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between pt-2 pb-4">
          <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-1">
            <ArrowLeft size={18} color="rgba(255,255,255,0.6)" />
            <Text className="text-white/60 text-sm">Back</Text>
          </TouchableOpacity>
          <Text className="text-white font-semibold text-sm">Expense Tracker</Text>
          <TouchableOpacity onPress={() => setShowAdd((s) => !s)} className="w-8 h-8 rounded-full bg-white/5 items-center justify-center">
            {showAdd ? <X size={16} color="rgba(255,255,255,0.6)" /> : <Plus size={16} color="rgba(255,255,255,0.6)" />}
          </TouchableOpacity>
        </View>

        <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">YTD</Text>
        <Text className="text-white text-[28px] font-semibold font-display leading-tight mb-4">
          {familyName || "Family"}
        </Text>

        {/* Summary */}
        <View className="flex-row gap-2 mb-4">
          {[
            { label: "Total Spent", value: formatINR(total), color: "text-medical-red" },
            { label: "Out of Pocket", value: formatINR(Math.round(total * 0.4)), color: "text-medical-amber" },
            { label: "Insurance", value: formatINR(Math.round(total * 0.6)), color: "text-medical-green" },
            { label: "Pending", value: formatINR(0), color: "text-medical-teal" },
          ].map((s) => (
            <GlassView key={s.label} className="flex-1 p-3 items-center">
              <Text className={`text-sm font-bold ${s.color}`}>{s.value}</Text>
              <Text className="text-white/40 text-[9px] mt-0.5">{s.label}</Text>
            </GlassView>
          ))}
        </View>

        {/* Member breakdown */}
        <GlassView variant="strong" className="p-4 mb-4">
          <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Member Breakdown</Text>
          {memberTotals.map((mt) => (
            <View key={mt.member.id} className="flex-row items-center gap-3 mb-2">
              <Avatar initials={mt.member.initials} gradient={mt.member.avatarGradient} size={32} />
              <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-white text-xs">{mt.member.name}</Text>
                  <Text className="text-white/70 text-xs">{formatINR(mt.total)}</Text>
                </View>
                <View className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <View className="h-full rounded-full" style={{ width: `${(mt.total / maxMemberTotal) * 100}%`, backgroundColor: "#0a84ff" }} />
                </View>
              </View>
            </View>
          ))}
          {memberTotals.length === 0 && (
            <Text className="text-white/30 text-xs text-center py-3">No expenses recorded.</Text>
          )}
        </GlassView>

        {/* Add form */}
        {showAdd && (
          <GlassView variant="strong" className="p-4 mb-4 gap-3">
            <TextInput
              value={newExp.description} onChangeText={(t) => setNewExp((e) => ({ ...e, description: t }))}
              placeholder="Description" placeholderTextColor="rgba(255,255,255,0.3)"
              className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
            />
            <TextInput
              value={newExp.amount} onChangeText={(t) => setNewExp((e) => ({ ...e, amount: t }))}
              placeholder="Amount (₹)" placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="numeric"
              className="bg-white/5 rounded-lg px-3 py-2.5 text-white text-sm border border-white/10"
            />
            <View className="flex-row flex-wrap gap-2">
              {familyMembers.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  onPress={() => setNewExp((e) => ({ ...e, memberId: m.id }))}
                  className={`px-3 py-2 rounded-xl border ${newExp.memberId === m.id ? "bg-white/10 border-white/20" : "border-white/5"}`}
                >
                  <Text className="text-white text-xs">{m.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.key}
                  onPress={() => setNewExp((e) => ({ ...e, category: c.key }))}
                  className={`flex-row items-center gap-1 px-2.5 py-1.5 rounded-lg border ${newExp.category === c.key ? "bg-white/10 border-white/20" : "border-white/5"}`}
                >
                  <c.icon size={12} color={c.color} />
                  <Text className="text-white text-[10px]">{c.key}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity onPress={handleAdd} className="bg-medical-teal rounded-xl py-2.5 items-center">
              <Text className="text-white font-semibold text-sm">Add Expense</Text>
            </TouchableOpacity>
          </GlassView>
        )}

        {/* Transaction list */}
        <View className="gap-2 mb-6">
          {exps.map((exp) => {
            const cc = getCatConfig(exp.category);
            return (
              <GlassView key={exp.id} className="p-4 flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: cc.color + "20" }}>
                  <cc.icon size={18} color={cc.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-semibold">{exp.description}</Text>
                  <Text className="text-white/40 text-xs">{exp.date} · {exp.category}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-white font-semibold text-sm">{formatINR(exp.amount)}</Text>
                  <TouchableOpacity onPress={() => removeExpense(exp.id)}>
                    <Trash2 size={12} color="rgba(255,255,255,0.2)" />
                  </TouchableOpacity>
                </View>
              </GlassView>
            );
          })}
        </View>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
