import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type GrokGenerateSvgInput = {
  prompt: string;
  model?: string;
  n?: number;
  instructions?: string;
};

export type GrokGenerateSvgResponse = {
  ok: boolean;
  svgs: string[];
  errors?: Array<string | null>;
};

export type GrokVectorizeSvgInput = {
  imageBase64: string;
  model?: string;
};

export type GrokVectorizeSvgResponse = {
  ok: boolean;
  svg: string | null;
  error?: string;
};

export class GrokResource {
  constructor(private readonly config: MajicoClientConfig) {}

  /** Prompt → raster (Grok image model) → SVG (Grok multimodal model). */
  async generateSvg(
    input: GrokGenerateSvgInput
  ): Promise<GrokGenerateSvgResponse> {
    return majicoFetchJson<GrokGenerateSvgResponse>(
      this.config,
      projectMcpPath(this.config, "/external/grok/generate-svg"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  /** Raster image (base64 or URL) → SVG via Grok multimodal model. */
  async vectorizeSvg(
    input: GrokVectorizeSvgInput
  ): Promise<GrokVectorizeSvgResponse> {
    return majicoFetchJson<GrokVectorizeSvgResponse>(
      this.config,
      projectMcpPath(this.config, "/external/grok/vectorize"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
