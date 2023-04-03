import type { NextApiRequest, NextApiResponse } from "next"
import { adapterFunction } from "@bloom-housing/shared-helpers"

/*
  This file exists as per https://nextjs.org/docs/api-routes/dynamic-api-routes  
  it serves as an adapter between the front end making api requests and those requests being sent to the backend api
  This file functionally works as a proxy to work in the new cookie paradigm
*/

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await adapterFunction(req, res, "partner")
}
