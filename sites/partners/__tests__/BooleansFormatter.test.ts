import { ListingApplicationAddressType } from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../src/applications/PaperApplicationForm/FormTypes"
import BooleansFormatter from "../src/listings/PaperListingForm/formatters/BooleansFormatter"
import {
  AnotherAddressEnum,
  FormListing,
  FormMetadata,
} from "../src/listings/PaperListingForm/formTypes"

// test helpers
const metadata = {} as FormMetadata
const formatData = (data) => {
  return new BooleansFormatter({ ...data }, metadata).format().data
}

describe("BooleansFormatter", () => {
  it("should format applicationDropOffAddressType", () => {
    const data = {} as FormListing

    expect(formatData(data).applicationDropOffAddressType).toBeNull()

    data.canApplicationsBeDroppedOff = YesNoAnswer.Yes
    data.whereApplicationsDroppedOff = ListingApplicationAddressType.leasingAgent
    expect(formatData(data).applicationDropOffAddressType).toEqual(
      ListingApplicationAddressType.leasingAgent
    )

    data.whereApplicationsDroppedOff = AnotherAddressEnum.anotherAddress
    expect(formatData(data).applicationDropOffAddressType).toBeNull()
  })

  it("should format digitalApplication", () => {
    const data = {} as FormListing

    expect(formatData(data).digitalApplication).toBeNull()

    data.digitalApplicationChoice = YesNoAnswer.Yes
    expect(formatData(data).digitalApplication).toBe(true)

    data.digitalApplicationChoice = YesNoAnswer.No
    expect(formatData(data).digitalApplication).toBe(false)
  })
})
