import React from "react"
import GetStartedSeeds from "../../components/content-pages/GetStartedSeeds"
import GetStartedDeprecated from "../../components/content-pages/GetStartedDeprecated"

const GetStarted = () =>
  process.env.showNewSeedsDesigns ? <GetStartedSeeds /> : <GetStartedDeprecated />

export default GetStarted
