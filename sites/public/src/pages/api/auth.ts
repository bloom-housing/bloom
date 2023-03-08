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
  try {
    const { email, password, mfaCode, mfaType } = req.body
    const response = await authService?.login({ body: { email, password, mfaCode, mfaType } })
    const cookies = await jar.getSetCookieStrings(process.env.BACKEND_API_BASE)
    res.setHeader("Set-Cookie", cookies)
    res.status(200).json(response)
  } catch (e) {
    res.status(400).json({ e: JSON.stringify(e) })
  }
}
