export type MajicoClientConfig = {
  apiKey: string;
  projectId: string;
  baseUrl?: string;
  retry?: {
    max?: number;
    retryOn?: number[];
  };
  timeoutMs?: number;
  exportTimeoutMs?: number;
};

export type BrandProfile = {
  primaryArchetype: string | null;
  secondaryArchetype: string | null;
  archetypeBalance: string | null;
  nicheIntent: string | null;
  brandTones: string[];
};

export type DesignTokens = {
  tokens: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  headingFont: string | null;
  bodyFont: string | null;
};

export type LogoResponse = {
  selectedLogoTemplateId: string | null;
  logoSvg: string | null;
  logoFavorites: unknown[];
};

export type LogoCandidate = {
  id: string;
  kind: "generated" | "template";
  previewSvg: string;
  templateId?: string | null;
  userRating?: "favorite" | "bad" | null;
};

export type LogoCandidatesResponse = LogoResponse & {
  candidates: LogoCandidate[];
  shortlistCount: number;
  projectId?: string | null;
  projectName?: string | null;
  previewToken?: string | null;
  previewPickerUrl?: string | null;
  browserLogoUrl?: string | null;
  agentInstructions?: string;
};

export type CursorHandoffEvent =
  | "logo_shortlisted"
  | "logo_selected"
  | "brand_ready"
  | "palette_selected"
  | "pulse_x_linked"
  | "tweet_draft_selected";

export type CursorHandoffPayload = {
  version: 1;
  id: string;
  event: CursorHandoffEvent;
  projectId: string;
  at: string;
  browserUrl: string;
  chatPrompt: string;
  meta?: Record<string, unknown>;
};

export type CursorHandoffResponse = {
  pending: boolean;
  handoff: CursorHandoffPayload | null;
  acknowledgedAt: string | null;
};

export type LogoSelectResponse = {
  logoSvg: string;
  selectedLogoTemplateId: string | null;
  cursorHandoff: CursorHandoffPayload;
};

export type GuidelinesResponse = {
  productName: string;
  markdown: string;
  llmPrompt: string;
};

export type DesignMdResponse = {
  markdown: string;
  productName: string;
};

export type BrandMdResponse = {
  markdown: string;
  productName: string;
  source?: "job" | "scaffold";
  jobId?: string | null;
};

export type StudioCanvas = {
  version?: number;
  elements?: unknown[];
  nodes?: unknown[];
  edges?: unknown[];
  viewport?: unknown;
};

export type StudioResponse = {
  studioCanvas: StudioCanvas | null;
  studioAgentHistory: unknown[];
};

export type ExportManifestEntry = {
  path: string;
  description: string;
};

export type ExportManifest = {
  productName: string;
  files: ExportManifestEntry[];
};

export type PaletteOption = {
  optionId: string;
  label: string;
  harmonyId: string | null;
  reason: string | null;
  description: string | null;
  swatches: { light: string[]; dark: string[] };
  previewTokens?: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  isSelected: boolean;
};

export type PaletteCandidatesResponse = {
  options: PaletteOption[];
  selectedOptionId: string | null;
  paletteTokens: {
    light: Record<string, string>;
    dark: Record<string, string>;
  } | null;
  headingFont?: string | null;
  bodyFont?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  previewToken?: string | null;
  previewPickerUrl?: string | null;
  agentInstructions?: string;
};

export type PaletteSelectResponse = {
  paletteTokens: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  selectedOptionId: string | null;
  cursorHandoff: CursorHandoffPayload;
};

export type PulseStatusResponse = {
  linked: boolean;
  organizationId: string | null;
  accountCount: number;
  postCount: number;
};

export type PulsePostsResponse = {
  posts: unknown[];
  widgetRows: Array<{
    id: string;
    title: string;
    impressions: string;
    er: string;
    postedAt: string;
  }>;
  agentInstructions?: string;
};

export type PulseTweetDraftsResponse = {
  drafts: Array<{ draftId: string; text: string }>;
  provider: string;
  model: string;
  agentInstructions?: string;
};

export type PulseTweetDraftSelectResponse = {
  elementId: string;
  cursorHandoff: CursorHandoffPayload;
};

export type PulseCalendarSlotsResponse = {
  slots: Array<{
    slotId: string;
    title: string;
    platform: string;
    status: string;
    scheduledAt: string | null;
    trustLevel: string;
    contentPlanPostId: string;
    variantCount: number;
    selectedVariantId: string | null;
  }>;
  agentInstructions?: string;
};

export type PulsePostVariantsResponse = {
  ok: boolean;
  slotId: string;
  variants: Array<{
    variantId: string;
    label: string;
    text: string;
    charCount: number;
    compliance: string;
  }>;
  agentInstructions?: string;
};

export type PulseSlotActionResponse = {
  ok: boolean;
  slotId: string;
  status?: string;
  trustLevel?: string;
  scheduledAt?: string;
  variantId?: string;
  text?: string;
};

export type PulsePerformanceInsightsResponse = {
  ok: boolean;
  insights: Array<{
    headline: string;
    detail: string;
    multiplier?: number;
  }>;
};

export type ProductOpsViewResponse = {
  view: "product_ops";
  suggestedFilename: string;
  generatedAt: string;
  agentInstruction: string;
  canvasActions: Array<{
    id: string;
    label: string;
    chatPrompt?: string;
    browserUrl?: string;
  }>;
  sections: Record<string, unknown>;
};

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  primary_keyword: string | null;
  generation_status?: string;
  status: string;
  published_at: string | null;
  updated_at: string;
};

export type BlogPostsListResponse = {
  posts: BlogPostSummary[];
};

export type BlogPostResponse = {
  post: Record<string, unknown>;
};

export type BlogOpportunitiesResponse = {
  opportunities: unknown[];
  context: unknown;
  agentInstructions?: string;
};

export type BlogResearchResponse = {
  dossier: unknown;
  context: unknown;
  post: Record<string, unknown>;
  agentInstructions?: string;
};

export type BlogOutlineResponse = {
  outline: unknown;
  post: Record<string, unknown>;
  agentInstructions?: string;
};

export type BlogWorkflowStepResponse = {
  outline?: unknown;
  postId: string;
  generation_status: string;
  agentInstructions?: string;
};

export type BlogSectionDraftResponse = {
  section: unknown;
  postId: string;
  generation_status: string;
  tokensCharged?: number;
};

export type BlogAssembleResponse = {
  postId: string;
  generation_status: string;
  body_md: string;
  faq: unknown[];
  seo: unknown;
  agentInstructions?: string;
};

export type BlogPublishResponse = {
  post: unknown;
  scope: string;
  seo: unknown;
};

export type BlogSeoHandoffResponse = {
  version: 1;
  projectId: string;
  workflow: {
    steps: Array<{ tool: string; purpose: string; gate?: string }>;
  };
  seoGate: {
    publishableScoreMin: number;
    rules: Array<{
      id: string;
      label: string;
      requirement: string;
      weightHint?: number;
    }>;
    humanQuality: { description: string };
  };
  technicalSeo: {
    sitemap: string;
    robots: string;
    canonical: string;
    schema: string;
    ogImage: string;
    edgeStatic: string;
  };
  aeo: { guidelines: string[] };
  agentInstructions: string;
  markdown: string;
  post?: {
    postId: string;
    slug: string;
    status: string;
    score: number | null;
    publishable: boolean | null;
    checklist: unknown[];
    fixes: string[];
  };
};
