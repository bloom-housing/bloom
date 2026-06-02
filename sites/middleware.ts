// This middleware is not deployable to netlify because it runs middelware in a edge runtime. It is
// copied to the right place for the AWS deployemnts in the Dockerfile.
export { middleware } from "@bloom-housing/shared-helpers/src/utilities/metricsMiddleware"

export const config = {
  runtime: "nodejs",
}
