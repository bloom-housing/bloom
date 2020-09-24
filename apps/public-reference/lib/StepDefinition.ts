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

  // Override in subclasses
  skipStep() {
    return false
  }
}
