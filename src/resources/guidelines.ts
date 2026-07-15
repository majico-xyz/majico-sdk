import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { GuidelinesResponse, MajicoClientConfig } from "../types.js";

export class GuidelinesResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<GuidelinesResponse> {
    return majicoFetchJson<GuidelinesResponse>(
      this.config,
      projectMcpPath(this.config, "/guidelines")
    );
  }
}
