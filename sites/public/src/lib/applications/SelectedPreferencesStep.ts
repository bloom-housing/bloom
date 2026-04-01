import { getSelectionsForApplicationSection } from "@bloom-housing/shared-helpers"
import {
  ApplicationSelectionCreate,
  ListingMultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
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
        MultiselectQuestionsApplicationSectionEnum.preferences,
        this.application?.applicationSelections
      ).filter((selection) => !selection.hasOptedOut).length > 0
    )
  }
}
