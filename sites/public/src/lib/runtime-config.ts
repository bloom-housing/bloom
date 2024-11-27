// Next.js adds config values to process.env, but not as real props
const runtimeVars = {}

// copy over only the "real" env vars
Object.keys(process.env).map((key) => {
  runtimeVars[key] = process.env[key]
})

// provide a read-only interface to vars
const varProxy = new Proxy(runtimeVars, {
  get(target, key: string) {
    return target[key as keyof typeof target]
  },
}) as Record<string, string>

export const runtimeConfig = {
  // provide a proxy to enable direct lookups
  // runtimeConfig.env.SOME_ENV_VAR
  env: varProxy,

  // a getter that enables getting a var by string value
  // const key = "SOME_ENV_VAR"
  // runtimeConfig.get(key)
  get(key: string): string {
    return this.env[key]
  },

  /*
    Accessing vars directly (runtimeConfig.var.SOME_VAR) throughout the code is
    fine, but it isn't great.  By using methods to expose and retrieve values,
    we can take advantage of things like IDE autocomplete and easy refactoring.
    If a var changes format, is later derived from other sources, needs to have
    accesses logged, etc, it only needs to be changed in one place rather than
    several.
  */

  getGoogleMapsApiKey() {
    return this.env.GOOGLE_MAPS_API_KEY
  },

  getGoogleMapsMapId() {
    return this.env.GOOGLE_MAPS_MAP_ID
  },

  getBackendApiBase() {
    if (this.env.BACKEND_PROXY_BASE) {
      // try proxy base first
      return this.env.BACKEND_PROXY_BASE
    } else if (process.env.BACKEND_API_BASE) {
      // then backend api base
      return process.env.BACKEND_API_BASE
    }

    // fall back on next config value if absolutely necessary
    return process.env.backendApiBase
  },

  getListingServiceUrl() {
    return `${this.getBackendApiBase()}${this.env.LISTINGS_QUERY}`
  },

  getJurisdictionName() {
    return this.env.JURISDICTION_NAME
  },
}
