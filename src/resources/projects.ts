import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type McpProjectListItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  hasBrandData: boolean;
  hasCanvasData: boolean;
};

export type McpProjectsListResponse = {
  projects: McpProjectListItem[];
  activeProjectId: string;
  userId: string;
};

export type McpProjectPingResponse = {
  ok: boolean;
  projectId: string;
  projectName: string;
  slug: string;
  userId: string | null;
  hasBrandData: boolean;
  hasCanvasData: boolean;
  previewToken?: string | null;
  previewPickerUrl?: string | null;
};

export type McpCreateProjectResponse = {
  id: string;
  name: string | null;
  slug: string;
  projectApiKey: string | null;
  projectApiKeyAutomationOnly?: boolean;
  hasBrandData: false;
  oauthMcpConfig: {
    type: "http";
    url: string;
  };
  httpMcpConfig: {
    type: "http";
    url: string;
    headers: {
      Authorization: string;
      "X-Majico-Project-Id": string;
    };
  } | null;
  oauthReconnectInstructions: string[];
  nextSteps: string[];
};

export class ProjectsResource {
  constructor(private readonly config: MajicoClientConfig) {}

  /** List projects for the authenticated MCP user. */
  async list(): Promise<McpProjectsListResponse> {
    return majicoFetchJson<McpProjectsListResponse>(
      this.config,
      "/api/mcp/projects"
    );
  }

  /** Lightweight project scope + brand readiness check. */
  async ping(): Promise<McpProjectPingResponse> {
    return majicoFetchJson<McpProjectPingResponse>(
      this.config,
      projectMcpPath(this.config, "/ping")
    );
  }

  /** Create a new branding project for the authenticated MCP user. */
  async create(name: string): Promise<McpCreateProjectResponse> {
    return majicoFetchJson<McpCreateProjectResponse>(
      this.config,
      "/api/mcp/projects",
      {
        method: "POST",
        body: JSON.stringify({ name }),
      }
    );
  }
}
