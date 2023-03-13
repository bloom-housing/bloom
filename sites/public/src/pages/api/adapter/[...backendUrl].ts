import axiosStatic from "axios"
import type { NextApiRequest, NextApiResponse } from "next"
import qs from "qs"
import { getConfigs } from "@bloom-housing/backend-core/types"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const axios = axiosStatic.create({
    baseURL: process.env.BACKEND_API_BASE,
    headers: {
      jurisdictionName: process.env.jurisdictionName,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params)
    },
  })
  try {
    let { backendUrl } = req.query
    if (Array.isArray(backendUrl)) {
      backendUrl = backendUrl.join("/")
    }
    const configs = getConfigs(req.method, "application/json", backendUrl, {})
    let cookieString = ""
    Object.keys(req.cookies).forEach((cookieHeader) => {
      cookieString += `${cookieHeader}=${req.cookies[cookieHeader]};`
    })
    configs.headers.cookie = cookieString
    const response = await axios.request(configs)
    console.log("response (26):", { response })
    res.status(response.status).json(response.data)
  } catch (e) {
    console.log("e:", e)
    res.status(400).json({ e: JSON.stringify(e) })
  }
}
