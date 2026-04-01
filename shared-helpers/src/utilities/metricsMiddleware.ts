import { NextResponse, NextRequest } from "next/server"
import * as opentelemetry from "@opentelemetry/api"

const meter = opentelemetry.metrics.getMeter("middleware")
const request_counter = meter.createCounter("middleware.request_counter")
const request_duration_ms = meter.createHistogram("middleware.request_duration_ms")

export function middleware(request: NextRequest) {
  const start = Date.now()

  let path = request.nextUrl.pathname
  if (path.startsWith("/_next")) {
    // Turns '/_next/static/chunks/...' to '/_next/static'
    path = path.split("/").slice(0, 3).join("/")
  }

  const response = NextResponse.next()

  const duration_ms = Date.now() - start
  const attributes = {
    method: request.method,
    path: path,
    response_code: response.status,
  }
  request_counter.add(1, attributes)
  request_duration_ms.record(duration_ms, attributes)
  console.log(`Request: ${path} ${JSON.stringify(attributes)} took ${duration_ms}ms`)

  return response
}
