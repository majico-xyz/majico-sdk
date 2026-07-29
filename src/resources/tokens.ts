import { majicoFetchJson, projectMcpPath, withIfNoneMatch } from "../http.js";
import type {
  BrandAssetGetOptions,
  DesignTokens,
  MajicoClientConfig,
  UnchangedBrandAssetResponse,
} from "../types.js";

export class TokensResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(
    options?: BrandAssetGetOptions
  ): Promise<DesignTokens | UnchangedBrandAssetResponse> {
    return majicoFetchJson<DesignTokens | UnchangedBrandAssetResponse>(
      this.config,
      withIfNoneMatch(
        projectMcpPath(this.config, "/tokens"),
        options?.ifNoneMatch
      )
    );
  }
}
