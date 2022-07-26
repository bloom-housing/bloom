import StepDefinition from "./StepDefinition"

export default class PreferencesAllStep extends StepDefinition {
  skipStep() {
    return !this.conductor.listing?.listingMultiselectQuestions.filter(
      (question) => question.multiselectQuestion.applicationSection === "preferences"
    ).length
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(formData: Record<string, any>) {
    this.application.preferences = formData
    this.conductor.sync()
  }
}
