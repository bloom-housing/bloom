import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import StepDefinition from "./StepDefinition"
import { isFeatureFlagOn } from "../helpers"

export default class ReasonableAccommodationsStep extends StepDefinition {
  skipStep() {
    return !isFeatureFlagOn(this.conductor.config, FeatureFlagEnum.enableReasonableAccommodations)
  }
}
