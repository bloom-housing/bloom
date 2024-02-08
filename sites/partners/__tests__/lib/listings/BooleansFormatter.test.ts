import {
  ApplicationAddressTypeEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import BooleansFormatter from "../../../src/lib/listings/BooleansFormatter"
import { AnotherAddressEnum, FormListing, FormMetadata } from "../../../src/lib/listings/formTypes"

// test helpers
const metadata = {} as FormMetadata
const formatData = (data) => {
  return new BooleansFormatter({ ...data }, metadata).format().data
}

describe("BooleansFormatter", () => {
  it("should format applicationDropOffAddressType", () => {
    const data = {} as FormListing

    expect(formatData(data).applicationDropOffAddressType).toBeNull()

    data.canApplicationsBeDroppedOff = YesNoEnum.yes
    data.whereApplicationsDroppedOff = ApplicationAddressTypeEnum.leasingAgent
    expect(formatData(data).applicationDropOffAddressType).toEqual(
      ApplicationAddressTypeEnum.leasingAgent
    )

    data.whereApplicationsDroppedOff = AnotherAddressEnum.anotherAddress
    expect(formatData(data).applicationDropOffAddressType).toBeNull()
  })

  it("should format digitalApplication", () => {
    const data = {} as FormListing

    expect(formatData(data).digitalApplication).toBeNull()

    data.digitalApplicationChoice = YesNoEnum.yes
    expect(formatData(data).digitalApplication).toBe(true)

    data.digitalApplicationChoice = YesNoEnum.no
    expect(formatData(data).digitalApplication).toBe(false)
  })
})
