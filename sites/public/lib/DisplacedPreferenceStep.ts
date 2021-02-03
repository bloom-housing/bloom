import { InputType } from "@bloom-housing/backend-core/types"
import StepDefinition from "./StepDefinition"

export default class DisplacedPreferenceStep extends StepDefinition {
  save(formData: Record<string, any>) {
    const preferenceData = {
      key: "displacedTenant",
      claimed: !formData.none,
      options: [
        {
          key: "general",
          checked: formData.general,
          extraData: [],
        },
        {
          key: "missionCorridor",
          checked: formData.missionCorridor,
        },
      ],
    }
    if (formData.general) {
      preferenceData.options[0].extraData.push(
        {
          key: "name",
          type: InputType.text,
          value: formData.displaceeName,
        },
        {
          key: "address",
          type: InputType.address,
          value: formData.displaceeAddress,
        }
      )
    }
    this.application.preferences[1] = preferenceData
    console.log(this.application.preferences)
    this.conductor.sync()
  }
}
