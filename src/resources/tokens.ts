import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { DesignTokens, MajicoClientConfig } from "../types.js";

export class TokensResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<DesignTokens> {
    return majicoFetchJson<DesignTokens>(
      this.config,
      projectMcpPath(this.config, "/tokens")
    );
  }
}
