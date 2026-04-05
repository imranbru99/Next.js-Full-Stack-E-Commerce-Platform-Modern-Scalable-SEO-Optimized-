// components/admin/StatusBadge.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

const STATUS_OPTIONS = [
  // CHANGE 'PUBLISHED' TO 'ACTIVE' TO MATCH YOUR FORM
  { value: "ACTIVE", label: "Live", color: "text-green-600 bg-green-50", icon: CheckCircle2 },
  { value: "PENDING", label: "Draft", color: "text-amber-600 bg-amber-50", icon: Clock },
  { value: "ARCHIVED", label: "Archived", color: "text-slate-400 bg-slate-50", icon: AlertCircle },
];

export default function StatusBadge({ productId, initialStatus }: { productId: string, initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleStatus = async () => {
    // Finds the current status index in our array
    const currentIndex = STATUS_OPTIONS.findIndex(opt => opt.value === status);
    // Cycles to the next status (Live -> Draft -> Archived -> Live)
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const nextStatus = STATUS_OPTIONS[nextIndex].value;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setStatus(nextStatus);
        router.refresh(); 
      }
    } catch (error) {
      console.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  // If status is 'ACTIVE', it finds the green badge. 
  // If it's null or mismatched, it defaults to PENDING.
  const current = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[1];
  const Icon = current.icon;

  return (
    <button
      onClick={toggleStatus}
      disabled={isLoading}
      className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all active:scale-95 disabled:opacity-50 ${current.color} border-current/10 hover:border-current/30`}
    >
      {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Icon size={12} />}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {current.label}
      </span>
    </button>
  );
}