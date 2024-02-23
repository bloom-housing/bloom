import { YesNoEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Formatter from "./Formatter"
import { createDate, createTime } from "../helpers"

export default class DatesFormatter extends Formatter {
  /** Set dates/times for certain fields */
  process() {
    const dueDate = createDate(this.data.applicationDueDateField)
    this.data.applicationDueDate =
      this.data.applicationDueTimeField?.hours && this.data.applicationDueTimeField?.minutes
        ? createTime(dueDate, this.data.applicationDueTimeField)
        : createTime(dueDate, {
            hours: "05",
            minutes: "00",
            period: "pm",
          })

    if (this.data.arePostmarksConsidered === YesNoEnum.yes && this.data.postmarkByDateDateField) {
      const postmarkByDateFormatted = createDate(this.data.postmarkByDateDateField)
      this.data.postmarkedApplicationsReceivedByDate =
        this.data.postmarkByDateTimeField?.hours && this.data.postmarkByDateTimeField?.minutes
          ? createTime(postmarkByDateFormatted, this.data.postmarkByDateTimeField)
          : postmarkByDateFormatted
    } else {
      this.data.postmarkedApplicationsReceivedByDate = null
    }
  }
}
