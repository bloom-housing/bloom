import { blankApplication } from "../lib/AppSubmissionContext"
import Router from "next/router"

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

  shouldJumpForwardToReview() {
    return this.application.completedStep == 4
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

  routeTo(url: string) {
    Router.push(url).then(() => window.scrollTo(0, 0))
  }

  routeToNextOrReturnUrl(url: string) {
    Router.push(this.nextOrReturnUrl(url)).then(() => window.scrollTo(0, 0))
  }

  nextOrReturnUrl(url: string) {
    if (this.shouldJumpForwardToReview()) {
      return "/applications/review/summary"
    } else {
      return url
    }
  }
}
