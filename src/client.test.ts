import { describe, expect, it, vi } from "vitest";
import { MajicoClient } from "./client.js";
import { BlogResource } from "./resources/blog.js";
import { PaletteResource } from "./resources/palette.js";
import { ProjectsResource } from "./resources/projects.js";
import { PulseResource } from "./resources/pulse.js";
import { ResearchResource } from "./resources/research.js";
import { CursorSkillsResource } from "./resources/cursor-skills.js";

const PROJECT_ID = "550e8400-e29b-41d4-a716-446655440000";

/** Resources that user-majico-mcp tool dispatch requires (regression for 1.0.1 gap). */
const MCP_REQUIRED_RESOURCES = [
  "projects",
  "palette",
  "blog",
  "pulse",
  "research",
  "cursorSkills",
  "brand",
  "tokens",
  "logo",
  "guidelines",
  "designMd",
  "studio",
  "export",
  "cursorHandoff",
] as const;

describe("MajicoClient", () => {
  it("exposes resource namespaces", () => {
    const client = new MajicoClient({
      apiKey: "test-key",
      projectId: PROJECT_ID,
    });
    expect(client.brand).toBeDefined();
    expect(client.tokens).toBeDefined();
    expect(client.logo).toBeDefined();
    expect(client.guidelines).toBeDefined();
    expect(client.designMd).toBeDefined();
    expect(client.studio).toBeDefined();
    expect(client.export).toBeDefined();
    expect(client.blog).toBeDefined();
  });

  it("exposes every resource MCP tools call (sdk>=1.1.0 contract)", () => {
    const client = new MajicoClient({
      apiKey: "test-key",
      projectId: PROJECT_ID,
    });

    for (const key of MCP_REQUIRED_RESOURCES) {
      expect(client[key], `missing client.${key}`).toBeDefined();
    }

    expect(client.projects).toBeInstanceOf(ProjectsResource);
    expect(client.palette).toBeInstanceOf(PaletteResource);
    expect(client.blog).toBeInstanceOf(BlogResource);
    expect(client.pulse).toBeInstanceOf(PulseResource);
    expect(client.research).toBeInstanceOf(ResearchResource);
    expect(client.cursorSkills).toBeInstanceOf(CursorSkillsResource);
  });

  it("projects.ping and projects.list hit MCP paths", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            ok: true,
            projectId: PROJECT_ID,
            projectName: "Demo",
            slug: "demo",
            userId: "u1",
            hasBrandData: true,
            hasCanvasData: false,
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            projects: [
              {
                id: PROJECT_ID,
                name: "Demo",
                slug: "demo",
                description: "",
                hasBrandData: true,
                hasCanvasData: false,
              },
            ],
            activeProjectId: PROJECT_ID,
            userId: "u1",
          }),
          { status: 200 }
        )
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new MajicoClient({
      apiKey: "test-key",
      projectId: PROJECT_ID,
      baseUrl: "https://api.majico.xyz",
    });

    await client.projects.ping();
    await client.projects.list();

    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      `https://api.majico.xyz/api/mcp/projects/${PROJECT_ID}/ping`
    );
    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      "https://api.majico.xyz/api/mcp/projects"
    );
  });

  it("palette.listCandidates and blog.listPosts hit MCP paths", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            options: [],
            selectedOptionId: null,
            paletteTokens: null,
          }),
          { status: 200 }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ posts: [] }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    const client = new MajicoClient({
      apiKey: "test-key",
      projectId: PROJECT_ID,
      baseUrl: "https://api.majico.xyz",
    });

    await client.palette.listCandidates();
    await client.blog.listPosts();

    expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
      `/api/mcp/projects/${PROJECT_ID}/palettes`
    );
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain(
      `/api/mcp/projects/${PROJECT_ID}/blog/posts`
    );
  });

  it("guidelines.get calls MCP guidelines path", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          productName: "Brand",
          markdown: "# Brand",
          llmPrompt: "Apply brand",
        }),
        { status: 200 }
      )
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new MajicoClient({
      apiKey: "test-key",
      projectId: PROJECT_ID,
      baseUrl: "https://api.majico.xyz",
    });

    const result = await client.guidelines.get();
    expect(result.productName).toBe("Brand");
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.majico.xyz/api/mcp/projects/${PROJECT_ID}/guidelines`,
      expect.any(Object)
    );
  });
});
