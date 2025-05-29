import {
  FeatureFlagEnum,
  Jurisdiction,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import RentalsFinder from "../components/finder/RentalsFinder"
import Layout from "../layouts/application"
import { fetchJurisdictionByName } from "../lib/hooks"

export default function Finder(props) {
  const activeFeatureFlags: FeatureFlagEnum[] = (
    props.jurisdiction as Jurisdiction
  ).featureFlags.reduce((acc, featureFlag) => featureFlag.active && [...acc, featureFlag.name], [])

  return (
    <Layout>
      <RentalsFinder activeFeatureFalgs={activeFeatureFlags} />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName(context.req)

  return {
    props: {
      jurisdiction: jurisdiction,
    },
  }
}
