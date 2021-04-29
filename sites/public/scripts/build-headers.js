const path = require("path")
const fs = require("fs")

const countyCode = process.env.COUNTY_CODE

if (!countyCode) {
  console.info("env COUNTY_CODE undefined, building headers skipped")
  process.exit(0)
}

const headersFileContent = `
/*
  X-County-Code: ${countyCode}
`

const headersPath = path.join("public", "_headers")
fs.appendFileSync(headersPath, headersFileContent)
