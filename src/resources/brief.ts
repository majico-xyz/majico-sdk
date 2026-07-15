import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type SubmitBriefInput = {
  productName: string;
  oneLiner: string;
  audience?: string | null;
  nicheKeywords?: string[];
  goals?: string | null;
  constraints?: string | null;
  stylePresetMode?: "off" | "manual" | "auto";
  stylePresetId?: string | null;
  marketRealityScan?: boolean;
  operatingMode?: string | null;
};

export type SubmitBriefResponse = {
  ok: true;
  projectId: string;
  briefId: string;
  jobId: string;
  status: "pending";
  nextSteps: string[];
};

export class BriefResource {
  constructor(private readonly config: MajicoClientConfig) {}

  /** Submit a product brief and enqueue niche_research via MCP. */
  async submit(input: SubmitBriefInput): Promise<SubmitBriefResponse> {
    return majicoFetchJson<SubmitBriefResponse>(
      this.config,
      projectMcpPath(this.config, "/brief"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
