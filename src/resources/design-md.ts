import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { DesignMdResponse, MajicoClientConfig } from "../types.js";

export class DesignMdResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<DesignMdResponse> {
    return majicoFetchJson<DesignMdResponse>(
      this.config,
      projectMcpPath(this.config, "/design-md")
    );
  }
}
