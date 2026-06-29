import React from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  variant?: "default" | "danger" | "warning" | "success";
  icon: LucideIcon;
  description?: string;
}

const config = {
  default: {
    value: "text-slate-900",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
    border: "border-slate-200",
    glow: "",
  },
  danger: {
    value: "text-red-600",
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    border: "border-red-100",
    glow: "shadow-red-100",
  },
  warning: {
    value: "text-amber-600",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    border: "border-amber-100",
    glow: "shadow-amber-100",
  },
  success: {
    value: "text-emerald-600",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    border: "border-emerald-100",
    glow: "shadow-emerald-100",
  },
};

export const MetricCard: React.FC<Props> = ({
  label,
  value,
  variant = "default",
  icon: Icon,
  description,
}) => {
  const c = config[variant];
  return (
    <div className={`bg-white rounded-xl border ${c.border} p-5 shadow-sm ${c.glow} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
        <div className={`w-9 h-9 rounded-lg ${c.iconBg} flex items-center justify-center`}>
          <Icon size={17} className={c.iconColor} />
        </div>
      </div>
      <p className={`text-3xl font-extrabold ${c.value} leading-none`}>{value}</p>
      {description && (
        <p className="text-xs text-slate-400 mt-2">{description}</p>
      )}
    </div>
  );
};
