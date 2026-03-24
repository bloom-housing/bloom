export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./instrumentation.node")
  } else {
    console.log("instrumentation.ts: not running in nodejs runtime, no metrics will be available.")
  }
}
