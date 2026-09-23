import { BrandRadiusEnum } from "../../src/types/backend-swagger"
import { radiusVariable } from "../../src/utilities/brandRadius"

describe("radiusVariable", () => {
  it("names the unsuffixed variable for the base step", () => {
    expect(radiusVariable("base")).toEqual("var(--seeds-rounded)")
  })

  // A step that produced a variable ui-seeds does not define would render no radius at all.
  it.each(Object.values(BrandRadiusEnum).filter((step) => step !== BrandRadiusEnum.base))(
    "names a suffixed variable for %s",
    (step) => {
      expect(radiusVariable(step)).toEqual(`var(--seeds-rounded-${step})`)
    }
  )
})
