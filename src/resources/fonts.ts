import { majicoFetchJson, projectMcpPath } from "../http.js";
import type {
  FontPairCandidatesResponse,
  FontPairSelectResponse,
  MajicoClientConfig,
} from "../types.js";

export class FontsResource {
  constructor(private readonly config: MajicoClientConfig) {}

  /**
   * Lists font-pair options from the project's guidelines snapshot.
   */
  async listCandidates(): Promise<FontPairCandidatesResponse> {
    return majicoFetchJson<FontPairCandidatesResponse>(
      this.config,
      `${projectMcpPath(this.config, "/fonts")}?candidates=1`
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
