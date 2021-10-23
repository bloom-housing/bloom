import { TimeFieldPeriod } from "@bloom-housing/ui-components"
import { createDate, createTime } from "../lib/helpers"
import DatesFormatter from "../src/listings/PaperListingForm/formatters/DatesFormatter"
import { FormMetadata } from "../src/listings/PaperListingForm/formTypes"

// test helpers
const metadata = {} as FormMetadata
const formatData = (data) => {
  return new DatesFormatter({ ...data }, metadata).format().data
}
const dueDate = {
  year: "2021",
  month: "10",
  day: "20",
}
const dueTime = {
  hours: "10",
  minutes: "30",
  period: "am" as TimeFieldPeriod,
}

describe("DatesFormatter", () => {
  it("should format applicationDueDate and Time", () => {
    const data = {
      applicationDueDateField: dueDate,
      applicationDueTimeField: dueTime,
    }
    const applicationDueDate = formatData(data).applicationDueDate
    expect(applicationDueDate).toEqual(createDate(dueDate))
    expect(formatData(data).applicationDueTime).toEqual(createTime(applicationDueDate, dueTime))
  })
})
