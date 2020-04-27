import { blankApplication } from "../lib/AppSubmissionContext"

export const loadApplicationFromAutosave = () => {
  if (typeof window != "undefined") {
    const autosavedApplication = window.localStorage.getItem("bloom-app-autosave")
    if (autosavedApplication) {
      const application = JSON.parse(autosavedApplication)
      application.loaded = true
      return application
    }
  }

  return null
}

export default class ApplicationConductor {
  application = {} as Record<string, any>
  context = null

  constructor(application, context) {
    this.application = application
    this.context = context
  }

  totalNumberOfSteps() {
    return 2
  }

  advanceToNextStep() {
    this.application.completedStep += 1
  }

  sync() {
    setTimeout(() => {
      if (typeof window != "undefined") {
        window.localStorage.setItem("bloom-app-autosave", JSON.stringify(this.application))
      }
    }, 800)
  }

  reset() {
    this.application = blankApplication()
    this.context.syncApplication(this.application)
    if (typeof window != "undefined") {
      window.localStorage.removeItem("bloom-app-autosave")
    }
  }
}
