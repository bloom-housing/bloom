import dotenv from "dotenv"
import bodyParser from "body-parser"
import Provider from "oidc-provider"
import express from "express"

const loadConfig = () => {
  dotenv.config()
  const port = parseInt(process.env.PORT || "3002", 10)
  return {
    port,
    url: process.env.SERVICE_URL || `http://localhost:${port}`,
    //tokenPrivateKey: process.env.TOKEN_PRIVATE_KEY || loadPrivateKey("/path"),
    isDev: process.env.NODE_ENV === "development"
  }
}
const config = loadConfig()

const oidc = new Provider(config.url, {
  // TODO: add `adapter` to connect to database & persist sessions
  // Configure clients here for now - eventually this might want to get stored in a database so that we don't have
  // to re-deploy to add a client config.
  clients: [
    {
      /* eslint-disable @typescript-eslint/camelcase */
      client_id: "bloom-housing-internal",
      redirect_uris: [...(config.isDev ? ["http://localhost:3000/auth/callback"] : [])],
      response_types: ["code"],
      grant_types: ["authorization_code", "refresh_token"],
      token_endpoint_auth_method: "none"
      /* eslint-enable @typescript-eslint/camelcase */
    }
  ],
  features: {
    introspection: { enabled: true },
    revocation: { enabled: true }
  }
})

// Dev mode allow localhost/http redirects
// https://github.com/panva/node-oidc-provider/blob/master/recipes/implicit_http_localhost.md
if (config.isDev) {
  const { invalidate: orig } = oidc.Client.Schema.prototype
  oidc.Client.Schema.prototype.invalidate = function invalidate(message, code) {
    if (code === "implicit-force-https" || code === "implicit-forbid-localhost") {
      return
    }

    orig.call(this, message)
  }
}

oidc.proxy = true

const app = express()
app.use(bodyParser.json())

app.use(oidc.callback)

export default app.listen(config.port)
console.log(`[Auth]: Server running on port ${config.port}`)
