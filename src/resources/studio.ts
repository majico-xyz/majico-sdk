import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig, StudioResponse } from "../types.js";

export type PatchHtmlFrameInput = {
  elementId: string;
  html: string;
};

export class StudioResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<StudioResponse> {
    return majicoFetchJson<StudioResponse>(
      this.config,
      projectMcpPath(this.config, "/studio")
    );
  }

  async patchHtmlFrame(input: PatchHtmlFrameInput): Promise<StudioResponse> {
    return majicoFetchJson<StudioResponse>(
      this.config,
      projectMcpPath(this.config, "/studio"),
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elementId: input.elementId,
          html: input.html,
        }),
      }
    );
  }
}
