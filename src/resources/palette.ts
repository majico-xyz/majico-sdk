import { majicoFetchJson, projectMcpPath } from "../http.js";
import type {
  MajicoClientConfig,
  PaletteCandidatesResponse,
  PaletteSelectResponse,
} from "../types.js";

export class PaletteResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async listCandidates(): Promise<PaletteCandidatesResponse> {
    return majicoFetchJson<PaletteCandidatesResponse>(
      this.config,
      `${projectMcpPath(this.config, "/palettes")}?candidates=1`
    );
  }

  async select(args: { optionId: string }): Promise<PaletteSelectResponse> {
    return majicoFetchJson<PaletteSelectResponse>(
      this.config,
      projectMcpPath(this.config, "/palettes"),
      {
        method: "PATCH",
        body: JSON.stringify({ optionId: args.optionId }),
      }
    );
  }
}
