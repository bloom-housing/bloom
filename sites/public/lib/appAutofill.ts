import {
  Address,
  Application,
  ApplicationStatus,
  ApplicationSubmissionType,
  Language,
} from "@bloom-housing/backend-core/types"
import { blankApplication } from "@bloom-housing/ui-components"

class AutofillCleaner {
  application: Application = null
  contextApplication: Application = null

  // provide context value to override current application language choosen by user on the first step
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(application: Application, contextApplication: any) {
    this.application = application
    this.contextApplication = contextApplication
  }

  clean() {
    // prettier-ignore
    this.
      addDefaults().
      removeAdditionalKeys().
      removeLiveWorkAddresses()

    return this.application
  }

  addDefaults() {
    ;["id", "createdAt", "updatedAt", "deletedAt", "listing", "submissionDate"].forEach((key) => {
      delete this.application[key]
    })

    this.application["confirmationId"] = "" // only used on frontend
    this.application["completedSections"] = 0 // only used on frontend
    this.application["autofilled"] = true // only used on frontend
    this.application.submissionType = ApplicationSubmissionType.electronical
    this.application.acceptedTerms = false
    this.application.status = ApplicationStatus.submitted
    this.application.preferences = []
    this.application.language = this.contextApplication.language || Language.en

    return this
  }

  removeAdditionalKeys() {
    const unsetIdentifiers = (obj: { id: string; createdAt: Date; updatedAt: Date }) => {
      delete obj.id
      delete obj.createdAt
      delete obj.updatedAt
    }

    unsetIdentifiers(this.application.accessibility)
    unsetIdentifiers(this.application.applicant)
    unsetIdentifiers(this.application.mailingAddress)

    if (this.application.alternateAddress) unsetIdentifiers(this.application.alternateAddress)

    this.application.householdMembers
      .sort((a, b) => a.orderId - b.orderId)
      .forEach((member, index) => {
        unsetIdentifiers(member)
        member.orderId = index
        if (member.address) unsetIdentifiers(member.address)
        if (member.workAddress) unsetIdentifiers(member.workAddress)
      })
    unsetIdentifiers(this.application.demographics)

    if (this.application.alternateContact) {
      unsetIdentifiers(this.application.alternateContact)
      if (this.application.alternateContact.mailingAddress) {
        unsetIdentifiers(this.application.alternateContact.mailingAddress)
      }
    }

    return this
  }

  removeLiveWorkAddresses() {
    this.application.applicant.workInRegion = null
    this.application.applicant.workAddress = blankApplication().applicant.workAddress as Address

    return this
  }
}

export default AutofillCleaner
