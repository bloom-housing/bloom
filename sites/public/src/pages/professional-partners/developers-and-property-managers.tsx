import React from "react"
import DevelopersAndPropertyManagersSeeds from "../../components/content-pages/DevelopersPropertyManagersSeeds"
import DevelopersAndPropertyManagersDeprecated from "../../components/content-pages/DevelopersPropertyManagersDeprecated"

const DevelopersAndPropertyManagers = () =>
  process.env.showNewSeedsDesigns ? (
    <DevelopersAndPropertyManagersSeeds />
  ) : (
    <DevelopersAndPropertyManagersDeprecated />
  )

export default DevelopersAndPropertyManagers
