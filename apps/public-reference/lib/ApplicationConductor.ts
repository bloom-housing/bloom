import Router from "next/router"
import { Listing } from "@bloom-housing/core"
import { blankApplication } from "../lib/AppSubmissionContext"
import StepDefinition from "../lib/StepDefinition"
import { resolversLibrary } from "../lib/resolversLibrary"

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
  resolvers = {} as Record<string, any>
  listing = {} as Listing
  returnToReview = false
  currentStep = 0

  private _config = {} as Record<string, any>

  constructor(application, listing) {
    this.application = application
    this.listing = listing
  }

  set config(newConfig) {
    this._config = newConfig
    this._config.steps = this._config.steps.map((step) => {
      return new StepDefinition(step, this)
    })
  }

  get config() {
    return this._config
  }

  totalNumberOfSections() {
    return 5
  }

  completeSection(section) {
    this.application.completedSections = Math.max(section, this.application.completedSections)
  }

  canJumpForwardToReview() {
    return this.application.completedSections === this.totalNumberOfSections() - 1
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

  reset() {
    this.application = blankApplication()
    this.listing = {} as Listing

    if (typeof window != "undefined") {
      window.sessionStorage.removeItem("bloom-app-autosave")
      window.sessionStorage.removeItem("bloom-app-listing")
    }
  }

  routeTo(url: string) {
    Router.push(url).then(() => window.scrollTo(0, 0))
  }

  routeToNextOrReturnUrl(url?: string) {
    Router.push(this.nextOrReturnUrl(url)).then(() => window.scrollTo(0, 0))
  }

  nextOrReturnUrl(url?: string) {
    if (this.returnToReview) {
      return "/applications/review/summary"
    } else if (url) {
      return url
    } else {
      return this.determineNextUrl(this.config.steps[this.currentStep].nextUrl)
    }
  }

  determineNextUrl(url) {
    const stepDefinition = this.config.steps.find((step) => step.url == url)

    return stepDefinition?.verifiedSkipToUrl() || url
  }
}
