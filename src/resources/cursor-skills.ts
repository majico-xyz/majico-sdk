import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { MajicoClientConfig } from "../types.js";

export type CursorSkillsResponse = {
  version: 1;
  projectId: string;
  source: string;
  skills: Array<{
    skillSlug: string;
    name: string;
    description: string;
    phase: string;
    priority: number;
    enabled: boolean;
    installPath: string;
    skillMd: string;
  }>;
  workflowHint: string;
  readingOrder: string[];
  markdown?: string;
  install?: {
    version: 1;
    projectId: string;
    targetRoot: string;
    files: Array<{ path: string; content: string; skillSlug: string }>;
    agentInstructions: string;
  };
};

export type UpdateCursorSkillInput = {
  skillSlug: string;
  name?: string;
  description?: string;
  bodyMd?: string;
  phase?: string;
  priority?: number;
  enabled?: boolean;
  meta?: Record<string, unknown>;
};

export class CursorSkillsResource {
  constructor(private readonly config: MajicoClientConfig) {}

  /** List project cursor skills; seeds defaults on first fetch. */
  async list(options?: { install?: boolean }): Promise<CursorSkillsResponse> {
    const query = options?.install ? "?install=1" : "";
    return majicoFetchJson<CursorSkillsResponse>(
      this.config,
      projectMcpPath(this.config, `/cursor-skills${query}`)
    );
  }

  /** Sync manifest — alias for list with install=1. */
  async syncInstallManifest(): Promise<CursorSkillsResponse> {
    return this.list({ install: true });
  }

  /** Update one skill (user-editable). */
  async update(input: UpdateCursorSkillInput): Promise<{ ok: boolean }> {
    return majicoFetchJson<{ ok: boolean }>(
      this.config,
      projectMcpPath(this.config, "/cursor-skills"),
      {
        method: "PATCH",
        body: JSON.stringify(input),
      }
    );
  }
}
