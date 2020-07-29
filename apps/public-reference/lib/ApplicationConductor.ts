import Router from "next/router"
import { Listing } from "@bloom-housing/core"
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

export const loadSavedListing = () => {
  if (typeof window != "undefined") {
    const savedListing = window.sessionStorage.getItem("bloom-app-listing")
    if (savedListing) {
      const listing = JSON.parse(savedListing)
      return listing
    }
  }

  return null
}

export default class ApplicationConductor {
  application = {} as Record<string, any>
  listing = {} as Listing
  context = null
  returnToReview = false

  constructor(application, listing, context) {
    this.application = application
    this.listing = listing
    this.context = context
  }

  totalNumberOfSteps() {
    return 5
  }

  completeStep(step) {
    this.application.completedStep = Math.max(step, this.application.completedStep)
  }

  canJumpForwardToReview() {
    return this.application.completedStep === this.totalNumberOfSteps() - 1
  }

  sync() {
    setTimeout(() => {
      if (typeof window != "undefined") {
        window.sessionStorage.setItem("bloom-app-autosave", JSON.stringify(this.application))
        if (this.listing) {
          window.sessionStorage.setItem("bloom-app-listing", JSON.stringify(this.listing))
        }
      }
    }, 800)
  }

  reset(shouldSync = true) {
    this.application = blankApplication()
    this.listing = {} as Listing
    if (shouldSync) {
      this.context.syncApplication(this.application)
      this.context.syncListing(this.listing)
    }
    if (typeof window != "undefined") {
      window.sessionStorage.removeItem("bloom-app-autosave")
      window.sessionStorage.removeItem("bloom-app-listing")
    }
  }

  routeTo(url: string) {
    Router.push(url).then(() => window.scrollTo(0, 0))
  }

  routeToNextOrReturnUrl(url: string) {
    Router.push(this.nextOrReturnUrl(url)).then(() => window.scrollTo(0, 0))
  }

  nextOrReturnUrl(url: string) {
    if (this.returnToReview) {
      return "/applications/review/summary"
    } else {
      return url
    }
  }
}
