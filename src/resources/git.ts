import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type GitImportRepoInput = {
  owner: string;
  repo: string;
  ref?: string;
  provider?: "github" | "gitlab";
};

export type GitPublishLandingInput = {
  target?: "new_repo" | "existing_repo" | "org_landing";
  provider?: "github" | "gitlab";
  elementId?: string;
  html?: string;
  owner?: string;
  repo?: string;
  branch?: string;
  orgLandingPath?: string;
};

export type GitJobResponse = {
  ok: boolean;
  jobId: string;
  status?: string;
  target?: string;
  provider?: string;
  projectId?: string;
};

export class GitResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async importRepo(input: GitImportRepoInput): Promise<GitJobResponse> {
    return majicoFetchJson<GitJobResponse>(
      this.config,
      projectMcpPath(this.config, "/git/import"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }

  async publishLandingPage(
    input: GitPublishLandingInput = {}
  ): Promise<GitJobResponse> {
    return majicoFetchJson<GitJobResponse>(
      this.config,
      projectMcpPath(this.config, "/git/publish"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
