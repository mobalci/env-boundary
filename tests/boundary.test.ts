import { describe, it, expect } from "vitest"
import { z } from "zod"
import { defineEnvBoundary } from "../src/boundary"

describe("env-boundary", () => {
  it("fails when a required environment variable is missing", () => {
    
    //env var is not set
    delete process.env.API_URL

    expect(() => {
      defineEnvBoundary({
        API_URL: {
          env: "API_URL",
          schema: z.url(),
        },
      })
    }).toThrow()
  })

  it("fails when an environment variable has an invalid value", () => {
    
    //env var is set to an invalid value
    process.env.API_URL = "not-a-valid-url"
  
    expect(() => {
      defineEnvBoundary({
        API_URL: {
          env: "API_URL",
          schema: z.url(),
        },
      })
    }).toThrow()
  })

  it("returns parsed config when environment variables are valid", () => {
    process.env.API_URL = "https://example.com"
  
    const config = defineEnvBoundary({
      API_URL: {
        env: "API_URL",
        schema: z.url(),
      },
    })
  
    expect(config.API_URL).toBe("https://example.com")
  })  
  
})