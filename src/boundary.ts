import type { ZodType } from "zod"

export type EnvField<T> = {
  env: string
  schema: ZodType<T>
  default?: T
}

export function defineEnvBoundary<
  T extends Record<string, EnvField<any>>
>(
  fields: T
): Readonly<{
  [K in keyof T]: T[K] extends EnvField<infer U> ? U : never
}> {
  const result: Record<string, unknown> = {}

  for (const key in fields) {
    const { env, schema, default: def } = fields[key]
    const raw = process.env[env] ?? def

    if (raw === undefined) {
      throw new Error(`Missing required environment variable: ${env}`)
    }

    const parsed = schema.safeParse(raw)
    if (!parsed.success) {
      throw new Error(`Invalid value for ${env}: ${parsed.error.message}`)
    }

    result[key] = parsed.data
  }

  return Object.freeze(result) as any
}
