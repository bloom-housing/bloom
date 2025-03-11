import React from "react"
import DisclaimerSeeds from "../components/content-pages/DisclaimerSeeds"
import DisclaimerDeprecated from "../components/content-pages/DisclaimerDeprecated"

const Disclaimer = () =>
  process.env.showNewSeedsDesigns ? <DisclaimerSeeds /> : <DisclaimerDeprecated />

export default Disclaimer
