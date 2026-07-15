import { afterEach, describe, expect, it, vi } from "vitest";
import { MajicoError } from "./errors.js";
import {
  majicoFetchJson,
  normalizeBaseUrl,
  validateClientConfig,
} from "./http.js";

const PROJECT_ID = "550e8400-e29b-41d4-a716-446655440000";

describe("validateClientConfig", () => {
  it("rejects missing apiKey", () => {
    expect(() =>
      validateClientConfig({ apiKey: "", projectId: PROJECT_ID })
    ).toThrow(MajicoError);
  });

  it("rejects invalid projectId", () => {
    expect(() =>
      validateClientConfig({ apiKey: "key", projectId: "not-a-uuid" })
    ).toThrow(/UUID/);
  });
});

describe("normalizeBaseUrl", () => {
  it("strips trailing slash", () => {
    expect(normalizeBaseUrl("https://api.majico.xyz/")).toBe(
      "https://api.majico.xyz"
    );
  });
});

describe("majicoFetchJson", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends Bearer auth and returns JSON", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ productName: "Acme" }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    const data = await majicoFetchJson<{ productName: string }>(
      { apiKey: "secret", projectId: PROJECT_ID },
      "/api/mcp/projects/x/guidelines"
    );

    expect(data.productName).toBe("Acme");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/mcp/projects/x/guidelines"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer secret",
        }),
      })
    );
  });

  it("retries on 503 when configured", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ error: "Unavailable" }), {
          status: 503,
          headers: { "content-type": "application/json" },
        })
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      );
    vi.stubGlobal("fetch", fetchMock);

    const data = await majicoFetchJson<{ ok: boolean }>(
      {
        apiKey: "secret",
        projectId: PROJECT_ID,
        retry: { max: 1, retryOn: [503] },
      },
      "/test"
    );

    expect(data.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
