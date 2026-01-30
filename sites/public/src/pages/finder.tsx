import {
  FeatureFlagEnum,
  Jurisdiction,
  MultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { t } from "@bloom-housing/ui-components"
import RentalsFinder from "../components/finder/RentalsFinder"
import Layout from "../layouts/application"
import { fetchJurisdictionByName, fetchMultiselectProgramData } from "../lib/hooks"
import { isFeatureFlagOn } from "../lib/helpers"

export interface FinderProps {
  jurisdiction: Jurisdiction
  multiselectData: MultiselectQuestion[]
}

export default function Finder(props: FinderProps) {
  const activeFeatureFlags: FeatureFlagEnum[] =
    props.jurisdiction?.featureFlags?.reduce(
      (acc, featureFlag) => (featureFlag.active ? [...acc, featureFlag.name] : acc),
      []
    ) || []

  return (
    <Layout pageTitle={t("pageTitle.rentalFinder")}>
      <RentalsFinder
        activeFeatureFlags={activeFeatureFlags}
        multiselectData={props.multiselectData}
        listingFeaturesConfiguration={props.jurisdiction?.listingFeaturesConfiguration}
      />
    </Layout>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStaticProps(context: { req: any; query: any }) {
  const jurisdiction = await fetchJurisdictionByName()

  const multiselectData = isFeatureFlagOn(
    jurisdiction,
    FeatureFlagEnum.swapCommunityTypeWithPrograms
  )
    ? await fetchMultiselectProgramData(context.req, jurisdiction?.id)
    : null

  return {
    props: {
      jurisdiction: jurisdiction,
      multiselectData,
    },
    revalidate: Number(process.env.cacheRevalidate),
  }
}
