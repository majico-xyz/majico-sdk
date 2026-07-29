import { majicoFetchJson, projectMcpPath, withIfNoneMatch } from "../http.js";
import type {
  BrandAssetGetOptions,
  DesignMdResponse,
  MajicoClientConfig,
  UnchangedBrandAssetResponse,
} from "../types.js";

export class DesignMdResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(
    options?: BrandAssetGetOptions
  ): Promise<DesignMdResponse | UnchangedBrandAssetResponse> {
    return majicoFetchJson<DesignMdResponse | UnchangedBrandAssetResponse>(
      this.config,
      withIfNoneMatch(
        projectMcpPath(this.config, "/design-md"),
        options?.ifNoneMatch
      )
    );
  }
}
