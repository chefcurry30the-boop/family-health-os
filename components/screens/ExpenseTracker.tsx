"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScreenContainer } from "@/components/shell/ScreenContainer";
import { StickyHeader } from "@/components/shell/StickyHeader";
import { GlassPanel } from "@/components/design-system/GlassPanel";
import { Avatar } from "@/components/design-system/Avatar";
import { useFamilyStore } from "@/store/useFamilyStore";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Pill,
  Stethoscope,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Plus,
  X,
  Receipt,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  pill: Pill,
  stethoscope: Stethoscope,
  hospital: Building2,
  check: CheckCircle2,
  insurance: Building2,
  doctor: Stethoscope,
};

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

export default function ExpenseTracker() {
  const { expenses, addExpense, removeExpense, familyMembers, familyName } = useFamilyStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    memberId: "",
    category: "pharmacy",
  });

  const yearToDate = expenses.reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const outOfPocket = expenses.filter((e) => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const insurancePaid = 0;
  const pending = 0;

  const memberTotals = familyMembers
    .map((m) => {
      const amount = expenses
        .filter((e) => e.memberId === m.id)
        .reduce((sum, e) => sum + Math.abs(e.amount), 0);
      return { memberId: m.id, amount };
    })
    .filter((me) => me.amount > 0);

  const handleAdd = () => {
    if (!form.description.trim() || !form.amount || !form.memberId) return;
    addExpense({
      id: String(Date.now()),
      description: form.description.trim(),
      amount: -Math.abs(Number(form.amount)),
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      memberId: form.memberId,
      category: form.category,
      icon: form.category === "pharmacy" ? "pill" : form.category === "hospital" ? "hospital" : "stethoscope",
    });
    setForm({ description: "", amount: "", memberId: "", category: "pharmacy" });
    setShowForm(false);
  };

  const hasExpenses = expenses.length > 0;

  return (
    <ScreenContainer title="Expense Tracker">
      <StickyHeader className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-white/70" />
          <span className="text-sm font-medium text-white">
            {familyName || "My Family"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">YTD</span>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
            aria-label={showForm ? "Cancel add expense" : "Add expense"}
          >
            {showForm ? <X size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
          </button>
        </div>
      </StickyHeader>

      <div className="px-5 pb-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={14} className="text-medical-red" />
              <span className="text-[10px] text-white/70">Total Spent</span>
            </div>
            <p className="text-lg font-bold text-medical-red">{formatINR(yearToDate)}</p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={14} className="text-medical-green" />
              <span className="text-[10px] text-white/70">Out of Pocket</span>
            </div>
            <p className="text-lg font-bold text-medical-green">{formatINR(outOfPocket)}</p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 size={14} className="text-medical-blue" />
              <span className="text-[10px] text-white/70">Insurance</span>
            </div>
            <p className="text-lg font-bold text-medical-blue">{formatINR(insurancePaid)}</p>
          </GlassPanel>
          <GlassPanel className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <AlertTriangle size={14} className="text-medical-amber" />
              <span className="text-[10px] text-white/70">Pending</span>
            </div>
            <p className="text-lg font-bold text-medical-amber">{formatINR(pending)}</p>
          </GlassPanel>
        </div>

        {/* Member Breakdown */}
        {memberTotals.length > 0 && (
          <GlassPanel className="p-4 mb-5">
            <p className="text-xs font-medium text-white mb-3">Spending by Member</p>
            <div className="space-y-3">
              {memberTotals.map((me) => {
                const member = familyMembers.find((m) => m.id === me.memberId);
                if (!member) return null;
                const pct = yearToDate > 0 ? (me.amount / yearToDate) * 100 : 0;
                return (
                  <div key={me.memberId}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Avatar initials={member.initials} gradient={member.avatarGradient} size="sm" />
                        <span className="text-xs text-white">{member.name}</span>
                      </div>
                      <span className="text-xs text-white/70">{formatINR(me.amount)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden ml-10">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: member.avatarGradient }}
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
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <GlassPanel className="p-3 space-y-2">
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                />
                <input
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  placeholder="Amount (₹)"
                  type="number"
                  className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                />
                <select
                  value={form.memberId}
                  onChange={(e) => setForm((f) => ({ ...f, memberId: e.target.value }))}
                  className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                >
                  <option value="" className="bg-navy-deep">
                    Select member
                  </option>
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id} className="bg-navy-deep">
                      {m.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAdd}
                  className="w-full py-2 rounded-xl bg-medical-blue text-white text-sm font-medium hover:bg-medical-blue/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-blue/60"
                  aria-label="Add expense"
                >
                  Add Expense
                </button>
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction List */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-white">Recent Transactions</p>
          {hasExpenses && (
            <span className="text-[10px] text-white/50">{expenses.length} transactions</span>
          )}
        </div>

        {hasExpenses ? (
          <div className="space-y-2">
            {expenses.map((expense, i) => {
              const Icon = iconMap[expense.icon] || Wallet;
              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative group"
                >
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="absolute right-2 top-2 z-10 w-6 h-6 rounded-full bg-medical-red/20 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-medical-red/60"
                    aria-label="Remove expense"
                  >
                    <X size={12} className="text-medical-red" />
                  </button>
                  <GlassPanel variant="strong" className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-white/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{expense.description}</p>
                      <p className="text-[11px] text-white/50">
                        {expense.date} ·{" "}
                        {expense.memberId === "all"
                          ? "All members"
                          : familyMembers.find((m) => m.id === expense.memberId)?.name || ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0 text-white/70">
                      {formatINR(Math.abs(expense.amount))}
                    </span>
                  </GlassPanel>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <GlassPanel className="p-6 text-center">
            <Receipt size={32} className="text-white/30 mx-auto mb-3" />
            <p className="text-sm text-white font-medium mb-1">No expenses recorded</p>
            <p className="text-xs text-white/50">Tap the + button to add your first medical expense.</p>
          </GlassPanel>
        )}
      </div>
    </ScreenContainer>
  );
}
