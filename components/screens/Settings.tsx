"use client";

import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { useFamilyStore } from "@/store/useFamilyStore";
import { Info, Shield, Bell, Database, ChevronRight } from "lucide-react";

export default function SettingsScreen() {
  const { familyMembers } = useFamilyStore();

  const settingGroups = [
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", value: "On" },
        { icon: Shield, label: "Privacy & Security", value: "" },
      ],
    },
    {
      title: "Data",
      items: [
        { icon: Database, label: "Export Health Data", value: "" },
        { icon: Database, label: "Clear All Data", value: "" },
      ],
    },
    {
      title: "About",
      items: [
        { icon: Info, label: "Version", value: "1.0.0" },
      ],
    },
  ];

  return (
    <ScreenContainer title="Settings" subtitle={`${familyMembers.length} family members tracked`}>
      <div className="px-5 pb-6 space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2 px-0.5">
              {group.title}
            </h3>
            <GlassPanel className="overflow-hidden">
              <div className="divide-y divide-white/5">
                {group.items.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <item.icon size={16} className="text-white/60" />
                    </div>
                    <span className="flex-1 text-sm text-white/90">{item.label}</span>
                    {item.value && (
                      <span className="text-sm text-white/50">{item.value}</span>
                    )}
                    <ChevronRight size={16} className="text-white/30" />
                  </button>
                ))}
              </div>
            </GlassPanel>
          </div>
        ))}
      </div>
    </ScreenContainer>
  );
}
