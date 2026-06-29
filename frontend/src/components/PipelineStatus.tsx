import React from "react";
import { CheckCircle2, XCircle, Clock, Loader2, GitBranch } from "lucide-react";
import type { PipelineStage } from "../types/security";

const STAGES = [
  { key: "test",      label: "Tests",     number: "01" },
  { key: "sast",      label: "SAST",      number: "02" },
  { key: "secrets",   label: "Secrets",   number: "03" },
  { key: "container", label: "Container", number: "04" },
  { key: "dast",      label: "DAST",      number: "05" },
  { key: "deploy",    label: "Deploy",    number: "06" },
];

const stageConfig = {
  passed: {
    circle: "bg-emerald-500 border-emerald-500 shadow-emerald-200",
    Icon: CheckCircle2,
    iconClass: "text-white",
    connector: "bg-emerald-300",
    label: "text-emerald-600",
    sublabel: "text-emerald-400",
  },
  failed: {
    circle: "bg-red-500 border-red-500 shadow-red-200",
    Icon: XCircle,
    iconClass: "text-white",
    connector: "bg-slate-200",
    label: "text-red-600",
    sublabel: "text-red-400",
  },
  running: {
    circle: "bg-blue-500 border-blue-500 shadow-blue-200",
    Icon: Loader2,
    iconClass: "text-white animate-spin",
    connector: "bg-slate-200",
    label: "text-blue-600",
    sublabel: "text-blue-400",
  },
  pending: {
    circle: "bg-white border-slate-200 shadow-slate-100",
    Icon: Clock,
    iconClass: "text-slate-400",
    connector: "bg-slate-200",
    label: "text-slate-500",
    sublabel: "text-slate-400",
  },
};

interface Props {
  stages?: PipelineStage[];
}

export const PipelineStatus: React.FC<Props> = ({ stages = [] }) => {
  const getStatus = (key: string): keyof typeof stageConfig => {
    const found = stages.find((s) => s.name.toLowerCase().includes(key));
    return (found?.status as keyof typeof stageConfig) ?? "pending";
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GitBranch size={15} className="text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">CI/CD Pipeline</h3>
        </div>
        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full">
          main branch
        </span>
      </div>

      <div className="flex items-start">
        {STAGES.map((stage, i) => {
          const status = getStatus(stage.key);
          const c = stageConfig[status];
          const { Icon } = c;
          const isLast = i === STAGES.length - 1;

          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-md ${c.circle}`}>
                  <Icon size={16} className={c.iconClass} />
                </div>
                <div className="text-center">
                  <p className={`text-xs font-semibold ${c.label}`}>{stage.label}</p>
                  <p className={`text-xs ${c.sublabel}`}>{stage.number}</p>
                </div>
              </div>
              {!isLast && (
                <div className="flex-1 flex items-center pb-6 mx-1">
                  <div className={`w-full h-0.5 ${c.connector}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
