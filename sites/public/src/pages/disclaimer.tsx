import React from "react"
import DisclaimerSeeds from "../components/content-pages/DisclaimerSeeds"
import DisclaimerDeprecated from "../components/content-pages/DisclaimerDeprecated"
import { fetchSharedPageProps } from "../lib/hooks"

const Disclaimer = () =>
  process.env.showNewSeedsDesigns ? <DisclaimerSeeds /> : <DisclaimerDeprecated />

export default Disclaimer

export async function getStaticProps({ locale }: { locale?: string }) {
  const shared = await fetchSharedPageProps(locale)

  return {
    props: { ...shared },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
