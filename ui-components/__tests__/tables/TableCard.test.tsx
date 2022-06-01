import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import { TableCard } from "../../src/tables/TableCard"

afterEach(cleanup)

describe("<TableCard>", () => {
  it("renders empty state", () => {
    const { getByText } = render(
      <TableCard title="Table Card Title" elementsQty={0} onAddClick={() => console.log("click")} />
    )

    expect(getByText("Table Card Title")).toBeTruthy()
    expect(getByText("Add items to edit")).toBeTruthy()
  })

  it("renders table content", () => {
    const { getByText } = render(
      <TableCard
        title="Table Card Title"
        elementsQty={1}
        children={<div>child elements here</div>}
        onAddClick={() => console.log("click")}
      />
    )

    expect(getByText("child elements here")).toBeTruthy()
  })

  it("fires button click", () => {
    const handleClick = jest.fn()

    const { getByTestId } = render(
      <TableCard
        title="Table Card Title"
        elementsQty={1}
        children={<div>child elements here</div>}
        onAddClick={handleClick}
      />
    )

    const addBtn = getByTestId("table-card-btn-add")
    expect(addBtn).toBeTruthy()
    fireEvent.click(addBtn)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
