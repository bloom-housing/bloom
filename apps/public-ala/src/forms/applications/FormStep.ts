import ApplicationConductor from "../../../lib/ApplicationConductor"

export default class {
  conductor = null as ApplicationConductor
  application = {} as Record<string, any>

  constructor(conductor) {
    this.conductor = conductor
    this.application = conductor.application
  }

  save(formData) {
    // Pull in all the form values that match application fields
    for (const [key, value] of Object.entries(formData)) {
      if (typeof this.application[key] != "undefined") {
        this.application[key] = value
      }
    }
    this.conductor.sync()
  }
}
