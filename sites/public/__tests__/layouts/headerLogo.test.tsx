import { render } from "@testing-library/react"
import { BrandDTO } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { headerLogo } from "../../src/layouts/application"

const brandWith = (logoUrl?: string) => ({ logoUrl } as unknown as BrandDTO)

describe("headerLogo", () => {
  it("renders the stored logo when the jurisdiction has one", () => {
    const { container } = render(headerLogo(brandWith("https://example.test/logo.png")))

    const image = container.querySelector("img")
    expect(image).toHaveAttribute("src", "https://example.test/logo.png")
    expect(image).toHaveAttribute("alt", "")
  })

  it("falls back to the in-repo icon when there is no brand", () => {
    const { container } = render(headerLogo(null))

    expect(container.querySelector("img")).toBeNull()
    expect(container.querySelector("svg")).toBeInTheDocument()
  })

  it("falls back to the in-repo icon when the brand has no logo", () => {
    const { container } = render(headerLogo(brandWith()))

    expect(container.querySelector("img")).toBeNull()
  })
})
