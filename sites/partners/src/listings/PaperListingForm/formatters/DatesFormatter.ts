import Formatter from "./Formatter"
import { createDate, createTime } from "../../../../lib/helpers"

export default class DatesFormatter extends Formatter {
  /** Set dates/times for certain fields */
  process() {
    this.data.applicationDueDate = createDate(this.data.applicationDueDateField)
    this.data.applicationDueTime = createTime(
      this.data.applicationDueDate,
      this.data.applicationDueTimeField
    )
  }
}
