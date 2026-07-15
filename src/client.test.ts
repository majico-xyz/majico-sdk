import { describe, expect, it, vi } from "vitest";
import { MajicoClient } from "./client.js";

const PROJECT_ID = "550e8400-e29b-41d4-a716-446655440000";

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
