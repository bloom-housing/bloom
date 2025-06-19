import axiosStatic from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import qs from "qs"
import { wrapper } from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"
import { getConfigs } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { maskAxiosResponse } from "@bloom-housing/shared-helpers"

/*
  This file exists as per https://nextjs.org/docs/api-routes/dynamic-api-routes  
  it serves as an adapter between the front end making api requests and those requests being sent to the backend api
  This file functionally works as a proxy to work in the new cookie paradigm
*/

// all endpoints that return a zip file
const zipEndpoints = [
  "listings/csv",
  "lottery/getLotteryResults",
  "applications/spreadsheet",
  "applications/csv",
]

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const jar = new CookieJar()
  const axios = wrapper(
    axiosStatic.create({
      baseURL: process.env.BACKEND_API_BASE,
      headers: {
        jurisdictionName: req.headers.jurisdictionname,
        language: req.headers.language,
        appUrl: req.headers.appurl,
        "x-forwarded-for": req.headers["x-forwarded-for"] || "",
        passkey: process.env.API_PASS_KEY,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
      jar,
    })
  )
  try {
    // set up request to backend from request to next api
    // eslint-disable-next-line prefer-const
    let { backendUrl, ...rest } = req.query
    if (Array.isArray(backendUrl)) {
      backendUrl = backendUrl.join("/")
    }
    const configs = getConfigs(req.method || "", "application/json", backendUrl || "", {})
    let cookieString = ""
    Object.keys(req.cookies).forEach((cookieHeader) => {
      cookieString += `${cookieHeader}=${req.cookies[cookieHeader]};`
    })
    configs.headers.cookie = cookieString
    configs.params = rest
    configs.data = req.body || {}

    // send request to backend
    // the zip endpoints also require a responseType of arraybuffer
    const response = await axios.request({
      ...configs,
      // Remove adapter prefix and query params from the url
      responseType: zipEndpoints.includes(req.url.replace("/api/adapter/", "").split("?")[0])
        ? "arraybuffer"
        : undefined,
    })
    // set up response from next api based on response from backend
    const cookies = await jar.getSetCookieStrings(process.env.BACKEND_API_BASE || "")
    res.setHeader("Set-Cookie", cookies)
    res.statusMessage = response.statusText
    if (response.headers) {
      if (response.headers["content-type"]) {
        res.setHeader("content-type", response.headers["content-type"])
      }
      if (response.headers["content-disposition"]) {
        res.setHeader("content-disposition", response.headers["content-disposition"])
      }
      if (response.headers["connection"]) {
        res.setHeader("connection", response.headers["connection"])
      }
    }
    res.status(response.status).send(response.data)
  } catch (e) {
    console.error(
      "partner's backend url adapter error:",
      e.response ? maskAxiosResponse(e.response) : e
    )
    if (e.response) {
      res.statusMessage = e.response.statusText
      res.status(e.response.status).json(e.response.data)
    }
  }
}
