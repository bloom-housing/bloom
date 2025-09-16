import axiosStatic from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import qs from "qs"
import { getConfigs } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { wrapper } from "axios-cookiejar-support"

/*
  This file exists as per https://nextjs.org/docs/api-routes/dynamic-api-routes  
  it serves as an adapter between the front end making api requests and those requests being sent to the backend api
  This file functionally works as a proxy to work in the new cookie paradigm
*/

/*
  Next.js munges binary data by default, so we have to disable the parser. There
  isn't a way to do that for just uploads without impacting every other request,
  so this needs to be a separate route entirely.
*/
export const config = {
  api: {
    bodyParser: false,
    responseLimit: "5mb",
  },
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const headers: Record<string, string | string[]> = {
    jurisdictionName: req.headers.jurisdictionname,
    language: req.headers.language,
    appUrl: req.headers.appurl,
    "x-forwarded-for": req.headers["x-forwarded-for"] || "",
  }

  if (process.env.API_PASS_KEY) {
    headers.passkey = process.env.API_PASS_KEY
  }

  const axios = wrapper(
    axiosStatic.create({
      baseURL: process.env.BACKEND_API_BASE,
      headers,
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
    })
  )
  try {
    // set up request to backend from request to next api
    // eslint-disable-next-line prefer-const
    // let { backendUrl, ...rest } = req.query
    // if (Array.isArray(backendUrl)) {
    //   backendUrl = backendUrl.join("/")
    // }

    // Hardcode the backend endpoint since there's only one
    const backendUrl = "/asset/upload"

    // Since the body wasn't parsed, we have to copy the raw value from the request
    // Create an array to hold the chunks
    const chunks = []

    // Iterate through the request stream to copy chunks into the array
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
    }

    // Build the body from the chunks
    const body = Buffer.concat(chunks)

    const configs = getConfigs(req.method || "", req.headers["content-type"], backendUrl || "", {})

    let cookieString = ""
    Object.keys(req.cookies).forEach((cookieHeader) => {
      cookieString += `${cookieHeader}=${req.cookies[cookieHeader]};`
    })
    configs.headers.cookie = cookieString
    //configs.params = rest
    configs.data = body

    // send request to backend
    const response = await axios.request(configs)
    // set up response from next api based on response from backend
    const responseHeaders = response["headers"]
    const cookiesFromHeaders = responseHeaders?.["set-cookie"] || []
    res.setHeader("Set-Cookie", cookiesFromHeaders)
    res.statusMessage = response.statusText
    res.status(response.status).json(response.data)
  } catch (e) {
    console.error("partner's backend url adapter error:", { e })
    if (e.response) {
      res.statusMessage = e.response.statusText
      res.status(e.response.status).json(e.response.data)
    }
  }
}
