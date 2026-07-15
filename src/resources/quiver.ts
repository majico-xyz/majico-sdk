import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type QuiverGenerateSvgInput = {
  prompt: string;
  model?: string;
  n?: number;
  instructions?: string;
};

export type QuiverGenerateSvgResponse = {
  ok: boolean;
  svgs: string[];
  credits: number;
  requestId: string | null;
};

export type QuiverModelsResponse = {
  ok: boolean;
  models: Array<Record<string, unknown>>;
};

export class QuiverResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async generateSvg(
    input: QuiverGenerateSvgInput
  ): Promise<QuiverGenerateSvgResponse> {
    return majicoFetchJson<QuiverGenerateSvgResponse>(
      this.config,
      projectMcpPath(this.config, "/external/quiver/generate-svg"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async listModels(): Promise<QuiverModelsResponse> {
    return majicoFetchJson<QuiverModelsResponse>(
      this.config,
      projectMcpPath(this.config, "/external/quiver/generate-svg")
    );
  }

  async vectorizeSvg(input: {
    imageBase64: string;
    model?: string;
    autoCrop?: boolean;
    targetSize?: number;
  }): Promise<{
    ok: boolean;
    svg: string | null;
    credits: number;
    requestId: string | null;
  }> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/external/quiver/vectorize"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
