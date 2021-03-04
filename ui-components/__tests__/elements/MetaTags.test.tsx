import React from "react"
import { render, cleanup } from "@testing-library/react"
import { MetaTags } from "../../src/elements/MetaTags"

afterEach(cleanup)

describe("<MetaTags>", () => {
  it("renders without error", () => {
    render(<MetaTags title={"Title"} description={"Description"} />)
  })
})
