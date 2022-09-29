import { TimeFieldPeriod } from "@bloom-housing/ui-components"
import { createTime } from "../lib/helpers"
import { YesNoAnswer } from "../src/applications/PaperApplicationForm/FormTypes"
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
    expect(applicationDueDate).toEqual(createTime(applicationDueDate, dueTime))
    expect(formatData(data).applicationDueDate).toEqual(createTime(applicationDueDate, dueTime))
  })

  it("should format postmarkedApplicationsReceivedByDate", () => {
    let data = {}

    expect(formatData(data).postmarkedApplicationsReceivedByDate).toBeNull()

    data = {
      postmarkByDateDateField: dueDate,
      postmarkByDateTimeField: dueTime,
      arePostmarksConsidered: YesNoAnswer.Yes,
    }

    expect(formatData(data).postmarkedApplicationsReceivedByDate.toISOString()).toEqual(
      "2021-10-20T10:30:00.000Z"
    )
  })
})
