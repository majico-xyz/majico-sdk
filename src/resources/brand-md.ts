import { majicoFetchJson, projectMcpPath, withIfNoneMatch } from "../http.js";
import type {
  BrandAssetGetOptions,
  BrandMdResponse,
  MajicoClientConfig,
  UnchangedBrandAssetResponse,
} from "../types.js";

export class BrandMdResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(
    options?: BrandAssetGetOptions
  ): Promise<BrandMdResponse | UnchangedBrandAssetResponse> {
    return majicoFetchJson<BrandMdResponse | UnchangedBrandAssetResponse>(
      this.config,
      withIfNoneMatch(
        projectMcpPath(this.config, "/brand-md"),
        options?.ifNoneMatch
      )
    );
  }
}
