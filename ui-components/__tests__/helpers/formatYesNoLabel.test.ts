import { cleanup } from "@testing-library/react"
import { formatYesNoLabel } from "../../src/helpers/formatYesNoLabel"
import { t } from "../../src/helpers/translator"

afterEach(cleanup)

describe("format yes-no label", () => {
  it("should format properly", () => {
    expect(formatYesNoLabel(true)).toBe(t("t.yes"))
    expect(formatYesNoLabel(false)).toBe(t("t.no"))
    expect(formatYesNoLabel(null)).toBe(t("t.n/a"))
  })
})
