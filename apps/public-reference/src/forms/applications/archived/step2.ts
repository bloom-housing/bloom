import ApplicationConductor from "../../../../lib/ApplicationConductor"

export default class {
  conductor = null as ApplicationConductor
  application = {} as Record<string, any>

  constructor(conductor) {
    this.conductor = conductor
    this.application = conductor.application
  }

  save(formData) {
    this.application.address = formData
    this.conductor.advanceToNextStep()
    this.conductor.sync()
  }
}
