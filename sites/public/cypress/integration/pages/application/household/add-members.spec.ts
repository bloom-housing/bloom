describe("applications/household/add-members", function () {
  const route = "/applications/household/add-members"

  it("Should render form", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 0,
      },
    })
    cy.visit(route)

    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should move to /contact/name after Edit click", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 0,
      },
    })
    cy.visit(route)

    cy.getByID("edit-member").click()
    cy.location("pathname").should("include", "applications/contact/name")
  })

  it("Should move to /household/member Add member click", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 0,
      },
    })
    cy.visit(route)

    cy.getByID("btn-add-member").click()
    cy.location("pathname").should("include", "applications/household/member")
  })

  it("Should show an error when min. household size is > 1 and defined less", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 2,
      },
    })
    cy.visit(route)

    cy.getByID("btn-add-done").click()

    cy.get(".alert-notice").should("be.visible").and("contain", "small")
  })

  it("Should show an error if max. household size is 1 and defined more", function () {
    cy.loadConfig(
      {
        property: {
          householdSizeMax: 1,
          householdSizeMin: 0,
        },
      },
      "applicationConfigFilled.json"
    )
    cy.visit(route)

    cy.getByID("btn-add-done").click()

    cy.get(".alert-notice").should("be.visible").and("contain", "too big")
  })

  it("Should move to next route Add member click", function () {
    cy.loadConfig({
      property: {
        householdSizeMax: 2,
        householdSizeMin: 0,
      },
    })
    cy.visit(route)

    cy.getByID("btn-add-done").click()
    cy.isNextRouteValid("addMembers")
  })
})
