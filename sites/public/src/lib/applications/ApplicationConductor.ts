// Using the router this way is being deprecated in Next (in favor of `useRouter` hook), but since this conductor
// class isn't a component, it's hard to add a hook... for now we'll just leave this code, but it'll likely need to
// get changed at some point.
// eslint-disable-next-line import/no-named-as-default
import Router from "next/router"
import { blankApplication } from "@bloom-housing/shared-helpers"
import { ApplicationFormConfig, StepRoute } from "./configInterfaces"
import StepDefinition from "./StepDefinition"
import AlternateContactStep from "./AlternateContactStep"
import LiveAloneStep from "./LiveAloneStep"
import HouseholdMemberStep from "./HouseholdMemberStep"
import SelectedPreferencesStep from "./SelectedPreferencesStep"
import PreferencesAllStep from "./PreferencesAllStep"
import ProgramsStep from "./ProgramsStep"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

export const loadApplicationFromAutosave = () => {
  if (typeof window !== "undefined") {
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
  if (typeof window !== "undefined") {
    const savedListing = window.sessionStorage.getItem("bloom-app-listing")
    if (savedListing) {
      return JSON.parse(savedListing)
    }
  }

  return null
}

export default class ApplicationConductor {
  static routes: Record<string, StepRoute> = {
    chooseLanguage: {
      url: "/applications/start/choose-language",
    },
    communityDisclaimer: {
      url: "/applications/start/community-disclaimer",
    },
    whatToExpect: {
      url: "/applications/start/what-to-expect",
    },
    autofill: {
      url: "/applications/start/autofill",
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
      definition: LiveAloneStep,
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
    householdChanges: {
      url: "/applications/household/changes",
    },
    householdStudent: {
      url: "/applications/household/student",
    },
    programs: {
      url: "/applications/programs/programs",
      definition: ProgramsStep,
    },
    vouchersSubsidies: {
      url: "/applications/financial/vouchers",
    },
    income: {
      url: "/applications/financial/income",
    },
    preferencesAll: {
      url: "/applications/preferences/all",
      definition: PreferencesAllStep,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  application: Record<string, any> = {}
  steps: StepDefinition[] = []
  returnToReview = false
  currentStepIndex = 0
  navigatedThroughBack = false

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
      if (route?.definition) {
        return new route.definition(this, step, route?.url)
      } else {
        return new StepDefinition(this, step, route?.url)
      }
    })
  }

  get config() {
    return this._config
  }

  get currentStep() {
    return this.steps[this.currentStepIndex]
  }

  get totalNumberOfSections() {
    return this.config.sections.length
  }

  get preferenceStepsTotal() {
    return this.config.steps.filter((step) => step.name.includes("preference")).length
  }

  setNavigatedBack(navigated) {
    this.navigatedThroughBack = navigated
  }

  completeSection(section) {
    this.application.completedSections = Math.max(section, this.application.completedSections)
  }

  canJumpForwardToReview() {
    return this.application.reachedReviewStep
  }

  sync() {
    // NOTE: had to remove timeout because of Next doing full-page reloads in
    // some cases. Need to revisit after upgrading to v10
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("bloom-app-autosave", JSON.stringify(this.application))
      if (this.listing) {
        window.sessionStorage.setItem("bloom-app-listing", JSON.stringify(this.listing))
      }
    }
  }

  reset() {
    this.application = JSON.parse(JSON.stringify(blankApplication))
    this.listing = {} as Listing
    this.currentStepIndex = 0
    if (typeof window !== "undefined") {
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
    void Router.push(url)
  }

  routeToNextOrReturnUrl(url?: string) {
    void Router.push(this.nextOrReturnUrl(url)).then(() => {
      this.returnToReview = false
    })
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
