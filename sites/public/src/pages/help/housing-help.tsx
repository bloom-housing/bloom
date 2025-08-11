import React from "react"
import HousingHelpDeprecated from "../../components/content-pages/HousingHelpDeprecated"
import HousingHelpSeeds from "../../components/content-pages/HousingHelpSeeds"

const HousingHelp = () =>
  process.env.showNewSeedsDesigns ? <HousingHelpSeeds /> : <HousingHelpDeprecated />

export default HousingHelp
