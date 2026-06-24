import React from "react";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import type { ScanStatus } from "../types/security";

interface Props {
  status: ScanStatus;
  size?: number;
}

export const StatusIcon: React.FC<Props> = ({ status, size = 20 }) => {
  switch (status) {
    case "passed":
      return <CheckCircle size={size} className="text-green-600" />;
    case "failed":
      return <XCircle size={size} className="text-red-600" />;
    case "running":
      return <Loader2 size={size} className="text-blue-600 animate-spin" />;
    case "pending":
    default:
      return <Clock size={size} className="text-gray-400" />;
  }
};
