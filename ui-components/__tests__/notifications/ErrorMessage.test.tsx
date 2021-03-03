import React from "react"
import { render, cleanup } from "@testing-library/react"
import { ErrorMessage } from "../../src/notifications/ErrorMessage"

afterEach(cleanup)

describe("<ErrorMessage>", () => {
  it("renders without error", () => {
    const { getByText } = render(
      <ErrorMessage id={"abcd1234"} error={true}>
        Uh oh!
      </ErrorMessage>
    )
    expect(getByText("Uh oh!")).toBeTruthy()
  })
})
