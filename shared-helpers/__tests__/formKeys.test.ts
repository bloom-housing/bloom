import * as formKeys from "../src/formKeys"

test("U.S. states exist", () => {
  // it's 52 because DC and "" are included
  expect(formKeys.stateKeys.length).toBe(52)
})
