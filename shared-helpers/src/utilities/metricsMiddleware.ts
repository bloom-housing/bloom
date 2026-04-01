import { NextResponse, NextRequest } from "next/server"
import * as opentelemetry from "@opentelemetry/api"

const meter = opentelemetry.metrics.getMeter("middleware")
const request_counter = meter.createCounter("middleware.request_counter")
const request_duration_ms = meter.createHistogram("middleware.request_duration_ms")

export function middleware(request: NextRequest) {
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
  const attributes = {
    method: request.method,
    path: shortPath,
    response_code: response.status,
  }
  request_counter.add(1, attributes)
  request_duration_ms.record(duration_ms, attributes)
  console.log(`${path} ${JSON.stringify(attributes)} took ${duration_ms}ms`)

  return response
}
