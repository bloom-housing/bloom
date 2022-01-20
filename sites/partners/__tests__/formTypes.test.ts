import * as formTypes from "../src/listings/PaperListingForm/formTypes"

test("formTypes work", () => {
  expect(formTypes.addressTypes.anotherAddress).toStrictEqual("anotherAddress")
})
