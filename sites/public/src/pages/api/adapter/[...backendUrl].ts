import axiosStatic from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import qs from "qs"
import { wrapper } from "axios-cookiejar-support"
import { getConfigs } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { maskAxiosResponse } from "@bloom-housing/shared-helpers"

/*
  This file exists as per https://nextjs.org/docs/api-routes/dynamic-api-routes  
  it serves as an adapter between the front end making api requests and those requests being sent to the backend api
  This file functionally works as a proxy to work in the new cookie paradigm
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
    const response = await axios.request(configs)

    // set up response from next api based on response from backend
    // The "Set-Cookie" response header needs to be forwarded to the front-end
    const responseHeaders = response["headers"]
    const cookiesFromHeaders = responseHeaders?.["set-cookie"] || []
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
