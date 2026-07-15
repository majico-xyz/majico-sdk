import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type GenerateAssetInput = {
  skillId: string;
  elementId?: string;
  flowGroupId?: string;
  params?: Record<string, unknown>;
  context?: Record<string, unknown>;
  forceResearchRefresh?: boolean;
  skipDedup?: boolean;
};

export type GenerateAssetResponse = {
  ok: boolean;
  skillId: string;
  jobId: string;
  deduped?: boolean;
  async: boolean;
  snapshotId?: string | null;
  scopeChain: string[];
  backend: string;
  pipelineJobType?: string | null;
  renderResult?: Record<string, unknown> | null;
};

export type AssetJobStatusResponse = {
  ok: boolean;
  job: Record<string, unknown>;
};

export type ListAssetsResponse = {
  ok: boolean;
  jobs: Array<Record<string, unknown>>;
};

export type PatchInvestorAskSlideInput = {
  raiseAmount: string;
  useOfFunds: Array<{ label: string; percent: number }>;
  deckElementId?: string;
  headline?: string;
};

export type PatchInvestorAskSlideResponse = {
  ok: true;
  deckElementId: string;
  slideCount: number;
  idempotent: boolean;
};

export class AssetsResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async generate(input: GenerateAssetInput): Promise<GenerateAssetResponse> {
    return majicoFetchJson<GenerateAssetResponse>(
      this.config,
      projectMcpPath(this.config, "/assets/generate"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async getStatus(args: { jobId: string }): Promise<AssetJobStatusResponse> {
    return majicoFetchJson<AssetJobStatusResponse>(
      this.config,
      projectMcpPath(
        this.config,
        `/assets/${encodeURIComponent(args.jobId.trim())}`
      )
    );
  }

  async list(args?: {
    skillId?: string;
    limit?: number;
  }): Promise<ListAssetsResponse> {
    const params = new URLSearchParams();
    if (args?.skillId) params.set("skillId", args.skillId);
    if (args?.limit) params.set("limit", String(args.limit));
    const qs = params.toString();
    return majicoFetchJson<ListAssetsResponse>(
      this.config,
      projectMcpPath(this.config, `/assets${qs ? `?${qs}` : ""}`)
    );
  }

  async patchInvestorAskSlide(
    input: PatchInvestorAskSlideInput
  ): Promise<PatchInvestorAskSlideResponse> {
    return majicoFetchJson<PatchInvestorAskSlideResponse>(
      this.config,
      projectMcpPath(this.config, "/investor-pack/patch-ask-slide"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
