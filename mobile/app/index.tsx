import { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useFamilyStore } from "../store/useFamilyStore";
import { familyMembers, medications, vaccinations, expenses } from "../data/familyData";
import { Avatar } from "../components/Avatar";
import { GlassView } from "../components/GlassView";
import {
  Users,
  Pill,
  Shield,
  TrendingUp,
  Siren,
  ChevronRight,
  Activity,
} from "lucide-react-native";

function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function Dashboard() {
  const router = useRouter();
  const store = useFamilyStore();

  useEffect(() => {
    if (store.familyMembers.length === 0) {
      store.setFamilyMembers(familyMembers);
      store.setFamilyName("Mitchell Family");
    }
  }, []);

  const members = store.familyMembers.length > 0 ? store.familyMembers : familyMembers;
  const meds = store.medications.length > 0 ? store.medications : medications;
  const vax = store.vaccinations.length > 0 ? store.vaccinations : vaccinations;
  const exps = store.expenses.length > 0 ? store.expenses : expenses;

  const activeMeds = meds.filter((m) => !m.taken).length;
  const dueVaccines = vax.filter((v) => v.status === "due").length;
  const totalExpenses = exps.reduce((sum, e) => sum + e.amount, 0);

  return (
    <SafeAreaView className="flex-1 bg-navy-deep" edges={["top"]} style={{ backgroundColor: "#060b14" }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <View className="pt-2 pb-4">
          <Text className="text-white/50 text-xs font-medium uppercase tracking-wider">
            Family Health
          </Text>
          <Text className="text-white text-[28px] font-semibold font-display leading-tight mt-1">
            {store.familyName || "Mitchell Family"}
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row gap-2 mb-5">
          {[
            { icon: Users, value: String(members.length), label: "Members", color: "text-medical-blue", bg: "bg-medical-blue/10" },
            { icon: Pill, value: String(activeMeds), label: "Meds Due", color: "text-medical-amber", bg: "bg-medical-amber/10" },
            { icon: Shield, value: String(dueVaccines), label: "Vaccines", color: "text-medical-purple", bg: "bg-medical-purple/10" },
            { icon: TrendingUp, value: formatINR(totalExpenses), label: "Expenses", color: "text-medical-teal", bg: "bg-medical-teal/10" },
          ].map((stat) => (
            <GlassView key={stat.label} className="flex-1 p-3 items-center">
              <View className={`w-8 h-8 rounded-full ${stat.bg} items-center justify-center mb-1.5`}>
                <stat.icon size={16} className={stat.color} />
              </View>
              <Text className="text-white text-sm font-semibold">{stat.value}</Text>
              <Text className="text-white/50 text-[10px]">{stat.label}</Text>
            </GlassView>
          ))}
        </View>

        {/* Members */}
        <Text className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
          Family Members
        </Text>

        <View className="gap-2 mb-6">
          {members.map((member) => (
            <GlassView key={member.id} variant="strong" className="p-4">
              <View className="flex-row items-center gap-3">
                <Avatar initials={member.initials} gradient={member.avatarGradient} size={48} />
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">{member.name}</Text>
                  <Text className="text-white/50 text-xs">
                    {member.relation} · {member.age} yrs
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
                  <Text className="text-white/40 text-[10px] capitalize mt-0.5">
                    {member.status}
                  </Text>
                </View>
              </View>

              {member.conditions.length > 0 && member.conditions[0] !== "None active" && (
                <View className="flex-row flex-wrap gap-1.5 mt-3">
                  {member.conditions.map((c) => (
                    <View
                      key={c}
                      className="bg-white/5 rounded-lg px-2 py-1"
                    >
                      <Text className="text-white/70 text-[10px]">{c}</Text>
                    </View>
                  ))}
                </View>
              )}
            </GlassView>
          ))}
        </View>

        {/* Emergency Banner */}
        <TouchableOpacity
          onPress={() => router.push("/emergency")}
          activeOpacity={0.8}
          className="mb-6"
        >
          <GlassView className="p-4 flex-row items-center gap-3 bg-medical-red/10 border-medical-red/20">
            <View className="w-10 h-10 rounded-full bg-medical-red/20 items-center justify-center">
              <Siren size={20} className="text-medical-red" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-semibold text-sm">Emergency Profile</Text>
              <Text className="text-white/50 text-xs">Tap for medical info &amp; 911</Text>
            </View>
            <ChevronRight size={18} className="text-white/30" />
          </GlassView>
        </TouchableOpacity>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
