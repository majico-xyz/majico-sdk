import { afterEach, describe, expect, it, vi } from "vitest";
import { MajicoClient } from "./client.js";

const PROJECT_ID = "550e8400-e29b-41d4-a716-446655440000";
const BASE = "https://api.majico.xyz";
const MCP_BASE = `${BASE}/api/mcp/projects/${PROJECT_ID}`;

const clientConfig = {
  apiKey: "test-key",
  projectId: PROJECT_ID,
  baseUrl: BASE,
};

function mockJsonFetch(body: unknown, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    })
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("MajicoClient resources", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("projects.list calls MCP projects index", async () => {
    const fetchMock = mockJsonFetch({
      projects: [
        { id: PROJECT_ID, name: "Acme", slug: "acme", hasBrandData: true },
      ],
      activeProjectId: PROJECT_ID,
      userId: "user-1",
    });
    const client = new MajicoClient(clientConfig);

    await client.projects.list();

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/api/mcp/projects`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("projects.ping calls MCP ping path", async () => {
    const fetchMock = mockJsonFetch({
      ok: true,
      projectId: PROJECT_ID,
      projectName: "Acme",
      hasBrandData: true,
    });
    const client = new MajicoClient(clientConfig);

    await client.projects.ping();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/ping`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("projects.create POSTs to MCP projects index", async () => {
    const fetchMock = mockJsonFetch({
      id: "new-id",
      name: "Reeldemo",
      slug: "reeldemo",
      projectApiKey: "majico_key",
      hasBrandData: false,
      oauthMcpConfig: { type: "http", url: "https://api.majico.xyz/mcp" },
      httpMcpConfig: null,
      oauthReconnectInstructions: [],
      nextSteps: [],
    });
    const client = new MajicoClient(clientConfig);

    await client.projects.create("Reeldemo");

    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/api/mcp/projects`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ name: "Reeldemo" }),
      })
    );
  });

  it("brand.get calls MCP brand path with Bearer auth", async () => {
    const fetchMock = mockJsonFetch({ archetype: "creator", niche: "saas" });
    const client = new MajicoClient(clientConfig);

    await client.brand.get();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/brand`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("tokens.get calls MCP tokens path with Bearer auth", async () => {
    const fetchMock = mockJsonFetch({ palette: { primary: "#000" } });
    const client = new MajicoClient(clientConfig);

    await client.tokens.get();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/tokens`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("logo.get calls MCP logos path with Bearer auth", async () => {
    const fetchMock = mockJsonFetch({ svg: "<svg/>" });
    const client = new MajicoClient(clientConfig);

    await client.logo.get();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/logos`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("designMd.get calls MCP design-md path with Bearer auth", async () => {
    const fetchMock = mockJsonFetch({ markdown: "# DESIGN.md" });
    const client = new MajicoClient(clientConfig);

    await client.designMd.get();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/design-md`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("studio.get calls MCP studio path with Bearer auth", async () => {
    const fetchMock = mockJsonFetch({ canvas: { elements: [] } });
    const client = new MajicoClient(clientConfig);

    await client.studio.get();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/studio`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("studio.patchHtmlFrame PATCHes MCP studio path", async () => {
    const fetchMock = mockJsonFetch({ canvas: { elements: [] } });
    const client = new MajicoClient(clientConfig);

    await client.studio.patchHtmlFrame({
      elementId: "frame-1",
      html: "<div>Hello</div>",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/studio`,
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          elementId: "frame-1",
          html: "<div>Hello</div>",
        }),
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  it("export.getManifest calls MCP export manifest path", async () => {
    const fetchMock = mockJsonFetch({ entries: [] });
    const client = new MajicoClient(clientConfig);

    await client.export.getManifest();

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/export/manifest`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
        }),
      })
    );
  });

  it("export.downloadZip calls MCP export path", async () => {
    const zipBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(zipBytes, {
        status: 200,
        headers: { "content-type": "application/zip" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const client = new MajicoClient(clientConfig);
    const buffer = await client.export.downloadZip();

    expect(buffer).toBeInstanceOf(ArrayBuffer);
    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/export`,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          Accept: "application/zip, application/octet-stream",
        }),
      })
    );
  });

  it("brief.submit calls MCP brief POST", async () => {
    const fetchMock = mockJsonFetch({
      ok: true,
      projectId: PROJECT_ID,
      briefId: "brief-1",
      jobId: "job-1",
      status: "pending",
      nextSteps: [],
    });
    const client = new MajicoClient(clientConfig);

    await client.brief.submit({
      productName: "Korvai",
      oneLiner: "AI rhythm",
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/brief`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          productName: "Korvai",
          oneLiner: "AI rhythm",
        }),
      })
    );
  });
});
