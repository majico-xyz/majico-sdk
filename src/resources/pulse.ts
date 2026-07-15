import { majicoFetchJson, projectMcpPath } from "../http.js";
import type {
  MajicoClientConfig,
  ProductOpsViewResponse,
  PulseCalendarSlotsResponse,
  PulsePerformanceInsightsResponse,
  PulsePostVariantsResponse,
  PulsePostsResponse,
  PulseSlotActionResponse,
  PulseStatusResponse,
  PulseTweetDraftsResponse,
  PulseTweetDraftSelectResponse,
} from "../types.js";

export class PulseResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async getStatus(): Promise<PulseStatusResponse> {
    return majicoFetchJson<PulseStatusResponse>(
      this.config,
      projectMcpPath(this.config, "/pulse/status")
    );
  }

  async generateTweetDrafts(args?: {
    prompt?: string;
  }): Promise<PulseTweetDraftsResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/pulse/tweet-studio/generate"),
      {
        method: "POST",
        body: JSON.stringify({ prompt: args?.prompt }),
      }
    );
  }

  async selectTweetDraft(args: {
    draftId: string;
    text: string;
  }): Promise<PulseTweetDraftSelectResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/pulse/tweet-studio/select"),
      {
        method: "PATCH",
        body: JSON.stringify(args),
      }
    );
  }

  async listPosts(args?: {
    sort?: "best" | "recent";
    limit?: number;
  }): Promise<PulsePostsResponse> {
    const params = new URLSearchParams();
    if (args?.sort) params.set("sort", args.sort);
    if (args?.limit != null) params.set("limit", String(args.limit));
    const qs = params.toString();
    const path = qs
      ? `${projectMcpPath(this.config, "/pulse/posts")}?${qs}`
      : projectMcpPath(this.config, "/pulse/posts");
    return majicoFetchJson<PulsePostsResponse>(this.config, path);
  }

  /** Lists upcoming publish slots from the content-plan sync queue. */
  async listCalendarSlots(args?: {
    limit?: number;
    platform?: string;
  }): Promise<PulseCalendarSlotsResponse> {
    const params = new URLSearchParams();
    if (args?.limit != null) params.set("limit", String(args.limit));
    if (args?.platform) params.set("platform", args.platform);
    const qs = params.toString();
    const path = qs
      ? `${projectMcpPath(this.config, "/pulse/slots")}?${qs}`
      : projectMcpPath(this.config, "/pulse/slots");
    return majicoFetchJson<PulseCalendarSlotsResponse>(this.config, path);
  }

  /** Generates A/B variants for a publish slot. */
  async generatePostVariants(args: {
    slotId: string;
    prompt?: string;
  }): Promise<PulsePostVariantsResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/pulse/slots/variants/generate"),
      {
        method: "POST",
        body: JSON.stringify(args),
      }
    );
  }

  /** Persists chosen variant on a publish slot. */
  async selectPostVariant(args: {
    slotId: string;
    variantId: string;
  }): Promise<PulseSlotActionResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/pulse/slots/variants/select"),
      {
        method: "PATCH",
        body: JSON.stringify(args),
      }
    );
  }

  /** Human approval; increments trust counter. */
  async approvePublishSlot(args: {
    slotId: string;
  }): Promise<PulseSlotActionResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/pulse/slots/approve"),
      {
        method: "POST",
        body: JSON.stringify(args),
      }
    );
  }

  /** Sets scheduled_at on a publish slot. */
  async schedulePublishSlot(args: {
    slotId: string;
    scheduledAt: string;
  }): Promise<PulseSlotActionResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/pulse/slots/schedule"),
      {
        method: "PATCH",
        body: JSON.stringify(args),
      }
    );
  }

  /** Read-only performance insights from classifier + engagement. */
  async getPerformanceInsights(): Promise<PulsePerformanceInsightsResponse> {
    return majicoFetchJson<PulsePerformanceInsightsResponse>(
      this.config,
      projectMcpPath(this.config, "/pulse/insights")
    );
  }

  /** Aggregated product-ops payload for Cursor native canvas. */
  async getProductOpsView(): Promise<ProductOpsViewResponse> {
    return majicoFetchJson<ProductOpsViewResponse>(
      this.config,
      projectMcpPath(this.config, "/product-ops")
    );
  }
}
