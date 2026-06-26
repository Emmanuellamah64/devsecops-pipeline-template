import React, { useEffect, useState } from "react";
import { Shield, Package, Key, Globe, RefreshCw } from "lucide-react";
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

  const fetchData = async () => {
    try {
      const [sast, trivy, secrets] = await Promise.all([
        client.get("/reports/sast"),
        client.get("/reports/trivy"),
        client.get("/reports/secrets"),
      ]);
      setData({
        sast: sast.data,
        trivy: trivy.data,
        secrets: secrets.data,
      });
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError("Failed to load security reports. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const totalCritical = data ? (data.trivy.critical ?? 0) : 0;
  const totalHigh = data ? (data.sast.high ?? 0) + (data.trivy.high ?? 0) : 0;
  const secretsFound = data ? (data.secrets.high ?? 0) : 0;
  const totalIssues = data ? (data.sast.total ?? 0) + (data.trivy.total ?? 0) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Loading security reports...</span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-medium text-gray-900">Security Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            devsecops-pipeline-template · auto-refresh every 30s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-green-700 font-medium">Live</span>
          <button
            onClick={fetchData}
            className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-4 gap-3 mb-6">
        <MetricCard
          label="Critical CVEs"
          value={totalCritical}
          variant={totalCritical > 0 ? "danger" : "success"}
        />
        <MetricCard
          label="High severity"
          value={totalHigh}
          variant={totalHigh > 0 ? "warning" : "success"}
        />
        <MetricCard
          label="Secrets found"
          value={secretsFound}
          variant={secretsFound > 0 ? "danger" : "success"}
        />
        <MetricCard label="Total issues" value={totalIssues} />
      </div>

      <div className="mb-6">
        <PipelineStatus stages={data?.pipeline_stages} />
      </div>

      {data && (
        <div className="grid grid-cols-2 gap-4">
          <ScanCard
            title="SAST · Bandit + Semgrep"
            icon={<Shield size={16} />}
            data={data.sast}
          />
          <ScanCard
            title="Container · Trivy"
            icon={<Package size={16} />}
            data={data.trivy}
          />
          <ScanCard
            title="Secrets · TruffleHog"
            icon={<Key size={16} />}
            data={data.secrets}
          />
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Globe size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">DAST · OWASP ZAP</p>
              <p className="text-xs mt-1">Results visible in GitHub Security tab</p>
            </div>
          </div>
        </div>
      )}

      {lastUpdated && (
        <p className="text-xs text-gray-400 text-right mt-4">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};
