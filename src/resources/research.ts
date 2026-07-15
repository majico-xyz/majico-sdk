import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type WebSearchInput = {
  query: string;
  limit?: number;
};

export type WebSearchResponse = {
  ok: boolean;
  query: string;
  results: Array<{ title?: string; url?: string; snippet?: string }>;
};

export type RunAssetResearchInput = {
  skillId: string;
  context?: Record<string, unknown>;
  refresh?: "full" | "light" | "auto";
};

export type RunAssetResearchResponse = {
  ok: boolean;
  skillId: string;
  snapshotId: string;
  mode: string;
  queryCount: number;
  degraded: boolean;
  synthesis: string;
  bundle: Record<string, unknown>;
};

export class ResearchResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async webSearch(input: WebSearchInput): Promise<WebSearchResponse> {
    return majicoFetchJson<WebSearchResponse>(
      this.config,
      projectMcpPath(this.config, "/research/web-search"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async runAssetResearch(
    input: RunAssetResearchInput
  ): Promise<RunAssetResearchResponse> {
    return majicoFetchJson<RunAssetResearchResponse>(
      this.config,
      projectMcpPath(this.config, "/research/asset"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async getJob(jobId: string): Promise<Record<string, unknown>> {
    return majicoFetchJson<Record<string, unknown>>(
      this.config,
      `/api/jobs/${encodeURIComponent(jobId.trim())}`
    );
  }

  async runNicheResearch(input?: {
    brief?: Record<string, unknown>;
    marketScan?: boolean;
    sourceFlowId?: string;
  }): Promise<{ ok: boolean; jobId: string; async: boolean }> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/research/niche"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input ?? {}),
      }
    );
  }

  async runMarketScan(input?: {
    keywords?: string[];
    productName?: string;
    oneLiner?: string;
    audience?: string;
  }): Promise<{ ok: boolean; signal: Record<string, unknown> }> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/research/market-scan"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input ?? {}),
      }
    );
  }
}
