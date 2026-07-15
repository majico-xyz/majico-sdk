# @majico/sdk

TypeScript client for the [Majico.xyz](https://majico.xyz) public API.

## Install

```bash
npm install @majico/sdk
```

## Quickstart

```typescript
import { MajicoClient } from "@majico/sdk";

const client = new MajicoClient({
  apiKey: process.env.MAJICO_API_KEY!,
  projectId: process.env.MAJICO_PROJECT_ID!,
  baseUrl: "https://api.majico.xyz",
});

const guidelines = await client.guidelines.get();
console.log(guidelines.productName, guidelines.llmPrompt.slice(0, 200));
```

## Resources

| Resource            | Method                           | Description                           |
| ------------------- | -------------------------------- | ------------------------------------- |
| `client.brand`      | `get()`                          | Brand archetypes and niche intent     |
| `client.tokens`     | `get()`                          | Design tokens (palette, fonts)        |
| `client.logo`       | `get()`                          | Selected logo SVG                     |
| `client.guidelines` | `get()`                          | Full guidelines markdown + LLM prompt |
| `client.designMd`   | `get()`                          | DESIGN.md for repo drop-in            |
| `client.export`     | `getManifest()`, `downloadZip()` | Export bundle                         |
| `client.studio`     | `get()`, `patchHtmlFrame()`      | Studio canvas read/write              |

## Errors

```typescript
import { MajicoClient, MajicoError } from "@majico/sdk";

try {
  await client.guidelines.get();
} catch (err) {
  if (err instanceof MajicoError) {
    console.error(err.status, err.code, err.isRetryable);
  }
}
```

## API reference

Full endpoint and response documentation: [docs/api-reference.md](https://github.com/majico-xyz/majico.xyz/blob/main/docs/api-reference.md).

## Publishing

Requires npm login with access to the `@majico` org:

```bash
npm whoami
cd packages/majico-sdk
npm publish --access public
```

## License

MIT
