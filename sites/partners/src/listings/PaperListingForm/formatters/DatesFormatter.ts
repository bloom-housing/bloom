import Formatter from "./Formatter"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { createDate, createTime } from "../../../../lib/helpers"

export default class DatesFormatter extends Formatter {
  /** Set dates/times for certain fields */
  process() {
    this.data.applicationDueDate = createDate(this.data.applicationDueDateField)
    this.data.applicationDueTime = createTime(
      this.data.applicationDueDate,
      this.data.applicationDueTimeField
    )

    if (this.data.arePostmarksConsidered === YesNoAnswer.Yes && this.data.postmarkByDateDateField) {
      const postmarkByDateFormatted = createDate(this.data.postmarkByDateDateField)
      if (this.data.postmarkByDateTimeField?.hours) {
        this.data.postmarkedApplicationsReceivedByDate = createTime(
          postmarkByDateFormatted,
          this.data.postmarkByDateTimeField
        )
      } else {
        this.data.postmarkedApplicationsReceivedByDate = postmarkByDateFormatted
      }
    } else {
      this.data.postmarkedApplicationsReceivedByDate = null
    }
  }
}
