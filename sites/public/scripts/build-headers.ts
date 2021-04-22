import path from "path"
import fs from "fs"

import { CountyCode } from "@bloom-housing/backend-core/types"

const countyCode = process.env.COUNTY_CODE

if (!countyCode) {
  console.info("env COUNTY_CODE undefined, building headers")
  process.exit(0)
}

if (!(<any>Object).values(CountyCode).includes(countyCode)) {
  console.error("Invalid county code: ", countyCode)
}

const headersFileContent = `
/*
  X-County-Code: ${countyCode}
`

const headersPath = path.join("public", "_headers")
fs.appendFileSync(headersPath, headersFileContent)
