import { YesNoAnswer } from "../src/applications/PaperApplicationForm/FormTypes"
import WaitlistFormatter from "../src/listings/PaperListingForm/formatters/WaitlistFormatter"
import { FormListing, FormMetadata } from "../src/listings/PaperListingForm/formTypes"

const metadata = {} as FormMetadata
const formatData = (data) => {
  return new WaitlistFormatter({ ...data }, metadata).format().data
}

const setTrue = (data: FormListing) => {
  data.waitlistOpenQuestion = YesNoAnswer.Yes
  data.listingAvailabilityQuestion = "openWaitlist"
}
const setFalse = (data: FormListing) => {
  data.waitlistOpenQuestion = YesNoAnswer.No
  data.listingAvailabilityQuestion = "availableUnits"
}

describe("WaitlistFormatter", () => {
  it("should format waitlistCurrentSize", () => {
    const data = {} as FormListing
    expect(formatData(data).waitlistCurrentSize).toBeNull()

    setTrue(data)
    expect(formatData(data).waitlistCurrentSize).toBeNull()

    data.waitlistCurrentSize = 10
    expect(formatData(data).waitlistCurrentSize).toEqual(10)

    setFalse(data)
    expect(formatData(data).waitlistCurrentSize).toBeNull()
  })

  it("should format waitlistMaxSize", () => {
    const data = {} as FormListing
    expect(formatData(data).waitlistMaxSize).toBeNull()

    setTrue(data)
    expect(formatData(data).waitlistMaxSize).toBeNull()

    data.waitlistMaxSize = 20
    expect(formatData(data).waitlistMaxSize).toEqual(20)

    setFalse(data)
    expect(formatData(data).waitlistMaxSize).toBeNull()
  })

  it("should format waitlistOpenSpots", () => {
    const data = {} as FormListing
    expect(formatData(data).waitlistOpenSpots).toBeNull()

    setTrue(data)
    expect(formatData(data).waitlistOpenSpots).toBeNull()

    data.waitlistOpenSpots = 15
    expect(formatData(data).waitlistOpenSpots).toEqual(15)

    setFalse(data)
    expect(formatData(data).waitlistOpenSpots).toBeNull()
  })

  it("should format isWaitlistOpen", () => {
    const data = {} as FormListing
    expect(formatData(data).isWaitlistOpen).toBeNull()

    setTrue(data)
    expect(formatData(data).isWaitlistOpen).toEqual(true)

    setFalse(data)
    expect(formatData(data).isWaitlistOpen).toEqual(false)
  })
})
