import React from "react";
import { StatusIcon } from "./StatusIcon";
import type { PipelineStage } from "../types/security";

const STAGES: { key: string; label: string }[] = [
  { key: "test", label: "Tests" },
  { key: "sast", label: "SAST" },
  { key: "secrets", label: "Secrets" },
  { key: "container", label: "Container" },
  { key: "dast", label: "DAST" },
  { key: "deploy", label: "Deploy" },
];

interface Props {
  stages?: PipelineStage[];
}

export const PipelineStatus: React.FC<Props> = ({ stages = [] }) => {
  const getStageStatus = (key: string) => {
    const found = stages.find((s) => s.name.toLowerCase().includes(key));
    return found?.status ?? "pending";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-medium text-gray-800 mb-4">Pipeline stages</h3>
      <div className="flex items-center justify-between">
        {STAGES.map((stage, i) => (
          <React.Fragment key={stage.key}>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                <StatusIcon status={getStageStatus(stage.key)} size={16} />
              </div>
              <span className="text-xs text-gray-500">{stage.label}</span>
            </div>
            {i < STAGES.length - 1 && (
              <div className="w-4 h-px bg-gray-200 mx-1 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
