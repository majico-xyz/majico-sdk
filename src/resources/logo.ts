import { majicoFetchJson, projectMcpPath, withIfNoneMatch } from "../http.js";
import type {
  BrandAssetGetOptions,
  LogoCandidatesResponse,
  LogoResponse,
  LogoSelectResponse,
  MajicoClientConfig,
  UnchangedBrandAssetResponse,
} from "../types.js";

export class LogoResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(
    options?: BrandAssetGetOptions
  ): Promise<LogoResponse | UnchangedBrandAssetResponse> {
    return majicoFetchJson<LogoResponse | UnchangedBrandAssetResponse>(
      this.config,
      withIfNoneMatch(
        projectMcpPath(this.config, "/logos"),
        options?.ifNoneMatch
      )
    );
  }

  async listCandidates(flowId?: string): Promise<LogoCandidatesResponse> {
    const path = projectMcpPath(this.config, "/logos");
    const url = flowId
      ? `${path}?candidates=1&flowId=${encodeURIComponent(flowId)}`
      : `${path}?candidates=1`;
    return majicoFetchJson<LogoCandidatesResponse>(this.config, url);
  }

  async select(args: {
    candidateId?: string;
    templateId?: string;
    svg?: string;
    flowId?: string;
  }): Promise<LogoSelectResponse> {
    return majicoFetchJson<LogoSelectResponse>(
      this.config,
      projectMcpPath(this.config, "/logos"),
      {
        method: "PATCH",
        body: JSON.stringify(args),
      }
    );
  }
}
