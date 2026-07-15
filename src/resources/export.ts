import { majicoFetchJson, majicoFetchRaw, projectMcpPath } from "../http.js";
import type { ExportManifest, MajicoClientConfig } from "../types.js";

export class ExportResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async getManifest(): Promise<ExportManifest> {
    return majicoFetchJson<ExportManifest>(
      this.config,
      projectMcpPath(this.config, "/export/manifest")
    );
  }

  async downloadZip(): Promise<ArrayBuffer> {
    const res = await majicoFetchRaw(
      this.config,
      projectMcpPath(this.config, "/export"),
      { headers: { Accept: "application/zip, application/octet-stream" } }
    );
    return res.arrayBuffer();
  }
}
