import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { CursorHandoffResponse, MajicoClientConfig } from "../types.js";

export class CursorHandoffResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<CursorHandoffResponse> {
    return majicoFetchJson<CursorHandoffResponse>(
      this.config,
      projectMcpPath(this.config, "/cursor-handoff")
    );
  }

  async ack(
    handoffId: string
  ): Promise<{ ok: boolean; acknowledgedAt: string }> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/cursor-handoff"),
      {
        method: "PATCH",
        body: JSON.stringify({ handoffId }),
      }
    );
  }
}
