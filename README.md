# env-boundary

**env-boundary** is a small utility for dealing with environment variables in a way that doesn’t leak into the codebase.

Environment variables are external, untyped, and easy to misuse. With this library, you validate them once at startup and then treat them as trusted, typed values everywhere else.

Most applications end up reading from `process.env` directly:

```ts
const port = process.env.PORT
```

That works, but it also means everything is a string, missing or invalid values often fail late and configuration logic slowly spreads throughout the codebase.

**env-boundary** treats environment variables as untrusted. If configuration is wrong, the application simply doesn’t start.

Usage looks like this. Schemas are defined using [zod](https://github.com/colinhacks/zod):

```ts
import { defineEnvBoundary } from "env-boundary"
import { z } from "zod"

export const config = defineEnvBoundary({
  apiUrl: {
    env: "API_URL",
    schema: z.string().url(),
  },

  port: {
    env: "PORT",
    schema: z.coerce.number().int().positive(),
  },

  featureEnabled: {
    env: "FEATURE_ENABLED",
    schema: z.coerce.boolean(),
    default: false,
  },
})
```

After this runs, `config` only contains typed values. `apiUrl` is a string, `port` is a number, and `featureEnabled` is a boolean. Application code never touches `process.env` and doesn’t need to care about parsing or validation anymore.

Configuration is validated once at startup. If something is missing or invalid, it fails immediately. Once the app is running, configuration can’t be mutated, and invalid states don’t appear at runtime.

This is part of a small internal kit intended to standardize application startup across a few projects. It’s intentionally minimal and focused. It doesn’t manage secrets, load `.env` files, or try to be a full configuration system. It just defines a clear boundary and enforces it.
