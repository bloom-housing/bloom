let register = undefined

if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  register = async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./instrumentation.node")
    } else {
      console.log(
        "instrumentation.ts: not running in nodejs runtime, no metrics will be available."
      )
    }
  }
}

if(process.env.NEXT_RUNTIME === "nodejs" && process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received. Starting graceful shutdown...")

    // Stop accepting new connections
    server.close(async () => {
      try {
        process.exit(0)
      } catch (err) {
        console.error("Cleanup error:", err)
        process.exit(1)
      }
    })

    // Force exit if shutdown takes too long
    setTimeout(() => {
      console.error("Shutdown timeout. Forcing exit.")
      process.exit(1)
    }, 10000).unref()
  })
}

export { register }
