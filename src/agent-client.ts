import type { MajicoAgentClientConfig } from "./agent-types.js";
import { AgentProjectsResource } from "./resources/agent-projects.js";
import { MajicoClient } from "./client.js";

export class MajicoAgentClient {
  readonly projects: AgentProjectsResource;
  readonly config: Readonly<MajicoAgentClientConfig>;

  constructor(config: MajicoAgentClientConfig) {
    if (!config.baseUrl?.trim()) {
      throw new Error("baseUrl is required");
    }
    if (!config.agentSecret?.trim()) {
      throw new Error("agentSecret is required");
    }
    this.config = {
      baseUrl: config.baseUrl.trim(),
      agentSecret: config.agentSecret.trim(),
      timeoutMs: config.timeoutMs,
    };
    this.projects = new AgentProjectsResource(this.config);
  }

  /** Bootstrap a project and return a project-scoped MajicoClient for MCP/SDK reads. */
  async bootstrapProject(name: string): Promise<{
    project: Awaited<ReturnType<AgentProjectsResource["bootstrap"]>>;
    client: MajicoClient | null;
  }> {
    const project = await this.projects.bootstrap(name);
    if (!project.projectApiKey) {
      return { project, client: null };
    }
    const client = new MajicoClient({
      apiKey: project.projectApiKey,
      projectId: project.id,
      baseUrl: project.apiBaseUrl,
    });
    return { project, client };
  }
}
