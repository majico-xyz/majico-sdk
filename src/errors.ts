export type MajicoErrorCode =
  | "auth_missing"
  | "auth_invalid_key"
  | "auth_project_mismatch"
  | "plan_required"
  | "INSUFFICIENT_TOKENS"
  | "project_not_found"
  | "rate_limited"
  | "service_unavailable"
  | "validation_error"
  | "unknown";

export type MajicoErrorBody = {
  error?: string;
  code?: string;
  message?: string;
};

const RETRYABLE_STATUSES = new Set([429, 503]);

export class MajicoError extends Error {
  readonly status: number;
  readonly code: MajicoErrorCode;
  readonly isRetryable: boolean;
  readonly body: MajicoErrorBody | null;

  constructor(
    message: string,
    options: {
      status: number;
      code?: MajicoErrorCode;
      body?: MajicoErrorBody | null;
    }
  ) {
    super(message);
    this.name = "MajicoError";
    this.status = options.status;
    this.code = options.code ?? mapStatusToCode(options.status);
    this.isRetryable = RETRYABLE_STATUSES.has(options.status);
    this.body = options.body ?? null;
  }
}

function mapStatusToCode(status: number): MajicoErrorCode {
  if (status === 401) return "auth_invalid_key";
  if (status === 403) return "unknown";
  if (status === 404) return "project_not_found";
  if (status === 429) return "rate_limited";
  if (status === 503) return "service_unavailable";
  return "unknown";
}

export async function parseMajicoError(
  response: Response
): Promise<MajicoError> {
  let body: MajicoErrorBody | null = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      body = (await response.json()) as MajicoErrorBody;
    } catch {
      body = null;
    }
  } else {
    const text = await response.text().catch(() => "");
    if (text) body = { error: text };
  }

  const message =
    body?.message ??
    body?.error ??
    `Majico API ${response.status}: ${response.statusText}`;

  const code = (body?.code as MajicoErrorCode | undefined) ?? undefined;

  return new MajicoError(message, {
    status: response.status,
    code,
    body,
  });
}
