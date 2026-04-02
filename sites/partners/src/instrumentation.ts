let register = undefined

if (process.env.ENABLE_METRICS === "TRUE") {
  register = async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
      await import("./instrumentation.node")
    } else {
      console.log("instrumentation.ts: not running in nodejs runtime, no metrics will be available.")
    }
  }
}

export { register }
