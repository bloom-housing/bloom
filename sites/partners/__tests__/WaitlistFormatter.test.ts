import { YesNoAnswer } from "../src/applications/PaperApplicationForm/FormTypes"
import WaitlistFormatter from "../src/listings/PaperListingForm/formatters/WaitlistFormatter"
import { FormListing, FormMetadata } from "../src/listings/PaperListingForm/formTypes"

const metadata = {} as FormMetadata
const formatData = (data) => {
  return new WaitlistFormatter({ ...data }, metadata).format().data
}

describe("WaitlistFormatter", () => {
  it("should format waitlistCurrentSize", () => {
    const data = {} as FormListing
    expect(formatData(data).waitlistCurrentSize).toBeNull()

    data.waitlistOpenQuestion = YesNoAnswer.Yes
    expect(formatData(data).waitlistCurrentSize).toBeNull()

    data.waitlistSizeQuestion = YesNoAnswer.Yes
    expect(formatData(data).waitlistCurrentSize).toBeNull()

    data.waitlistCurrentSize = 10
    expect(formatData(data).waitlistCurrentSize).toEqual(10)

    data.waitlistSizeQuestion = YesNoAnswer.No
    expect(formatData(data).waitlistCurrentSize).toBeNull()
  })

  it("should format waitlistMaxSize", () => {
    const data = {} as FormListing
    expect(formatData(data).waitlistMaxSize).toBeNull()

    data.waitlistOpenQuestion = YesNoAnswer.Yes
    data.waitlistSizeQuestion = YesNoAnswer.Yes
    expect(formatData(data).waitlistMaxSize).toBeNull()

    data.waitlistMaxSize = 20
    expect(formatData(data).waitlistMaxSize).toEqual(20)

    data.waitlistSizeQuestion = YesNoAnswer.No
    expect(formatData(data).waitlistMaxSize).toBeNull()
  })

  it("should format waitlistOpenSpots", () => {
    const data = {} as FormListing
    expect(formatData(data).waitlistOpenSpots).toBeNull()

    data.waitlistOpenQuestion = YesNoAnswer.Yes
    data.waitlistSizeQuestion = YesNoAnswer.Yes
    expect(formatData(data).waitlistOpenSpots).toBeNull()

    data.waitlistOpenSpots = 15
    expect(formatData(data).waitlistOpenSpots).toEqual(15)

    data.waitlistSizeQuestion = YesNoAnswer.No
    expect(formatData(data).waitlistOpenSpots).toBeNull()
  })

  it("should format isWaitlistOpen", () => {
    const data = {} as FormListing
    expect(formatData(data).isWaitlistOpen).toBeNull()

    data.waitlistOpenQuestion = YesNoAnswer.Yes
    expect(formatData(data).isWaitlistOpen).toEqual(true)

    data.waitlistOpenQuestion = YesNoAnswer.No
    expect(formatData(data).isWaitlistOpen).toEqual(false)
  })
})
