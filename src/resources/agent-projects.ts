import { majicoAgentFetchJson } from "../agent-http.js";
import type {
  AgentProjectBootstrapResponse,
  AgentProjectListItem,
  MajicoAgentClientConfig,
} from "../agent-types.js";

export class AgentProjectsResource {
  constructor(private readonly config: MajicoAgentClientConfig) {}

  async bootstrap(name: string): Promise<AgentProjectBootstrapResponse> {
    return majicoAgentFetchJson<AgentProjectBootstrapResponse>(
      this.config,
      "/api/agent/projects",
      {
        method: "POST",
        body: JSON.stringify({ name }),
      }
    );
  }

  async list(): Promise<{
    projects: AgentProjectListItem[];
    apiBaseUrl: string;
  }> {
    return majicoAgentFetchJson(this.config, "/api/agent/projects", {
      method: "GET",
    });
  }
}
