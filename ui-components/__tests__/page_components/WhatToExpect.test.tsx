import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { WhatToExpect } from "../../src/page_components/listing/listing_sidebar/WhatToExpect"

afterEach(cleanup)

describe("<WhatToExpect>", () => {
  it("renders expected text and expandable content", () => {
    const { getByText, queryByText } = render(
      <WhatToExpect
        content={"What To Expect Content"}
        expandableContent={"What To Expect Expandable Content"}
      />
    )
    expect(getByText("What To Expect Content")).toBeTruthy()
    expect(queryByText("What To Expect Expandable Content")).toBeFalsy()
    fireEvent.click(getByText("read more"))
    expect(getByText("What To Expect Expandable Content")).toBeTruthy()
  })
})
