import Formatter from "./Formatter"
import { YesNoAnswer } from "../../../applications/PaperApplicationForm/FormTypes"
import { createDate, createTime } from "../../../../lib/helpers"

export default class DatesFormatter extends Formatter {
  /** Set dates/times for certain fields */
  process() {
    // If there is an application due time, save it on the due date field as well
    const appDueDate = createDate(this.data.applicationDueDateField)
    const appDueTime =
      this.data.applicationDueTimeField.hours && this.data.applicationDueTimeField.minutes
        ? createTime(appDueDate, this.data.applicationDueTimeField)
        : undefined

    this.data.applicationDueTime = appDueTime
    this.data.applicationDueDate = appDueTime ?? appDueDate

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
