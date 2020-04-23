import ApplicationConductor from "../ApplicationConductor"

export default class AppSubmissionStep1a {
  conductor = null as ApplicationConductor
  application = {} as Record<string, any>

  constructor(conductor) {
    this.conductor = conductor
    this.application = conductor.application
  }

  save(formData) {
    // Pull in all data
    for (const [key, value] of Object.entries(formData)) {
      if (typeof this.application[key] != "undefined") {
        this.application[key] = value
      }
    }

    // Transformations
    this.application.name = `${formData.firstname} ${formData.lastname}`

    this.conductor.advanceToNextStep()
    this.conductor.sync()
  }
}
