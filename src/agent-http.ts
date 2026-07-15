import { MajicoError, parseMajicoError } from "./errors.js";
import type { MajicoAgentClientConfig } from "./agent-types.js";

export function normalizeAgentBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/$/, "");
}

export async function majicoAgentFetchJson<T>(
  config: MajicoAgentClientConfig,
  path: string,
  init?: RequestInit
): Promise<T> {
  const baseUrl = normalizeAgentBaseUrl(config.baseUrl);
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const timeoutMs = config.timeoutMs ?? 30_000;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Majico-Agent-Secret": config.agentSecret.trim(),
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) throw await parseMajicoError(res);
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof MajicoError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new MajicoError(`Request timed out after ${timeoutMs}ms`, {
        status: 408,
        code: "unknown",
      });
    }
    throw new MajicoError(err instanceof Error ? err.message : String(err), {
      status: 500,
      code: "unknown",
    });
  } finally {
    clearTimeout(timer);
  }
}
