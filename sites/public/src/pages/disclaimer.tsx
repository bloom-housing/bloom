import React from "react"
import DisclaimerSeeds from "../components/content-pages/DisclaimerSeeds"
import DisclaimerDeprecated from "../components/content-pages/DisclaimerDeprecated"
import { sharedGetStaticProps } from "../lib/sharedPageProps"

const Disclaimer = () =>
  process.env.showNewSeedsDesigns ? <DisclaimerSeeds /> : <DisclaimerDeprecated />

export default Disclaimer

export const getStaticProps = sharedGetStaticProps
