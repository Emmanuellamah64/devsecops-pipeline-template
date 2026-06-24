import React from "react";

interface Props {
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | string;
  count?: number;
}

const colorMap: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800 border border-red-200",
  HIGH: "bg-amber-100 text-amber-800 border border-amber-200",
  MEDIUM: "bg-blue-100 text-blue-800 border border-blue-200",
  LOW: "bg-green-100 text-green-800 border border-green-200",
};

export const SeverityBadge: React.FC<Props> = ({ level, count }) => {
  const classes = colorMap[level.toUpperCase()] || "bg-gray-100 text-gray-700";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}
    >
      {level.toUpperCase()}
      {count !== undefined && (
        <span className="font-bold">{count}</span>
      )}
    </span>
  );
};
