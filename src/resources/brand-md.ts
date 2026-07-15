import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { BrandMdResponse, MajicoClientConfig } from "../types.js";

export class BrandMdResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<BrandMdResponse> {
    return majicoFetchJson<BrandMdResponse>(
      this.config,
      projectMcpPath(this.config, "/brand-md")
    );
  }
}
