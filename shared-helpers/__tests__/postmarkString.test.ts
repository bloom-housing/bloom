import { cleanup } from "@testing-library/react"
import { getPostmarkString } from "../src/utilities/postmarkString"
import { t } from "@bloom-housing/ui-components"

afterEach(cleanup)

describe("postmark string helper", () => {
  it("no data", () => {
    expect(getPostmarkString(null, null, null)).toBe("")
  })
  it("excludes postmarks, excludes due date", () => {
    expect(getPostmarkString(null, null, "Developer")).toBe(
      t("listings.apply.submitPaperNoDueDateNoPostMark", { developer: "Developer" })
    )
  })
  it("includes postmarks, includes due date", () => {
    expect(getPostmarkString("November 29th, 2021", "November 30th, 2021", "Developer")).toBe(
      t("listings.apply.submitPaperPostMark", {
        postmarkReceivedByDate: "November 30th, 2021",
        developer: "Developer",
      })
    )
  })
  it("includes postmarks, excludes due date", () => {
    expect(getPostmarkString(null, "November 30th, 2021", "Developer")).toBe(
      t("listings.apply.submitPaperPostMark", {
        postmarkReceivedByDate: "November 30th, 2021",
        developer: "Developer",
      })
    )
  })
  it("excludes postmarks, includes due date", () => {
    expect(getPostmarkString("November 29th, 2021", null, "Developer")).toBe(
      t("listings.apply.submitPaperDueDateNoPostMark", {
        applicationDueDate: "November 29th, 2021",
        developer: "Developer",
      })
    )
  })
})
