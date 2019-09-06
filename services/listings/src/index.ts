type AnyDict = { [key: string]: any }
import Application from "koa"
import cors from "@koa/cors"
import dotenv from "dotenv"
import { transformUnitsIntoGroups } from "./lib/unit_transformations"

dotenv.config({ path: ".env" })

const config = {
  port: parseInt(process.env.PORT || "3001", 10)
}

import archer from "../listings/archer.json"
import gish from "../listings/gish.json"
import triton from "../listings/triton.json"

const listings = [triton as AnyDict, gish as AnyDict, archer as AnyDict]

// Transform all the listings
listings.forEach(listing => {
  listing.groupedUnits = transformUnitsIntoGroups(listing.units)
})

const data = { status: "ok", listings: listings }

const app = new Application()

// TODO: app.use(logger(winston));
app.use(cors())

app.use(ctx => {
  ctx.body = data
})

app.listen(config.port)
console.log(`Server running on port ${config.port}`)
