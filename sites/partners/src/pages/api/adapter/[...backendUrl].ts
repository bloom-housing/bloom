import axiosStatic from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import qs from "qs"
import { getConfigs } from "@bloom-housing/backend-core/types"
import { wrapper } from "axios-cookiejar-support"
import { CookieJar } from "tough-cookie"

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
    const configs = getConfigs(req.method, "application/json", backendUrl, {})
    let cookieString = ""
    Object.keys(req.cookies).forEach((cookieHeader) => {
      cookieString += `${cookieHeader}=${req.cookies[cookieHeader]};`
    })
    configs.headers.cookie = cookieString
    configs.params = rest
    configs.data = req.body

    // send request to backend
    const response = await axios.request(configs)
    // set up response from next api based on response from backend
    const cookies = await jar.getSetCookieStrings(process.env.BACKEND_API_BASE)
    res.setHeader("Set-Cookie", cookies)
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
