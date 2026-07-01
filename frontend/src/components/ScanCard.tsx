import React from "react";
import type { ScanSummary } from "../types/security";

interface Props {
  title: string;
  icon: React.ReactNode;
  data: ScanSummary;
  description?: string;
}

const statusConfig = {
  passed: {
    borderLeft: "border-l-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  failed: {
    borderLeft: "border-l-red-500",
    badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    dot: "bg-red-500",
  },
  running: {
    borderLeft: "border-l-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    dot: "bg-blue-500 animate-pulse",
  },
  pending: {
    borderLeft: "border-l-slate-300",
    badge: "bg-slate-50 text-slate-600 ring-1 ring-slate-200",
    dot: "bg-slate-400",
  },
};

const severityRows = [
  { key: "critical", label: "Critical", bar: "bg-red-500",    text: "text-red-600" },
  { key: "high",     label: "High",     bar: "bg-orange-400", text: "text-orange-600" },
  { key: "medium",   label: "Medium",   bar: "bg-amber-400",  text: "text-amber-600" },
  { key: "low",      label: "Low",      bar: "bg-emerald-400",text: "text-emerald-600" },
];

export const ScanCard: React.FC<Props> = ({ title, icon, data, description }) => {
  const sc = statusConfig[data.status] || statusConfig.pending;
  const total = data.total ?? 0;

  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${sc.borderLeft} shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col`}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 leading-tight">{title}</p>
              {description && (
                <p className="text-xs text-slate-400 mt-0.5">{description}</p>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sc.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {data.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex-1">
        {total === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
              <span className="text-emerald-500 text-lg">✓</span>
            </div>
            <p className="text-sm font-medium text-slate-600">No findings</p>
            <p className="text-xs text-slate-400 mt-0.5">Scan passed clean</p>
          </div>
        ) : (
          <div className="space-y-3">
            {severityRows.map(({ key, label, bar, text }) => {
              const count = (data as unknown as Record<string, number>)[key] ?? 0;
              if (count === 0) return null;
              const pct = total > 0 ? Math.max(4, Math.round((count / total) * 100)) : 4;
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-slate-500">{label}</span>
                    <span className={`text-xs font-bold ${text}`}>{count}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${bar} rounded-full transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-400">Total findings</span>
          <span className="text-sm font-bold text-slate-700">{total}</span>
        </div>

        {data.last_run && (
          <p className="text-xs text-slate-400 mt-1.5">
            Last scan: {new Date(data.last_run).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};
