import { BrandRadiusEnum } from "../../src/types/backend-swagger"
import { radiusStepOnly, radiusVariable } from "../../src/utilities/brandRadius"

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

describe("radiusStepOnly", () => {
  it.each(Object.values(BrandRadiusEnum))("keeps %s", (step) => {
    expect(radiusStepOnly(step)).toEqual(step)
  })

  // A step the scale does not define names a variable ui-seeds never declares, so the whole
  // border-radius declaration is invalid rather than falling back.
  it.each(["pill", "", "  base", "BASE", null, undefined])("drops %s", (value) => {
    expect(radiusStepOnly(value)).toBeNull()
  })
})
