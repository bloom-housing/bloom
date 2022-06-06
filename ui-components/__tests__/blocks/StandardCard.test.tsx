import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { StandardCard } from "../../src/blocks/StandardCard"
import { Button } from "../../src/actions/Button"

afterEach(cleanup)

describe("<TableCard>", () => {
  it("renders empty state", () => {
    const { getByText } = render(
      <StandardCard title="Table Card Title" emptyStateMessage="Add items to edit" />
    )

    expect(getByText("Table Card Title")).toBeTruthy()
    expect(getByText("Add items to edit")).toBeTruthy()
  })

  it("renders table content", () => {
    const { getByText } = render(
      <StandardCard
        title="Table Card Title"
        emptyStateMessage="Add items to edit"
        children={<div>child elements here</div>}
        footer={<Button>Add item</Button>}
      />
    )

    expect(getByText("child elements here")).toBeTruthy()
    expect(getByText("Add item")).toBeTruthy()
  })
})
