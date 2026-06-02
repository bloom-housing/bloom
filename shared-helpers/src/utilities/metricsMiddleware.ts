import { NextResponse, NextRequest } from "next/server"
import * as opentelemetry from "@opentelemetry/api"

let middleware = function (_: NextRequest) {
  // Do nothing.
}

if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  const meter = opentelemetry.metrics.getMeter("middleware")
  const request_counter = meter.createCounter("middleware.request_counter")
  const request_duration_ms = meter.createHistogram("middleware.request_duration_ms")

  middleware = function middleware(request: NextRequest) {
    const start = Date.now()

    const path = request.nextUrl.pathname
    let shortPath = path
    if (path.startsWith("/_next")) {
      // Turns '/_next/static/chunks/...' to '/_next/static'. Next static chunks have build ID, and
      // would blow up metric cardinality if we included them.
      shortPath = path.split("/").slice(0, 3).join("/")
    }

    const response = NextResponse.next()

    const duration_ms = Date.now() - start
    // https://docs.aws.amazon.com/elasticloadbalancing/latest/application/x-forwarded-headers.html
    const metric_attributes = {
      host: request.headers.get("Host"),
      x_forwarded_proto: request.headers.get("X-Forwarded-Proto"),
      x_forwarded_port: request.headers.get("X-Forwarded-Port"),
      method: request.method,
      path: shortPath,
      response_code: response.status,
    }
    const log_attributes = {
      ...metric_attributes,
      x_forwarded_for: request.headers.get("X-Forwarded-For"),
    }
    request_counter.add(1, metric_attributes)
    request_duration_ms.record(duration_ms, metric_attributes)
    console.log(`${JSON.stringify(log_attributes)} took ${duration_ms}ms`)

    return response
  }
}

export { middleware }
