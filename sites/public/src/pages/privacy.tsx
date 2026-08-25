import React from "react"
import PrivacyDeprecated from "../components/content-pages/PrivacyDeprecated"
import PrivacySeeds from "../components/content-pages/PrivacySeeds"
import { fetchSharedPageProps } from "../lib/hooks"

const Privacy = () => (process.env.showNewSeedsDesigns ? <PrivacySeeds /> : <PrivacyDeprecated />)

export default Privacy

export async function getStaticProps({ locale }: { locale?: string }) {
  const shared = await fetchSharedPageProps(locale)

  return {
    props: { ...shared },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
