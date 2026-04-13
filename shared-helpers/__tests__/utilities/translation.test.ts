import { addTranslation } from "@bloom-housing/ui-components"
import { tIfExists } from "../../src/utilities/translation"

describe("tIfExists", () => {
  it("returns the translated string for a key that exists in core", () => {
    expect(tIfExists("account.accountSettings")).toBe("Account settings")
  })

  it("returns null for a key that does not exist in the catalog", () => {
    expect(tIfExists("fork.keyThatDoesNotExist")).toBeNull()
  })

  it("returns the translated string after a fork adds a key via addTranslation", () => {
    addTranslation({ "fork.onlyInFork": "Fork-only content" })
    expect(tIfExists("fork.onlyInFork")).toBe("Fork-only content")
  })

  it("returns null for a key explicitly set to an empty string", () => {
    addTranslation({ "fork.emptyString": "" })
    expect(tIfExists("fork.emptyString")).toBeNull()
  })

  it("passes options through to t() for interpolation", () => {
    addTranslation({ "fork.greeting": "Hello, %{name}!" })
    expect(tIfExists("fork.greeting", { name: "World" })).toBe("Hello, World!")
  })
})
