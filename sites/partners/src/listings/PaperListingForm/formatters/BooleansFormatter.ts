import Formatter from "./Formatter"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { addressTypes } from "../formTypes"

export default class BooleansFormatter extends Formatter {
  /** Format all of the Yes/No questions in the form */
  process() {
    this.processBoolean("postmarkedApplicationsReceivedByDate", {
      when: this.data.postMarkDate && this.data.arePostmarksConsidered === YesNoAnswer.Yes,
      yes: () =>
        new Date(
          `${this.data.postMarkDate.year}-${this.data.postMarkDate.month}-${this.data.postMarkDate.day}`
        ),
    })

    this.processBoolean("applicationDropOffAddressType", {
      when:
        this.data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
        addressTypes[this.data.whereApplicationsDroppedOff] !== addressTypes.anotherAddress,
      yes: () => addressTypes[this.data.whereApplicationsDroppedOff],
    })
    this.processBoolean("applicationPickUpAddressType", {
      when:
        this.data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
        addressTypes[this.data.whereApplicationsPickedUp] !== addressTypes.anotherAddress,
      yes: () => addressTypes[this.data.whereApplicationsPickedUp],
    })
    this.processBoolean("applicationDropOffAddress", {
      when:
        this.data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
        this.data.whereApplicationsPickedUp === addressTypes.anotherAddress,
      yes: () => this.data.applicationDropOffAddress,
    })
    this.processBoolean("applicationPickUpAddress", {
      when:
        this.data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
        this.data.whereApplicationsPickedUp === addressTypes.anotherAddress,
      yes: () => this.data.applicationPickUpAddress,
    })
    this.processBoolean("applicationMailingAddress", {
      when: this.data.arePaperAppsMailedToAnotherAddress === YesNoAnswer.Yes,
      yes: () => this.data.applicationMailingAddress,
    })

    this.processBoolean("digitalApplication", {
      when: this.data.digitalApplicationChoice === YesNoAnswer.Yes,
      yes: () => true,
      no: () => (this.data.digitalApplicationChoice === YesNoAnswer.No ? false : null),
    })
    this.data.commonDigitalApplication =
      this.data.commonDigitalApplicationChoice === YesNoAnswer.Yes

    this.processBoolean("paperApplication", {
      when: this.data.paperApplicationChoice === YesNoAnswer.Yes,
      yes: () => true,
      no: () => (this.data.paperApplicationChoice === YesNoAnswer.No ? false : null),
    })

    this.processBoolean("referralOpportunity", {
      when: this.data.referralOpportunityChoice === YesNoAnswer.Yes,
      yes: () => true,
      no: () => (this.data.referralOpportunityChoice === YesNoAnswer.No ? false : null),
    })
  }
}
