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
    expect(getByText(t("whatToExpect.default"))).toBeTruthy()
  })
  it("renders with custom what-to-expects", () => {
    const newListing = archer
    newListing.whatToExpect = "Custom what to expect text"

    const { getByText } = render(<WhatToExpect listing={archer} />)
    expect(getByText("Custom what to expect text")).toBeTruthy()
  })
})
