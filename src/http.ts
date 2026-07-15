import { MajicoError, parseMajicoError } from "./errors.js";
import type { MajicoClientConfig } from "./types.js";

const DEFAULT_BASE_URL = "https://api.majico.xyz";
const DEFAULT_TIMEOUT_MS = 30_000;
const DEFAULT_EXPORT_TIMEOUT_MS = 120_000;
const DEFAULT_RETRY_ON = [429, 503];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function normalizeBaseUrl(baseUrl?: string): string {
  return (baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
}

export function validateClientConfig(config: MajicoClientConfig): void {
  if (!config.apiKey?.trim()) {
    throw new MajicoError("apiKey is required", {
      status: 400,
      code: "validation_error",
    });
  }
  if (!config.projectId?.trim()) {
    throw new MajicoError("projectId is required", {
      status: 400,
      code: "validation_error",
    });
  }
  if (!UUID_RE.test(config.projectId.trim())) {
    throw new MajicoError("projectId must be a valid UUID", {
      status: 400,
      code: "validation_error",
    });
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function majicoFetchJson<T>(
  config: MajicoClientConfig,
  path: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  validateClientConfig(config);
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const timeoutMs = init?.timeoutMs ?? config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxRetries = config.retry?.max ?? 0;
  const retryOn = new Set(config.retry?.retryOn ?? DEFAULT_RETRY_ON);

  let lastError: MajicoError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${config.apiKey.trim()}`,
          Accept: "application/json",
          ...(init?.headers ?? {}),
        },
      });

      if (!res.ok) {
        const err = await parseMajicoError(res);
        if (retryOn.has(err.status) && attempt < maxRetries) {
          lastError = err;
          await sleep(Math.min(1000 * 2 ** attempt, 8000));
          continue;
        }
        throw err;
      }

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

  throw lastError ?? new MajicoError("Request failed", { status: 500 });
}

export async function majicoFetchRaw(
  config: MajicoClientConfig,
  path: string,
  init?: RequestInit
): Promise<Response> {
  validateClientConfig(config);
  const baseUrl = normalizeBaseUrl(config.baseUrl);
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const timeoutMs = config.exportTimeoutMs ?? DEFAULT_EXPORT_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${config.apiKey.trim()}`,
        ...(init?.headers ?? {}),
      },
    });

    if (!res.ok) throw await parseMajicoError(res);
    return res;
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

export function projectMcpPath(
  config: MajicoClientConfig,
  suffix: string
): string {
  const id = encodeURIComponent(config.projectId.trim());
  const normalized = suffix.startsWith("/") ? suffix : `/${suffix}`;
  return `/api/mcp/projects/${id}${normalized}`;
}
