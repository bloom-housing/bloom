import Formatter from "./Formatter"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { addressTypes } from "../formTypes"

export default class BooleansFormatter extends Formatter {
  /** Format all of the Yes/No questions in the form */
  process() {
    this.data.postmarkedApplicationsReceivedByDate =
      this.data.postMarkDate && this.data.arePostmarksConsidered === YesNoAnswer.Yes
        ? new Date(
            `${this.data.postMarkDate.year}-${this.data.postMarkDate.month}-${this.data.postMarkDate.day}`
          )
        : null

    this.data.applicationDropOffAddressType =
      this.data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
      addressTypes[this.data.whereApplicationsDroppedOff] !== addressTypes.anotherAddress
        ? addressTypes[this.data.whereApplicationsDroppedOff]
        : null
    this.data.applicationPickUpAddressType =
      this.data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
      addressTypes[this.data.whereApplicationsPickedUp] !== addressTypes.anotherAddress
        ? addressTypes[this.data.whereApplicationsPickedUp]
        : null
    this.data.applicationDropOffAddress =
      this.data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
      this.data.whereApplicationsPickedUp === addressTypes.anotherAddress
        ? this.data.applicationDropOffAddress
        : null
    this.data.applicationPickUpAddress =
      this.data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
      this.data.whereApplicationsPickedUp === addressTypes.anotherAddress
        ? this.data.applicationPickUpAddress
        : null
    this.data.applicationMailingAddress =
      this.data.arePaperAppsMailedToAnotherAddress === YesNoAnswer.Yes
        ? this.data.applicationMailingAddress
        : null

    this.data.digitalApplication =
      this.data.digitalApplicationChoice === YesNoAnswer.Yes
        ? true
        : this.data.digitalApplicationChoice === YesNoAnswer.No
        ? false
        : null
    this.data.commonDigitalApplication =
      this.data.commonDigitalApplicationChoice === YesNoAnswer.Yes
    this.data.paperApplication =
      this.data.paperApplicationChoice === YesNoAnswer.Yes
        ? true
        : this.data.paperApplicationChoice === YesNoAnswer.No
        ? false
        : null
    this.data.referralOpportunity =
      this.data.referralOpportunityChoice === YesNoAnswer.Yes
        ? true
        : this.data.referralOpportunityChoice === YesNoAnswer.No
        ? false
        : null
  }
}
