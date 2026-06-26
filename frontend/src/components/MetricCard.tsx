import React from "react";

interface Props {
  label: string;
  value: number | string;
  variant?: "default" | "danger" | "warning" | "success";
}

const variantClasses: Record<string, string> = {
  default: "text-gray-900",
  danger: "text-red-700",
  warning: "text-amber-700",
  success: "text-green-700",
};

export const MetricCard: React.FC<Props> = ({
  label,
  value,
  variant = "default",
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className={`text-2xl font-medium ${variantClasses[variant]}`}>
      {value}
    </p>
  </div>
);
