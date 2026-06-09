"use client";

import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { TimelineEntry } from "@/components/design-system/TimelineEntry";
import { timelineEvents } from "@/data/familyData";
import { Clock } from "lucide-react";

export default function HealthTimeline() {
  return (
    <ScreenContainer title="AI Health Timeline">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-ivory/60" />
          <span className="text-sm font-medium text-ivory/80">Recent Events</span>
        </div>
        <span className="text-xs text-ivory/70">4 events</span>
      </StickyHeader>

      <div className="px-5 pb-6">
        <div className="space-y-0">
          {timelineEvents.map((event, i) => (
            <TimelineEntry
              key={event.id}
              date={event.date}
              memberName={event.memberName}
              title={event.title}
              description={event.description}
              tags={event.tags}
              type={event.type === "rx" || event.type === "vital" ? "visit" : event.type}
              index={i}
            />
          ))}
        </div>
      </div>
    </ScreenContainer>
  );
}
