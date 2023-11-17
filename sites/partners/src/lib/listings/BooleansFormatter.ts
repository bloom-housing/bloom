import Formatter from "./Formatter"
import { YesNoAnswer } from "../helpers"
import { addressTypes } from "./formTypes"

export default class BooleansFormatter extends Formatter {
  /** Format all of the Yes/No questions in the form */
  process() {
    this.processBoolean("applicationDropOffAddressType", {
      when:
        this.data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
        addressTypes[this.data.whereApplicationsDroppedOff] !== addressTypes.anotherAddress,
      trueCase: () => addressTypes[this.data.whereApplicationsDroppedOff],
    })
    this.processBoolean("applicationPickUpAddressType", {
      when:
        this.data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
        addressTypes[this.data.whereApplicationsPickedUp] !== addressTypes.anotherAddress,
      trueCase: () => addressTypes[this.data.whereApplicationsPickedUp],
    })
    this.processBoolean("applicationMailingAddressType", {
      when:
        this.data.canApplicationsBeMailedIn === YesNoAnswer.Yes &&
        addressTypes[this.data.whereApplicationsMailedIn] !== addressTypes.anotherAddress,
      trueCase: () => addressTypes[this.data.whereApplicationsMailedIn],
    })
    this.processBoolean("applicationDropOffAddress", {
      when:
        this.data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
        this.data.whereApplicationsDroppedOff === addressTypes.anotherAddress,
      trueCase: () => this.data.listingsApplicationDropOffAddress,
    })
    this.processBoolean("applicationPickUpAddress", {
      when:
        this.data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
        this.data.whereApplicationsPickedUp === addressTypes.anotherAddress,
      trueCase: () => this.data.listingsApplicationPickUpAddress,
    })
    this.processBoolean("applicationMailingAddress", {
      when:
        this.data.canApplicationsBeMailedIn === YesNoAnswer.Yes &&
        this.data.whereApplicationsMailedIn === addressTypes.anotherAddress,
      trueCase: () => this.data.listingsApplicationMailingAddress,
    })
    this.processBoolean("images", {
      when:
        this.data.listingImages?.length &&
        !!this.data.listingImages[0].assets.fileId &&
        !!this.data.listingImages[0].assets.label,
      trueCase: () => this.data.listingImages,
    })
    this.processBoolean("digitalApplication", {
      when: this.data.digitalApplicationChoice === YesNoAnswer.Yes,
      falseCase: () => (this.data.digitalApplicationChoice === YesNoAnswer.No ? false : null),
    })
    this.data.commonDigitalApplication =
      this.data.commonDigitalApplicationChoice === YesNoAnswer.Yes

    this.processBoolean("paperApplication", {
      when: this.data.paperApplicationChoice === YesNoAnswer.Yes,
      falseCase: () => (this.data.paperApplicationChoice === YesNoAnswer.No ? false : null),
    })

    this.processBoolean("referralOpportunity", {
      when: this.data.referralOpportunityChoice === YesNoAnswer.Yes,
      falseCase: () => (this.data.referralOpportunityChoice === YesNoAnswer.No ? false : null),
    })
  }
}
