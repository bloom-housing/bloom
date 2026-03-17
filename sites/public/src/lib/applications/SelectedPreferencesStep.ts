import { getSelectionsForApplicationSection } from "@bloom-housing/shared-helpers"
import {
  ApplicationSelectionCreate,
  ListingMultiselectQuestion,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import StepDefinition from "./StepDefinition"

export default class SelectedPreferencesStep extends StepDefinition {
  skipStep() {
    return (
      this.hasPreferencesSelections || this.application?.preferences?.some((item) => item?.claimed)
    )
  }

  get hasPreferencesSelections() {
    return (
      getSelectionsForApplicationSection(
        this.conductor.listing?.listingMultiselectQuestions,
        "preferences",
        this.application?.applicationSelections
      ).length > 0
    )
  }
}
