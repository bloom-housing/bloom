import { ApplicationProgram } from "@bloom-housing/backend-core/types"
import StepDefinition from "./StepDefinition"

export default class ProgramsStep extends StepDefinition {
  skipStep() {
    return !this.conductor.listing?.listingPrograms?.length
  }

  save(formData: ApplicationProgram[]) {
    this.application.programs = formData
    this.conductor.sync()
  }
}
