import { majicoFetchJson, projectMcpPath } from "../http.js";
import type {
  LogoCandidatesResponse,
  LogoResponse,
  LogoSelectResponse,
  MajicoClientConfig,
} from "../types.js";

export class LogoResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<LogoResponse> {
    return majicoFetchJson<LogoResponse>(
      this.config,
      projectMcpPath(this.config, "/logos")
    );
  }

  async listCandidates(flowId?: string): Promise<LogoCandidatesResponse> {
    const path = projectMcpPath(this.config, "/logos");
    const url = flowId
      ? `${path}?candidates=1&flowId=${encodeURIComponent(flowId)}`
      : `${path}?candidates=1`;
    return majicoFetchJson<LogoCandidatesResponse>(this.config, url);
  }

  async select(args: {
    candidateId?: string;
    templateId?: string;
    svg?: string;
    flowId?: string;
  }): Promise<LogoSelectResponse> {
    return majicoFetchJson<LogoSelectResponse>(
      this.config,
      projectMcpPath(this.config, "/logos"),
      {
        method: "PATCH",
        body: JSON.stringify(args),
      }
    );
  }
}
