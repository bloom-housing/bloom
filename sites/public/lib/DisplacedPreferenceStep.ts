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
          extraData: [],
        },
      ],
    }
    if (formData.general) {
      preferenceData.options[0].extraData.push(
        {
          key: "name",
          type: InputType.text,
          value: formData.generalName,
        },
        {
          key: "address",
          type: InputType.address,
          value: formData.generalAddress,
        }
      )
    }
    if (formData.missionCorridor) {
      preferenceData.options[1].extraData.push(
        {
          key: "name",
          type: InputType.text,
          value: formData.missionCorridorName,
        },
        {
          key: "address",
          type: InputType.address,
          value: formData.missionCorridorAddress,
        }
      )
    }
    this.application.preferences[1] = preferenceData
    this.conductor.sync()
  }
}
