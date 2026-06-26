import React from "react";
import { SeverityBadge } from "./SeverityBadge";
import { StatusIcon } from "./StatusIcon";
import type { ScanSummary } from "../types/security";

interface Props {
  title: string;
  icon: React.ReactNode;
  data: ScanSummary;
}

export const ScanCard: React.FC<Props> = ({ title, icon, data }) => {
  const statusColors: Record<string, string> = {
    passed: "border-green-200 bg-green-50",
    failed: "border-red-200 bg-red-50",
    running: "border-blue-200 bg-blue-50",
    pending: "border-gray-200 bg-gray-50",
  };

  const headerBg = statusColors[data.status] || statusColors.pending;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-3 border-b ${headerBg}`}>
        <div className="flex items-center gap-2">
          <span className="text-gray-600">{icon}</span>
          <span className="text-sm font-medium text-gray-800">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon status={data.status} size={16} />
          <span className="text-xs text-gray-500 capitalize">{data.status}</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-2">
        {data.critical !== undefined && data.critical > 0 && (
          <div className="flex items-center justify-between">
            <SeverityBadge level="CRITICAL" />
            <span className="text-sm font-medium text-red-700">{data.critical}</span>
          </div>
        )}
        {data.high !== undefined && (
          <div className="flex items-center justify-between">
            <SeverityBadge level="HIGH" />
            <span className="text-sm font-medium text-amber-700">{data.high}</span>
          </div>
        )}
        {data.medium !== undefined && (
          <div className="flex items-center justify-between">
            <SeverityBadge level="MEDIUM" />
            <span className="text-sm font-medium text-blue-700">{data.medium}</span>
          </div>
        )}
        {data.low !== undefined && (
          <div className="flex items-center justify-between">
            <SeverityBadge level="LOW" />
            <span className="text-sm font-medium text-green-700">{data.low}</span>
          </div>
        )}
        <div className="pt-2 border-t border-gray-100 flex justify-between">
          <span className="text-xs text-gray-400">Total findings</span>
          <span className="text-xs font-medium text-gray-600">{data.total ?? 0}</span>
        </div>
        {data.last_run && (
          <p className="text-xs text-gray-400">
            Last scan: {new Date(data.last_run).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};
