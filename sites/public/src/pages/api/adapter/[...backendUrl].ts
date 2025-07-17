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
    console.log("backendUrl", backendUrl)
    console.log("rest", rest)
    const configs = getConfigs(req.method || "", "application/json", backendUrl || "", {})
    let cookieString = ""
    console.log("request cookies", req.cookies)
    Object.keys(req.cookies).forEach((cookieHeader) => {
      cookieString += `${cookieHeader}=${req.cookies[cookieHeader]};`
    })
    configs.headers.cookie = cookieString
    configs.params = rest
    configs.data = req.body || {}

    // send request to backend
    const response = await axios.request(configs)

    console.log("adapter response headers", response["headers"])
    // set up response from next api based on response from backend
    console.log("process env backend_api_base", process.env.BACKEND_API_BASE)
    const cookies = await jar.getSetCookieStrings(process.env.BACKEND_API_BASE || "")
    const cookiesFromHeaders = response["headers"]["set-cookie"]
    console.log("cookies from headers", cookiesFromHeaders)
    console.log("response cookies", cookies)
    res.setHeader("Set-Cookie", cookiesFromHeaders)
    res.statusMessage = response.statusText
    res.status(response.status).json(response.data)
  } catch (e) {
    console.error(
      "public backend url adapter error:",
      e.response ? maskAxiosResponse(e.response) : e
    )
    if (e.response) {
      res.statusMessage = e.response.statusText
      res.status(e.response.status).json(e.response.data)
    }
  }
}
