"use client";

import { motion } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { Avatar } from "@/components/design-system/Avatar";
import { expenses, expenseSummary, memberExpenses, familyMembers } from "@/data/familyData";
import { Wallet, TrendingUp, TrendingDown, Pill, Stethoscope, Building2, CheckCircle2, AlertTriangle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  pill: Pill,
  stethoscope: Stethoscope,
  hospital: Building2,
  check: CheckCircle2,
  insurance: Building2,
  doctor: Stethoscope,
};

export default function ExpenseTracker() {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));

  return (
    <ScreenContainer title="Expense Tracker">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-ivory/60" />
          <span className="text-sm font-medium text-ivory/80">
            Mitchell Family
          </span>
        </div>
        <span className="text-xs text-ivory/70">2024 YTD</span>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-red-light" />
              <span className="text-[10px] text-ivory/80">Total Spent</span>
            </div>
            <p className="text-lg font-bold text-red-light">
              {formatCurrency(expenseSummary.yearToDate)}
            </p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-green-hospital" />
              <span className="text-[10px] text-ivory/80">Out of Pocket</span>
            </div>
            <p className="text-lg font-bold text-green-hospital">
              {formatCurrency(expenseSummary.outOfPocket)}
            </p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={14} className="text-blue-accent" />
              <span className="text-[10px] text-ivory/80">Insurance</span>
            </div>
            <p className="text-lg font-bold text-blue-accent">
              {formatCurrency(expenseSummary.insurancePaid)}
            </p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={14} className="text-amber-warn" />
              <span className="text-[10px] text-ivory/80">Pending</span>
            </div>
            <p className="text-lg font-bold text-amber-warn">
              {formatCurrency(expenseSummary.pending)}
            </p>
          </GlassPanel>
        </div>

        {/* Member Breakdown */}
        <GlassPanel className="p-4 mb-5">
          <p className="text-xs font-medium text-ivory/80 mb-3">
            Spending by Member
          </p>
          <div className="space-y-3">
            {memberExpenses.map((me) => {
              const member = familyMembers.find((m) => m.id === me.memberId);
              if (!member) return null;
              const pct = (me.amount / expenseSummary.yearToDate) * 100;
              return (
                <div key={me.memberId}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Avatar
                        initials={member.initials}
                        gradient={member.avatarGradient}
                        size="sm"
                      />
                      <span className="text-xs text-ivory/80">
                        {member.name}
                      </span>
                    </div>
                    <span className="text-xs text-ivory/80">
                      {formatCurrency(me.amount)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-ivory/10 overflow-hidden ml-10">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: member.avatarGradient,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassPanel>

        {/* Transaction List */}
        <p className="text-xs font-medium text-ivory/80 mb-3">
          Recent Transactions
        </p>
        <div className="space-y-2">
          {expenses.map((expense, i) => {
            const Icon = iconMap[expense.icon] || Wallet;
            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <GlassPanel
                  variant="strong"
                  className="p-3 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-ivory/5 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-ivory/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ivory truncate">
                      {expense.description}
                    </p>
                    <p className="text-[11px] text-ivory/70">
                      {expense.date} ·{" "}
                      {expense.memberId === "all"
                        ? "All members"
                        : familyMembers.find((m) => m.id === expense.memberId)
                            ?.name || ""}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-semibold shrink-0 ${
                      expense.amount > 0
                        ? "text-green-hospital"
                        : "text-ivory/70"
                    }`}
                  >
                    {expense.amount > 0 ? "+" : ""}
                    {formatCurrency(expense.amount)}
                  </span>
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ScreenContainer>
  );
}
