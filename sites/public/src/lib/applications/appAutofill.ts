import { blankApplication } from "@bloom-housing/shared-helpers"
import {
  Address,
  Application,
  ApplicationStatusEnum,
  ApplicationSubmissionTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"

class AutofillCleaner {
  application: Application = null

  constructor(application: Application) {
    this.application = application
  }

  clean() {
    // prettier-ignore
    this.
      addDefaults().
      removeAdditionalKeys()

    return this.application
  }

  addDefaults() {
    ;["id", "createdAt", "updatedAt", "deletedAt", "listing", "submissionDate"].forEach((key) => {
      delete this.application[key]
    })

    this.application["confirmationCode"] = "" // only used on frontend
    this.application["completedSections"] = 0 // only used on frontend
    this.application["autofilled"] = true // only used on frontend
    this.application.submissionType = ApplicationSubmissionTypeEnum.electronical
    this.application.acceptedTerms = false
    this.application.status = ApplicationStatusEnum.submitted
    this.application.preferences = []
    this.application.programs = []

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
    //set to undefined since it's dependent on the 'work in region' question which has been removed
    //handles case of autofilling with applications submitted before app.service sets workAddress to undefined
    this.application.applicant.applicantWorkAddress = undefined
    unsetIdentifiers(this.application.applicationsMailingAddress)

    if (this.application.applicationsAlternateAddress)
      unsetIdentifiers(this.application.applicationsAlternateAddress)

    this.application.householdMember
      .sort((a, b) => a.orderId - b.orderId)
      .forEach((member, index) => {
        unsetIdentifiers(member)
        member.orderId = index
        if (member.householdMemberAddress) unsetIdentifiers(member.householdMemberAddress)
        //same reasoning as line 51-52
        member.householdMemberWorkAddress = undefined
      })
    unsetIdentifiers(this.application.demographics)

    if (this.application.alternateContact) {
      unsetIdentifiers(this.application.alternateContact)
      if (this.application.alternateContact.address) {
        unsetIdentifiers(this.application.alternateContact.address)
      }
    }

    return this
  }
}

export default AutofillCleaner
