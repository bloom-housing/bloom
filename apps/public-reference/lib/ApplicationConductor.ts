import Router from "next/router"
import { Listing } from "@bloom-housing/core"
import { blankApplication } from "./AppSubmissionContext"
import { ApplicationFormConfig, StepRoute } from "./configInterfaces"
import StepDefinition from "./StepDefinition"
import AlternateContactStep from "./AlternateContactStep"
import HouseholdMemberStep from "./HouseholdMemberStep"
import SelectedPreferencesStep from "./SelectedPreferencesStep"

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
  static routes: Record<string, StepRoute> = {
    chooseLanguage: {
      url: "/applications/start/choose-language",
    },
    whatToExpect: {
      url: "/applications/start/what-to-expect",
    },
    primaryApplicantName: {
      url: "/applications/contact/name",
    },
    primaryApplicantAddress: {
      url: "/applications/contact/address",
    },
    alternateContactType: {
      url: "/applications/contact/alternate-contact-type",
    },
    alternateContactName: {
      url: "/applications/contact/alternate-contact-name",
      definition: AlternateContactStep,
    },
    alternateContactInfo: {
      url: "/applications/contact/alternate-contact-contact",
      definition: AlternateContactStep,
    },
    liveAlone: {
      url: "/applications/household/live-alone",
    },
    householdMemberInfo: {
      url: "/applications/household/members-info",
      definition: HouseholdMemberStep,
    },
    addMembers: {
      url: "/applications/household/add-members",
      definition: HouseholdMemberStep,
    },
    preferredUnitSize: {
      url: "/applications/household/preferred-units",
    },
    adaHouseholdMembers: {
      url: "/applications/household/ada",
    },
    vouchersSubsidies: {
      url: "/applications/financial/vouchers",
    },
    income: {
      url: "/applications/financial/income",
    },
    preferencesIntroduction: {
      url: "/applications/preferences/select",
    },
    generalPool: {
      url: "/applications/preferences/general",
      definition: SelectedPreferencesStep,
    },
    demographics: {
      url: "/applications/review/demographics",
    },
    summary: {
      url: "/applications/review/summary",
    },
    terms: {
      url: "/applications/review/terms",
    },
  }

  application: Record<string, any> = {}
  steps: StepDefinition[] = []
  returnToReview = false
  currentStepIndex = 0

  private _config: ApplicationFormConfig = {
    sections: [],
    languages: [],
    steps: [],
  }
  private _listing: Listing

  constructor(application, listing) {
    this.application = application
    this.listing = listing
  }

  set listing(newListing) {
    this._listing = newListing
    if (this._listing?.applicationConfig) {
      this.config = this._listing.applicationConfig as ApplicationFormConfig
    }
  }

  get listing() {
    return this._listing
  }

  set config(newConfig) {
    this._config = newConfig
    this.listing.applicationConfig = { ...newConfig }
    this.steps = this._config.steps.map((step) => {
      const route = this.constructor["routes"][step.name] as StepRoute
      if (route.definition) {
        return new route.definition(this, step, route.url)
      } else {
        return new StepDefinition(this, step, route.url)
      }
    })
  }

  get config() {
    return this._config
  }

  get currentStep() {
    return this.steps[this.currentStepIndex]
  }

  totalNumberOfSections() {
    return this.config.sections.length
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

  stepTo(stepName: string) {
    const stepIndex = this.steps.findIndex((step) => step.name === stepName)
    if (stepIndex >= 0) {
      this.currentStepIndex = stepIndex
    } else {
      console.error(`There is no step defined which matches ${stepName}`)
    }
  }

  routeTo(url: string) {
    Router.push(url).then(() => window.scrollTo(0, 0))
  }

  routeToNextOrReturnUrl(url?: string) {
    Router.push(this.nextOrReturnUrl(url)).then(() => window.scrollTo(0, 0))
    this.returnToReview = false
  }

  nextOrReturnUrl(url?: string) {
    if (this.returnToReview) {
      return "/applications/review/summary"
    } else if (url) {
      return url
    } else {
      return this.determineNextUrl()
    }
  }

  skipCurrentStepIfNeeded() {
    if (this.currentStep?.skipStep()) {
      this.routeToNextOrReturnUrl()
    }
  }

  determineNextUrl() {
    let i = this.currentStepIndex + 1
    let nextUrl = ""

    while (i < this.steps.length) {
      const nextStep = this.steps[i]
      if (nextStep && !nextStep.skipStep()) {
        nextUrl = nextStep.url
        break
      } else {
        i++
      }
    }

    return nextUrl
  }

  determinePreviousUrl() {
    let i = this.currentStepIndex - 1
    let previousUrl = ""

    while (i >= 0) {
      const previousStep = this.steps[i]
      if (previousStep && !previousStep.skipStep()) {
        previousUrl = previousStep.url
        break
      } else {
        i--
      }
    }

    return previousUrl
  }
}
