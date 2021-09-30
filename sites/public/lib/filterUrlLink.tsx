import { encodeToFrontendFilterString, ListingFilterState } from "@bloom-housing/ui-components"

export function getFilterUrlLink(eligibilityRequirements) {
  /** This is where any logic for the filtered results from the eligibility questionnaire should be located.*/

  const SENIOR_AGE = 62

  const params: ListingFilterState = {}

  if (eligibilityRequirements.age < SENIOR_AGE) {
    params.seniorHousing = false
  }

  return `/listings/filtered?${encodeToFrontendFilterString(params)}`
}
