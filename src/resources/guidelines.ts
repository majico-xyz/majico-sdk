import { majicoFetchJson, projectMcpPath, withIfNoneMatch } from "../http.js";
import type {
  BrandAssetGetOptions,
  GuidelinesResponse,
  MajicoClientConfig,
  UnchangedBrandAssetResponse,
} from "../types.js";

export class GuidelinesResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(
    options?: BrandAssetGetOptions
  ): Promise<GuidelinesResponse | UnchangedBrandAssetResponse> {
    return majicoFetchJson<GuidelinesResponse | UnchangedBrandAssetResponse>(
      this.config,
      withIfNoneMatch(
        projectMcpPath(this.config, "/guidelines"),
        options?.ifNoneMatch
      )
    );
  }
}
