export { MajicoClient } from "./client.js";
export { MajicoAgentClient } from "./agent-client.js";
export type {
  MajicoAgentClientConfig,
  AgentProjectBootstrapResponse,
  AgentProjectListItem,
} from "./agent-types.js";
export { MajicoError, parseMajicoError } from "./errors.js";
export type { MajicoErrorCode, MajicoErrorBody } from "./errors.js";
export {
  majicoFetchJson,
  majicoFetchRaw,
  normalizeBaseUrl,
  projectMcpPath,
  validateClientConfig,
} from "./http.js";
export type {
  BrandProfile,
  BrandMdResponse,
  DesignMdResponse,
  DesignTokens,
  ExportManifest,
  ExportManifestEntry,
  GuidelinesResponse,
  LogoResponse,
  PaletteCandidatesResponse,
  PaletteOption,
  PaletteSelectResponse,
  PulsePostsResponse,
  PulseStatusResponse,
  BlogPostsListResponse,
  BlogPostResponse,
  BlogOpportunitiesResponse,
  BlogSeoHandoffResponse,
  MajicoClientConfig,
  StudioCanvas,
  StudioResponse,
} from "./types.js";
export type { PatchHtmlFrameInput } from "./resources/studio.js";
export type {
  McpProjectListItem,
  McpProjectsListResponse,
  McpProjectPingResponse,
} from "./resources/projects.js";
