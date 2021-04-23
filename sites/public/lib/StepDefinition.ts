import ApplicationConductor from "./ApplicationConductor"

export default class StepDefinition {
  conductor: ApplicationConductor
  step: Record<string, any>
  url: string

  constructor(conductor, step, url) {
    this.step = step
    this.conductor = conductor
    this.url = url
  }

  get name() {
    return this.step.name
  }

  get application() {
    return this.conductor.application
  }

  save(formData: Record<string, any>) {
    // Pull in all the form values that match application fields
    for (const [key, value] of Object.entries(formData)) {
      if (typeof this.application[key] !== "undefined") {
        this.application[key] = value
      }
    }
    this.conductor.sync()
  }

  // Override in subclasses
  skipStep() {
    return false
  }
}
