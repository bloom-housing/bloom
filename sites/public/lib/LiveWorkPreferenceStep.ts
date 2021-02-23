import StepDefinition from "./StepDefinition"

export default class LiveWorkPreferenceStep extends StepDefinition {
  save(formData: Record<string, any>) {
    const preferenceData = {
      key: "liveWork",
      claimed: !formData.none,
      options: [
        {
          key: "live",
          checked: formData.live,
        },
        {
          key: "work",
          checked: formData.work,
        },
      ],
    }
    this.application.preferences[0] = preferenceData
    this.conductor.sync()
  }
}
