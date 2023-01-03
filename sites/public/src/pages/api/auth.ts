import axiosStatic from "axios"
import { wrapper } from "axios-cookiejar-support"
import { AuthService, serviceOptions } from "@bloom-housing/backend-core/types"
import type { NextApiRequest, NextApiResponse } from "next"
import qs from "qs"
import { CookieJar } from "tough-cookie"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const authService = new AuthService()
  const jar = new CookieJar()
  serviceOptions.axios = wrapper(
    axiosStatic.create({
      baseURL: process.env.BACKEND_API_BASE,
      withCredentials: true,
      headers: {
        jurisdictionName: process.env.jurisdictionName,
      },
      paramsSerializer: (params) => {
        return qs.stringify(params)
      },
      jar,
    })
  )
  console.log("req (2):", { req })
  try {
    const { email, password, mfaCode, mfaType } = req.body
    const response = await authService?.login({ body: { email, password, mfaCode, mfaType } })
    console.log("res (9):", { response })
    console.log("jar (29):", { jar })
    res.status(200).json(response)
  } catch (e) {
    console.log("e (13):", { e })
    res.status(400).json({ sheesh: 1 })
  }
}
