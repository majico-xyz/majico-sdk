import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { BrandProfile, MajicoClientConfig } from "../types.js";

export class BrandResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<BrandProfile> {
    return majicoFetchJson<BrandProfile>(
      this.config,
      projectMcpPath(this.config, "/brand")
    );
  }
}
