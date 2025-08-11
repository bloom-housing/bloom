import React from "react"
import JurisdictionsSeeds from "../../components/content-pages/JurisdictionsSeeds"
import JurisdictionsDeprecated from "../../components/content-pages/JurisdictionsDeprecated"

const Jurisdictions = () =>
  process.env.showNewSeedsDesigns ? <JurisdictionsSeeds /> : <JurisdictionsDeprecated />

export default Jurisdictions
