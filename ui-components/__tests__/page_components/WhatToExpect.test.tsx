import React from "react"
import { render, cleanup } from "@testing-library/react"
import { WhatToExpect } from "../../src/page_components/listing/listing_sidebar/WhatToExpect"
import Archer from "../fixtures/archer.json"
import { t } from "../../src/helpers/translator"

const archer = Object.assign({}, Archer) as any

afterEach(cleanup)

describe("<WhatToExpect>", () => {
  it("renders with default what-to-expects", () => {
    const { getByText } = render(<WhatToExpect listing={archer} />)
    expect(getByText(t("whatToExpect.applicantsWillBeContacted"))).toBeTruthy()
    expect(getByText(t("whatToExpect.allInfoWillBeVerified"))).toBeTruthy()
    expect(getByText(t("whatToExpect.bePreparedIfChosen"))).toBeTruthy()
  })
  it("renders with custom what-to-expects", () => {
    const newListing = archer
    newListing.whatToExpect = {}
    newListing.whatToExpect.applicantsWillBeContacted = "Applicants Custom"
    newListing.whatToExpect.allInfoWillBeVerified = "Info Verified Custom"
    newListing.whatToExpect.bePreparedIfChosen = "Be Prepared Custom"
    const { getByText } = render(<WhatToExpect listing={archer} />)
    expect(getByText("Applicants Custom")).toBeTruthy()
    expect(getByText("Info Verified Custom")).toBeTruthy()
    expect(getByText("Be Prepared Custom")).toBeTruthy()
  })
})
