import { validateClientConfig } from "./http.js";
import { BlogResource } from "./resources/blog.js";
import { BrandMdResource } from "./resources/brand-md.js";
import { BrandResource } from "./resources/brand.js";
import { BriefResource } from "./resources/brief.js";
import { CreativeResource, FigmaResource } from "./resources/creative.js";
import { CursorHandoffResource } from "./resources/cursor-handoff.js";
import { CursorSkillsResource } from "./resources/cursor-skills.js";
import { DesignMdResource } from "./resources/design-md.js";
import { ExportResource } from "./resources/export.js";
import { GuidelinesResource } from "./resources/guidelines.js";
import { LogoResource } from "./resources/logo.js";
import { PaletteResource } from "./resources/palette.js";
import { PulseResource } from "./resources/pulse.js";
import { GitResource } from "./resources/git.js";
import { StudioResource } from "./resources/studio.js";
import { ResearchResource } from "./resources/research.js";
import { AssetsResource } from "./resources/assets.js";
import { QuiverResource } from "./resources/quiver.js";
import { ProjectsResource } from "./resources/projects.js";
import { TokensResource } from "./resources/tokens.js";
import type { MajicoClientConfig } from "./types.js";

export class MajicoClient {
  readonly brand: BrandResource;
  readonly brief: BriefResource;
  readonly tokens: TokensResource;
  readonly logo: LogoResource;
  readonly palette: PaletteResource;
  readonly pulse: PulseResource;
  readonly blog: BlogResource;
  readonly cursorHandoff: CursorHandoffResource;
  readonly cursorSkills: CursorSkillsResource;
  readonly guidelines: GuidelinesResource;
  readonly designMd: DesignMdResource;
  readonly brandMd: BrandMdResource;
  readonly studio: StudioResource;
  readonly export: ExportResource;
  readonly creative: CreativeResource;
  readonly figma: FigmaResource;
  readonly git: GitResource;
  readonly research: ResearchResource;
  readonly assets: AssetsResource;
  readonly quiver: QuiverResource;
  readonly projects: ProjectsResource;

  readonly config: Readonly<MajicoClientConfig>;

  constructor(config: MajicoClientConfig) {
    validateClientConfig(config);
    this.config = {
      baseUrl: config.baseUrl,
      apiKey: config.apiKey.trim(),
      projectId: config.projectId.trim(),
      retry: config.retry,
      timeoutMs: config.timeoutMs,
      exportTimeoutMs: config.exportTimeoutMs,
    };
    this.brand = new BrandResource(this.config);
    this.brief = new BriefResource(this.config);
    this.tokens = new TokensResource(this.config);
    this.logo = new LogoResource(this.config);
    this.palette = new PaletteResource(this.config);
    this.pulse = new PulseResource(this.config);
    this.blog = new BlogResource(this.config);
    this.cursorHandoff = new CursorHandoffResource(this.config);
    this.cursorSkills = new CursorSkillsResource(this.config);
    this.guidelines = new GuidelinesResource(this.config);
    this.designMd = new DesignMdResource(this.config);
    this.brandMd = new BrandMdResource(this.config);
    this.studio = new StudioResource(this.config);
    this.export = new ExportResource(this.config);
    this.creative = new CreativeResource(this.config);
    this.figma = new FigmaResource(this.config);
    this.git = new GitResource(this.config);
    this.research = new ResearchResource(this.config);
    this.assets = new AssetsResource(this.config);
    this.quiver = new QuiverResource(this.config);
    this.projects = new ProjectsResource(this.config);
  }
}
