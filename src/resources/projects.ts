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

export type McpProjectApiKeyResponse = {
  ok: true;
  projectId: string;
  projectApiKey: string;
  rotated: boolean;
  httpMcpConfig: {
    type: "http";
    url: string;
    headers: {
      Authorization: string;
      "X-Majico-Project-Id": string;
    };
  };
  envSnippet: {
    MAJICO_API_URL: string;
    MAJICO_PROJECT_ID: string;
    MAJICO_API_KEY: string;
  };
  instructions: string[];
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      }
    );
  }

  /**
   * Soft-delete a project owned by the authenticated user.
   * Requires `{ confirm: true }`. Anonymizes the row (does not hard-delete).
   */
  async delete(
    projectId: string,
    options: { confirm: true }
  ): Promise<{ ok: true; projectId: string }> {
    if (options.confirm !== true) {
      throw new Error("confirm: true is required to delete a project");
    }
    return majicoFetchJson<{ ok: true; projectId: string }>(
      this.config,
      "/api/mcp/projects",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, confirm: true }),
      }
    );
  }

  /**
   * Mint (if missing) or return the project API key for agent reuse after OAuth.
   * Pass `{ rotate: true }` to invalidate the previous key.
   */
  async getApiKey(options?: {
    rotate?: boolean;
  }): Promise<McpProjectApiKeyResponse> {
    const rotate = options?.rotate === true;
    return majicoFetchJson<McpProjectApiKeyResponse>(
      this.config,
      projectMcpPath(this.config, "/api-key"),
      rotate
        ? { method: "POST", body: JSON.stringify({ rotate: true }) }
        : { method: "GET" }
    );
  }
}
