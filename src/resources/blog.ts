import { majicoFetchJson, projectMcpPath } from "../http.js";
import type {
  BlogAssembleResponse,
  BlogOpportunitiesResponse,
  BlogOutlineResponse,
  BlogPostResponse,
  BlogPostsListResponse,
  BlogPublishResponse,
  BlogResearchResponse,
  BlogSectionDraftResponse,
  BlogSeoHandoffResponse,
  BlogWorkflowStepResponse,
  MajicoClientConfig,
} from "../types.js";

export class BlogResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async listPosts(args?: { limit?: number }): Promise<BlogPostsListResponse> {
    const params = new URLSearchParams();
    if (args?.limit != null) params.set("limit", String(args.limit));
    const qs = params.toString();
    const path = qs
      ? `${projectMcpPath(this.config, "/blog/posts")}?${qs}`
      : projectMcpPath(this.config, "/blog/posts");
    return majicoFetchJson<BlogPostsListResponse>(this.config, path);
  }

  async getPost(postId: string): Promise<BlogPostResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, `/blog/posts/${encodeURIComponent(postId)}`)
    );
  }

  async suggestOpportunities(): Promise<BlogOpportunitiesResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/blog/opportunities"),
      { method: "POST", body: JSON.stringify({}) }
    );
  }

  async runResearch(args: {
    concept: Record<string, unknown>;
    articleType?: string;
    postId?: string;
  }): Promise<BlogResearchResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/blog/research"),
      { method: "POST", body: JSON.stringify(args) }
    );
  }

  async generateOutline(args: {
    concept: Record<string, unknown>;
    dossier: Record<string, unknown>;
    articleType?: string;
    postId?: string;
  }): Promise<BlogOutlineResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/blog/outline"),
      { method: "POST", body: JSON.stringify(args) }
    );
  }

  async approveOutline(args: {
    postId: string;
  }): Promise<BlogWorkflowStepResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/blog/outline/approve"),
      { method: "POST", body: JSON.stringify(args) }
    );
  }

  async generateSection(args: {
    sectionId: string;
    postId: string;
    approve?: boolean;
  }): Promise<BlogSectionDraftResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(
        this.config,
        `/blog/sections/${encodeURIComponent(args.sectionId)}/draft`
      ),
      {
        method: "POST",
        body: JSON.stringify({
          postId: args.postId,
          approve: args.approve,
        }),
      }
    );
  }

  async assemble(args: {
    postId: string;
    skipSeoGate?: boolean;
  }): Promise<BlogAssembleResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/blog/assemble"),
      { method: "POST", body: JSON.stringify(args) }
    );
  }

  async publish(args: {
    postId: string;
    scope?: "project" | "platform";
    force?: boolean;
  }): Promise<BlogPublishResponse> {
    return majicoFetchJson(
      this.config,
      projectMcpPath(this.config, "/blog/publish"),
      { method: "POST", body: JSON.stringify(args) }
    );
  }

  async seoHandoff(args?: {
    postId?: string;
  }): Promise<BlogSeoHandoffResponse> {
    const params = new URLSearchParams();
    if (args?.postId) params.set("postId", args.postId);
    const qs = params.toString();
    const path = qs
      ? `${projectMcpPath(this.config, "/blog/seo-handoff")}?${qs}`
      : projectMcpPath(this.config, "/blog/seo-handoff");
    return majicoFetchJson<BlogSeoHandoffResponse>(this.config, path);
  }
}
