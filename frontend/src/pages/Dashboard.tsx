import React, { useEffect, useState } from "react";
import {
  Shield, Package, Key, Globe,
  RefreshCw, AlertTriangle, CheckCircle2,
  Activity, TrendingUp, ExternalLink,
} from "lucide-react";
import { ScanCard } from "../components/ScanCard";
import { MetricCard } from "../components/MetricCard";
import { PipelineStatus } from "../components/PipelineStatus";
import client from "../api/client";
import type { DashboardData } from "../types/security";

const REFRESH_INTERVAL = 30000;

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const [sast, trivy, secrets] = await Promise.all([
        client.get("/reports/sast"),
        client.get("/reports/trivy"),
        client.get("/reports/secrets"),
      ]);
      setData({ sast: sast.data, trivy: trivy.data, secrets: secrets.data });
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Failed to load security reports. Check backend connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const totalCritical = data ? (data.trivy.critical ?? 0) : 0;
  const totalHigh     = data ? (data.sast.high ?? 0) + (data.trivy.high ?? 0) : 0;
  const secretsFound  = data ? (data.secrets.high ?? 0) : 0;
  const totalIssues   = data ? (data.sast.total ?? 0) + (data.trivy.total ?? 0) : 0;

  const overallStatus =
    totalCritical > 0 || secretsFound > 0 ? "critical"
    : totalHigh > 0 ? "warning"
    : "secure";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-medium">Loading security reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5 max-w-7xl">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Overview</h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time pipeline security results · refreshes every 30s
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Overall status */}
          {overallStatus === "secure" && (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={13} />
              All clear
            </span>
          )}
          {overallStatus === "warning" && (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-700">
              <AlertTriangle size={13} />
              Warnings detected
            </span>
          )}
          {overallStatus === "critical" && (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-700">
              <AlertTriangle size={13} />
              Critical issues
            </span>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow" />
            Live
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertTriangle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          label="Critical CVEs"
          value={totalCritical}
          variant={totalCritical > 0 ? "danger" : "success"}
          icon={AlertTriangle}
          description={totalCritical > 0 ? "Immediate action required" : "No critical vulnerabilities"}
        />
        <MetricCard
          label="High Severity"
          value={totalHigh}
          variant={totalHigh > 0 ? "warning" : "success"}
          icon={Activity}
          description={totalHigh > 0 ? "Review recommended" : "No high severity issues"}
        />
        <MetricCard
          label="Secrets Found"
          value={secretsFound}
          variant={secretsFound > 0 ? "danger" : "success"}
          icon={Key}
          description={secretsFound > 0 ? "Credential exposure detected" : "No secrets detected"}
        />
        <MetricCard
          label="Total Findings"
          value={totalIssues}
          variant="default"
          icon={TrendingUp}
          description="Across all security scans"
        />
      </div>

      {/* Pipeline */}
      <PipelineStatus stages={data?.pipeline_stages} />

      {/* Scan cards */}
      {data && (
        <div className="grid grid-cols-2 gap-4">
          <ScanCard
            title="SAST · Bandit + Semgrep"
            icon={<Shield size={16} />}
            data={data.sast}
            description="Static application security testing"
          />
          <ScanCard
            title="Container · Trivy"
            icon={<Package size={16} />}
            data={data.trivy}
            description="Docker image vulnerability scan"
          />
          <ScanCard
            title="Secrets · TruffleHog"
            icon={<Key size={16} />}
            data={data.secrets}
            description="Git history secrets detection"
          />

          {/* DAST card */}
          <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-blue-400 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">DAST · OWASP ZAP</p>
                    <p className="text-xs text-slate-400 mt-0.5">Dynamic application security testing</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  passed
                </span>
              </div>
            </div>
            <div className="px-5 py-4 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <CheckCircle2 size={22} className="text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Scan completed</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                API endpoints scanned via OpenAPI spec
              </p>
              <a
                href="https://github.com/Emmanuellamah64/devsecops-pipeline-template/security/code-scanning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                View in GitHub Security tab
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      )}

      {lastUpdated && (
        <p className="text-xs text-slate-400 text-right pb-2">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};
