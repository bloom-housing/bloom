import { blankApplication } from "../lib/AppSubmissionContext"

export const loadApplicationFromAutosave = () => {
  if (typeof window != "undefined") {
    const autosavedApplication = window.sessionStorage.getItem("bloom-app-autosave")
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
    return 5
  }

  advanceToNextStep() {
    this.application.completedStep += 1
  }

  sync() {
    setTimeout(() => {
      if (typeof window != "undefined") {
        window.sessionStorage.setItem("bloom-app-autosave", JSON.stringify(this.application))
      }
    }, 800)
  }

  reset(shouldSync = true) {
    this.application = blankApplication()
    if (shouldSync) {
      this.context.syncApplication(this.application)
    }
    if (typeof window != "undefined") {
      window.sessionStorage.removeItem("bloom-app-autosave")
    }
  }
}
