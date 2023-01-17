import Formatter from "./Formatter"
import { YesNoAnswer } from "../helpers"

export default class WaitlistFormatter extends Formatter {
  /** Process all of the waitlist settings */
  process() {
    const showWaitlist =
      this.data.waitlistOpenQuestion === YesNoAnswer.Yes &&
      this.data.listingAvailabilityQuestion === "openWaitlist"

    this.processBoolean("isWaitlistOpen", {
      when: showWaitlist,
      falseCase: () => (this.data.waitlistOpenQuestion === YesNoAnswer.No ? false : null),
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
