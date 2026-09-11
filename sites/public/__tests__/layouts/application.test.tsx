import React from "react"
import { BrandDTO } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { render, mockNextRouter } from "../testUtils"
import Layout from "../../src/layouts/application"
import { BrandContext } from "../../src/lib/BrandContext"

const renderLayout = (brand: BrandDTO | null) =>
  render(
    <BrandContext.Provider value={brand}>
      <Layout>
        <div>page</div>
      </Layout>
    </BrandContext.Provider>
  )

describe("<Layout>", () => {
  beforeEach(() => {
    mockNextRouter()
    process.env.showNewSeedsDesigns = "TRUE"
  })

  afterAll(() => delete process.env.showNewSeedsDesigns)

  it("puts the stored logo in the header", () => {
    const { container } = renderLayout({
      logoUrl: "https://example.test/logo.png",
    } as unknown as BrandDTO)

    expect(container.querySelector("header img")).toHaveAttribute(
      "src",
      "https://example.test/logo.png"
    )
  })

  it("keeps the in-repo icon when the jurisdiction has no brand", () => {
    const { container } = renderLayout(null)

    expect(container.querySelector("header img")).toBeNull()
    expect(container.querySelector("header svg")).toBeInTheDocument()
  })
})
