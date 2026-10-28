import axiosStatic from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import { Transform, pipeline } from "stream"
import { maskAxiosResponse } from "@bloom-housing/shared-helpers"

/*
  Streaming sibling of ./api/adapter/[...backendUrl].ts.

  EventSource cannot set custom headers, so the browser cannot send the passkey the backend's
  ApiKeyGuard requires. This route acts as the BFF for server sent events: it forwards the cookies
  and passkey, then pipes text/event-stream straight through to the browser.
*/

const sseEndpoints = ["applications/bulk-update/notifications"]

const HEARTBEAT_INTERVAL = 25_000

export const config = {
  api: {
    responseLimit: false,
    bodyParser: false,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isDisconnect = (e: any): boolean =>
  axiosStatic.isCancel(e) ||
  e?.code === "ERR_STREAM_PREMATURE_CLOSE" ||
  e?.code === "ECONNRESET" ||
  e?.code === "ERR_CANCELED"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method Not Allowed" })
    return
  }

  const { backendUrl, ...rest } = req.query
  const backendPath = Array.isArray(backendUrl) ? backendUrl.join("/") : backendUrl

  if (!sseEndpoints.includes(backendPath)) {
    res.status(404).json({ message: "Not Found" })
    return
  }

  let cookieString = ""
  Object.keys(req.cookies).forEach((cookieHeader) => {
    cookieString += `${cookieHeader}=${req.cookies[cookieHeader]};`
  })

  // Aborts the request to the backend if the browser disconnects before it has responded.
  const controller = new AbortController()
  req.on("close", () => controller.abort())

  let response
  try {
    response = await axiosStatic.request({
      method: "get",
      baseURL: process.env.BACKEND_API_BASE,
      url: `/${backendPath}`,
      params: rest,
      responseType: "stream",
      signal: controller.signal,
      headers: {
        cookie: cookieString,
        passkey: process.env.API_PASS_KEY,
        Accept: "text/event-stream",
        "Cache-Control": "no-cache",
      },
    })
  } catch (e) {
    if (isDisconnect(e)) return
    console.error("partner's SSE adapter error:", e.response ? maskAxiosResponse(e.response) : e)
    if (e.response) {
      res.statusMessage = e.response.statusText
      res.status(e.response.status).json(e.response.data)
    } else {
      res.status(502).json({ message: "Bad Gateway" })
    }
    return
  }

  const stream = response.data

  if (req.destroyed || res.writableEnded) {
    stream.destroy()
    return
  }

  req.socket?.setKeepAlive(true)
  req.socket?.setNoDelay(true)
  req.socket?.setTimeout(0)

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  })
  res.flushHeaders()

  let atFrameBoundary = true
  const trackFrameBoundary = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      const tail = chunk.subarray(-2).toString("utf8")
      atFrameBoundary = tail.endsWith("\n\n") || (chunk.length === 1 && tail === "\n")
      callback(null, chunk)
    },
  })

  const heartbeat = setInterval(() => {
    if (atFrameBoundary && !res.writableEnded) {
      res.write(":heartbeat\n\n")
    }
  }, HEARTBEAT_INTERVAL)

  pipeline(stream, trackFrameBoundary, res, (err) => {
    clearInterval(heartbeat)
    if (err && !isDisconnect(err)) {
      console.error("partner's SSE adapter stream error:", err)
    }
  })
}
