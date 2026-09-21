import React from "react"
import PrivacyDeprecated from "../components/content-pages/PrivacyDeprecated"
import PrivacySeeds from "../components/content-pages/PrivacySeeds"
import { sharedGetStaticProps } from "../lib/sharedPageProps"

const Privacy = () => (process.env.showNewSeedsDesigns ? <PrivacySeeds /> : <PrivacyDeprecated />)

export default Privacy

export const getStaticProps = sharedGetStaticProps
