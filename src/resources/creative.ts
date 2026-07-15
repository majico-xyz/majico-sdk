import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type CreativeGenerateInput = {
  slotId?: string;
  prompt?: string;
  slots?: Array<{ slotId: string; prompt?: string }>;
};

export type CreativeRefineInput = {
  slotId?: string;
  refinePrompt?: string;
  prompt?: string;
};

export type CreativeJobResponse = {
  ok: boolean;
  jobId: string;
  type: string;
};

export class CreativeResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async generate(
    input: CreativeGenerateInput = {}
  ): Promise<CreativeJobResponse> {
    return majicoFetchJson<CreativeJobResponse>(
      this.config,
      projectMcpPath(this.config, "/creative/generate"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async refine(input: CreativeRefineInput = {}): Promise<CreativeJobResponse> {
    return majicoFetchJson<CreativeJobResponse>(
      this.config,
      projectMcpPath(this.config, "/creative/refine"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}

export type FigmaPushTokensInput = {
  fileKey?: string;
};

export type FigmaPushTokensResponse = {
  ok: boolean;
  collectionId?: string;
  variableCount: number;
};

export type FigmaSyncProjectAssetsInput = {
  fileKey?: string;
};

export type FigmaSyncProjectAssetsResponse = {
  ok: boolean;
  fileKey: string;
  summary: {
    create: number;
    update: number;
    skip: number;
    delete: number;
    total: number;
  };
  summaryText: string;
  restApplied: string[];
  restErrors: Array<{ assetId: string; error: string }>;
  mcpInstructions: Array<{
    assetId: string;
    action: "create" | "update";
    kind: string;
    label: string;
    instruction: string;
  }>;
  agentPrompt: string;
};

export class FigmaResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async pushDesignTokens(
    input: FigmaPushTokensInput = {}
  ): Promise<FigmaPushTokensResponse> {
    return majicoFetchJson<FigmaPushTokensResponse>(
      this.config,
      projectMcpPath(this.config, "/figma/push-tokens"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async syncProjectAssets(
    input: FigmaSyncProjectAssetsInput = {}
  ): Promise<FigmaSyncProjectAssetsResponse> {
    return majicoFetchJson<FigmaSyncProjectAssetsResponse>(
      this.config,
      projectMcpPath(this.config, "/figma/sync"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
