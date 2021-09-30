import { encodeToFrontendFilterString, ListingFilterState } from "@bloom-housing/ui-components"

export function getFilterUrlLink(eligibilityRequirements) {
  /** This is where any logic for the filtered results from the eligibility questionnaire should be located.*/

  const SENIOR_AGE = 62

  const state: ListingFilterState = {}

  if (eligibilityRequirements.age < SENIOR_AGE) {
    state.seniorHousing = false
  }
  // If the user has as a disability or they prefer not to reveal they're
  // disability status, we don't need to filter the listings down further.
  // We show all listings as well as the communities that require a disability
  // status to apply.
  if (eligibilityRequirements.disability === "false") {
    state.independentLivingHousing = false
  }

  return `/listings/filtered?${encodeToFrontendFilterString(state)}`
}
