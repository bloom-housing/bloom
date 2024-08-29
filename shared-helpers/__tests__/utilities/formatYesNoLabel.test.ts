import { cleanup } from "@testing-library/react"
import { t } from "@bloom-housing/ui-components"
import { formatYesNoLabel } from "../../src/utilities/formatYesNoLabel"

afterEach(cleanup)

describe("formatYesNoLabel", () => {
  it("should format properly", () => {
    expect(formatYesNoLabel(true)).toBe(t("t.yes"))
    expect(formatYesNoLabel(false)).toBe(t("t.no"))
    expect(formatYesNoLabel(null)).toBe(t("t.n/a"))
  })
})
