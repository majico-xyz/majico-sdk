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
  vi.spyOn(globalThis, "fetch").mockImplementation(fetchMock);
  return fetchMock;
}

describe("MajicoClient research/assets/quiver resources", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("research.webSearch calls MCP research path", async () => {
    const fetchMock = mockJsonFetch({ ok: true, query: "test", results: [] });
    const client = new MajicoClient(clientConfig);

    await client.research.webSearch({ query: "test" });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/research/web-search`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("assets.generate calls MCP assets generate path", async () => {
    const fetchMock = mockJsonFetch({
      ok: true,
      skillId: "landing-page",
      jobId: "job-1",
      async: true,
      scopeChain: ["global"],
      backend: "harness-native",
    });
    const client = new MajicoClient(clientConfig);

    await client.assets.generate({ skillId: "landing-page" });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/assets/generate`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("quiver.generateSvg calls MCP quiver proxy path", async () => {
    const fetchMock = mockJsonFetch({
      ok: true,
      svgs: ["<svg/>"],
      credits: 1,
      requestId: null,
    });
    const client = new MajicoClient(clientConfig);

    await client.quiver.generateSvg({ prompt: "minimal mark" });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/external/quiver/generate-svg`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("quiver.vectorizeSvg calls MCP quiver vectorize path", async () => {
    const fetchMock = mockJsonFetch({
      ok: true,
      svg: "<svg/>",
      credits: 1,
      requestId: null,
    });
    const client = new MajicoClient(clientConfig);

    await client.quiver.vectorizeSvg({ imageBase64: "abc123" });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/external/quiver/vectorize`,
      expect.objectContaining({ method: "POST" })
    );
  });

  it("research.runNicheResearch calls MCP niche path", async () => {
    const fetchMock = mockJsonFetch({
      ok: true,
      jobId: "job-niche-1",
      async: true,
    });
    const client = new MajicoClient(clientConfig);

    await client.research.runNicheResearch({ marketScan: true });

    expect(fetchMock).toHaveBeenCalledWith(
      `${MCP_BASE}/research/niche`,
      expect.objectContaining({ method: "POST" })
    );
  });
});
