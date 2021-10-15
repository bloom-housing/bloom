import Formatter from "./Formatter"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"

export default class WaitlistFormatter extends Formatter {
  /** Process all of the waitlist settings */
  process() {
    const showWaitlistNumber =
      this.data.waitlistOpenQuestion === YesNoAnswer.Yes &&
      this.data.waitlistSizeQuestion === YesNoAnswer.Yes

    this.data.waitlistCurrentSize =
      this.data.waitlistCurrentSize && showWaitlistNumber
        ? Number(this.data.waitlistCurrentSize)
        : null
    this.data.waitlistMaxSize =
      this.data.waitlistMaxSize && showWaitlistNumber ? Number(this.data.waitlistMaxSize) : null
    this.data.waitlistOpenSpots =
      this.data.waitlistOpenSpots && showWaitlistNumber ? Number(this.data.waitlistOpenSpots) : null

    this.data.isWaitlistOpen =
      this.data.waitlistOpenQuestion === YesNoAnswer.Yes
        ? true
        : this.data.waitlistOpenQuestion === YesNoAnswer.No
        ? false
        : null
  }
}
