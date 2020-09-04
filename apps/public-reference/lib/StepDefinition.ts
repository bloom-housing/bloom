import ApplicationConductor from "./ApplicationConductor"

export default class StepDefinition {
  conductor: ApplicationConductor
  step: Record<string, any>

  constructor(step, conductor) {
    this.step = step
    this.conductor = conductor
  }

  get name() {
    return this.step.name
  }

  get url() {
    return this.step.url
  }

  get nextUrl() {
    return this.step.nextUrl
  }

  verifiedSkipToUrl() {
    const conditions = this.step.skipIf
    let foundSkipTo = null

    if (conditions) {
      conditions.forEach((condition) => {
        if (foundSkipTo) return

        if (this.conductor.resolvers[condition.condition]()) {
          foundSkipTo = condition.skipTo
        }
      })
    }
    return foundSkipTo
  }
}
