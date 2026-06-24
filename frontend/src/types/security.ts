export type ScanStatus = "passed" | "failed" | "running" | "pending";

export interface ScanSummary {
  tool: string;
  status: ScanStatus;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
  total?: number;
  last_run?: string;
}

export interface PipelineStage {
  name: string;
  status: ScanStatus;
  duration?: string;
}

export interface DashboardData {
  sast: ScanSummary;
  trivy: ScanSummary;
  secrets: ScanSummary;
  pipeline_stages?: PipelineStage[];
  last_updated?: string;
}
