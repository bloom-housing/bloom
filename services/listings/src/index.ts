type AnyDict = { [key: string]: any }
import Application from "koa"
import cors from "@koa/cors"
import dotenv from "dotenv"
import { transformUnits } from "./lib/unit_transformations"
dotenv.config({ path: ".env" })

const config = {
  port: parseInt(process.env.PORT || "3001", 10)
}

import archer from "../listings/archer.json"
import gish from "../listings/gish.json"
import triton from "../listings/triton.json"

import sanMateoHUD2019 from "../ami_charts/SanMateoHUD2019.json"
import sanMateoHOME2019 from "../ami_charts/SanMateoHOME2019.json"
import sanMateoHERASpecial2019 from "../ami_charts/SanMateoHERASpecial2019.json"
import sanJoseTCAC2019 from "../ami_charts/SanJoseTCAC2019.json"

const amiCharts = {
  1: sanMateoHUD2019,
  2: sanMateoHOME2019,
  3: sanMateoHERASpecial2019,
  4: sanJoseTCAC2019
}

const listings = [triton as AnyDict, gish as AnyDict, archer as AnyDict]

// Transform all the listings
listings.forEach(listing => {
  listing.unitsSummarized = transformUnits(listing.units, amiCharts)
})

const data = {
  status: "ok",
  listings: listings,
  amiCharts: amiCharts
}

const app = new Application()

// TODO: app.use(logger(winston));
app.use(cors())

app.use(ctx => {
  ctx.body = data
})

export default app.listen(config.port)
console.log(`Server running on port ${config.port}`)
