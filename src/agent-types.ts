export type MajicoAgentClientConfig = {
  /** App base URL, e.g. https://majico.d3bu7.com */
  baseUrl: string;
  /** MAJICO_AGENT_API_SECRET */
  agentSecret: string;
  timeoutMs?: number;
};

export type AgentProjectBootstrapResponse = {
  id: string;
  name: string | null;
  projectApiKey: string | null;
  created: boolean;
  proUnlocked: boolean;
  apiBaseUrl: string;
  mcpConfig?: {
    mcpServers: {
      majico: {
        command: string;
        args: string[];
        env: Record<string, string>;
      };
    };
  };
  hint?: string;
};

export type AgentProjectListItem = {
  id: string;
  name: string | null;
  createdAt: string;
  hasApiKey: boolean;
};
