import { afterEach, describe, expect, it, vi } from "vitest";
import { MajicoError, parseMajicoError } from "./errors.js";
import { majicoFetchJson } from "./http.js";

const PROJECT_ID = "550e8400-e29b-41d4-a716-446655440000";
const config = { apiKey: "secret", projectId: PROJECT_ID };

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("parseMajicoError", () => {
  it("maps 401 to auth_invalid_key", async () => {
    const err = await parseMajicoError(
      jsonResponse({ error: "Invalid API key" }, 401)
    );
    expect(err).toBeInstanceOf(MajicoError);
    expect(err.status).toBe(401);
    expect(err.code).toBe("auth_invalid_key");
    expect(err.message).toBe("Invalid API key");
  });

  it("maps 403 without explicit code to unknown", async () => {
    const err = await parseMajicoError(
      jsonResponse({ error: "Pro plan required" }, 403)
    );
    expect(err.status).toBe(403);
    expect(err.code).toBe("unknown");
  });

  it("maps 403 with plan_required code when present in body", async () => {
    const err = await parseMajicoError(
      jsonResponse({ code: "plan_required", error: "Need tokens" }, 403)
    );
    expect(err.status).toBe(403);
    expect(err.code).toBe("plan_required");
  });

  it("maps 404 to project_not_found", async () => {
    const err = await parseMajicoError(
      jsonResponse({ error: "Project not found" }, 404)
    );
    expect(err.status).toBe(404);
    expect(err.code).toBe("project_not_found");
  });

  it("honors explicit error code from response body", async () => {
    const err = await parseMajicoError(
      jsonResponse(
        { code: "auth_project_mismatch", message: "Wrong project" },
        403
      )
    );
    expect(err.code).toBe("auth_project_mismatch");
    expect(err.message).toBe("Wrong project");
  });
});

describe("majicoFetchJson error propagation", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("throws MajicoError on 401 without retry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "Unauthorized" }, 401))
    );

    await expect(
      majicoFetchJson(config, "/api/mcp/projects/x/guidelines")
    ).rejects.toMatchObject({
      status: 401,
      code: "auth_invalid_key",
    });
  });

  it("throws MajicoError on 403", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "Forbidden" }, 403))
    );

    await expect(majicoFetchJson(config, "/test")).rejects.toMatchObject({
      status: 403,
      code: "unknown",
    });
  });

  it("throws MajicoError on 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "Not found" }, 404))
    );

    await expect(majicoFetchJson(config, "/test")).rejects.toMatchObject({
      status: 404,
      code: "project_not_found",
    });
  });
});
