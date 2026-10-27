import { YesNoEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Formatter from "./Formatter"

export default class WaitlistFormatter extends Formatter {
  /** Process all of the waitlist settings */
  process() {
    const showWaitlist =
      this.data.waitlistOpenQuestion === YesNoEnum.yes &&
      (this.data.listingAvailabilityQuestion === "openWaitlist" || this.metadata.enableUnitGroups)

    this.processBoolean("isWaitlistOpen", {
      when: showWaitlist,
      falseCase: () => (this.data.waitlistOpenQuestion === YesNoEnum.no ? false : null),
    })
    this.processBoolean("waitlistCurrentSize", {
      when: this.data.waitlistCurrentSize && showWaitlist,
      trueCase: () => Number(this.data.waitlistCurrentSize),
    })
    this.processBoolean("waitlistMaxSize", {
      when: this.data.waitlistMaxSize && showWaitlist,
      trueCase: () => Number(this.data.waitlistMaxSize),
    })
    this.processBoolean("waitlistOpenSpots", {
      when: this.data.waitlistOpenSpots && showWaitlist,
      trueCase: () => Number(this.data.waitlistOpenSpots),
    })
  }
}
