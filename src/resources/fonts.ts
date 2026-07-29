import { majicoFetchJson, projectMcpPath } from "../http.js";
import type {
  FontPairCandidatesResponse,
  FontPairSelectResponse,
  MajicoClientConfig,
} from "../types.js";

export class FontsResource {
  constructor(private readonly config: MajicoClientConfig) {}

  /**
   * Lists font-pair options from the project's guidelines snapshot
   * (falls back to curated pairs; optional mood filters user font feedback).
   */
  async listCandidates(args?: {
    mood?: string;
  }): Promise<FontPairCandidatesResponse> {
    const params = new URLSearchParams({ candidates: "1" });
    const mood = args?.mood?.trim();
    if (mood) params.set("mood", mood);
    return majicoFetchJson<FontPairCandidatesResponse>(
      this.config,
      `${projectMcpPath(this.config, "/fonts")}?${params.toString()}`
    );
  }

  /**
   * Persists a font pair by optionId or explicit heading/body fonts.
   */
  async select(args: {
    optionId?: string;
    headingFont?: string;
    bodyFont?: string;
  }): Promise<FontPairSelectResponse> {
    return majicoFetchJson<FontPairSelectResponse>(
      this.config,
      projectMcpPath(this.config, "/fonts"),
      {
        method: "PATCH",
        body: JSON.stringify({
          ...(args.optionId ? { optionId: args.optionId } : {}),
          ...(args.headingFont ? { headingFont: args.headingFont } : {}),
          ...(args.bodyFont ? { bodyFont: args.bodyFont } : {}),
        }),
      }
    );
  }
}
