import { blankApplication } from "../lib/AppSubmissionContext"
import { Listing } from "@bloom-housing/core"

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
  console.log("loadSavedListing: ")
  if (typeof window != "undefined") {
    const savedListing = window.sessionStorage.getItem("bloom-app-listing")
    console.log("Loading: " + savedListing)
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

  constructor(application, listing, context) {
    let test
    if (listing) test = listing.id
    console.log("Constructor: " + (test || "null"))
    this.application = application
    this.listing = listing
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
        console.log("Sync setting to:" + this.listing.id)
        window.sessionStorage.setItem("bloom-app-listing", JSON.stringify(this.listing))
      }
    }, 800)
  }

  reset(shouldSync = true) {
    this.application = blankApplication()
    this.listing = {} as Listing
    console.log("Resetting")
    if (shouldSync) {
      this.context.syncApplication(this.application)
      this.context.syncListing(this.listing)
    }
    if (typeof window != "undefined") {
      window.sessionStorage.removeItem("bloom-app-autosave")
      window.sessionStorage.removeItem("bloom-app-listing")
    }
  }
}
