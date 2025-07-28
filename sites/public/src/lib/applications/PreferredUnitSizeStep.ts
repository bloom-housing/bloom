import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import StepDefinition from "./StepDefinition"
import { getUniqueUnitGroupUnitTypes } from "@bloom-housing/shared-helpers/src/utilities/unitTypes"
import { isFeatureFlagOn } from "../helpers"

export default class PreferredUnitSizeStep extends StepDefinition {
  skipStep() {
    const enableUnitGroups = isFeatureFlagOn(
      this.conductor.config,
      FeatureFlagEnum.enableUnitGroups
    )
    if (!enableUnitGroups) {
      return false
    }
    return getUniqueUnitGroupUnitTypes(this.conductor.listing?.unitGroups || []).length === 0
  }
}
