import { majicoFetchJson, projectMcpPath } from "../http.js";
import type { BrandProfile, MajicoClientConfig } from "../types.js";

export type ImportBrandInput = {
  brandMd?: string | null;
  designMd?: string | null;
  paletteTokens?: {
    light: Record<string, string>;
    dark: Record<string, string>;
  } | null;
  headingFont?: string | null;
  bodyFont?: string | null;
  logoSvg?: string | null;
  productName?: string | null;
  oneLiner?: string | null;
  audience?: string | null;
  nicheIntent?: string | null;
  brandStory?: string | null;
  brandTones?: string[] | null;
  replace?: boolean;
};

export type ImportBrandResponse = {
  ok: true;
  projectId: string;
  hasBrandData: true;
  source: "imported";
  brandMdJobId: string | null;
  designMdJobId: string | null;
  warnings: string[];
  nextSteps: string[];
};

export class BrandResource {
  constructor(private readonly config: MajicoClientConfig) {}

  async get(): Promise<BrandProfile> {
    return majicoFetchJson<BrandProfile>(
      this.config,
      projectMcpPath(this.config, "/brand")
    );
  }

  /** Persist an already-done brand without niche research or logo generation. */
  async import(input: ImportBrandInput): Promise<ImportBrandResponse> {
    return majicoFetchJson<ImportBrandResponse>(
      this.config,
      projectMcpPath(this.config, "/brand/import"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }
    );
  }
}
