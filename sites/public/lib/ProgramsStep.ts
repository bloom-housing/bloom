import StepDefinition from "./StepDefinition"

export default class ProgramsStep extends StepDefinition {
  skipStep() {
    return !this.conductor.listing?.listingPrograms?.length
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(formData: Record<string, any>) {
    this.application.programs = formData
    this.conductor.sync()
  }
}
