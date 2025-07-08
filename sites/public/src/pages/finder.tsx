import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import RentalsFinder from "../components/finder/RentalsFinder"
import Layout from "../layouts/application"
import { fetchJurisdictionByName } from "../lib/hooks"

export default function Finder({ jurisdiction }: { jurisdiction: Jurisdiction }) {
  const activeFeatureFlags: FeatureFlagEnum[] =
    jurisdiction?.featureFlags?.reduce(
      (acc, featureFlag) => (featureFlag.active ? [...acc, featureFlag.name] : acc),
      []
    ) || []

  return (
    <Layout>
      <RentalsFinder activeFeatureFlags={activeFeatureFlags} />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps() {
  const jurisdiction = await fetchJurisdictionByName()

  return {
    props: {
      jurisdiction: jurisdiction,
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
