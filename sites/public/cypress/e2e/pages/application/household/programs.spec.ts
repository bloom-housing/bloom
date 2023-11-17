describe("applications/programs/programs", function () {
  const route = "/applications/programs/programs"

  beforeEach(() => {
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })
})
/* describe("applications/household/programs", function () {
  const route = "/applications/household/programs"

  const servedInMilitaryYesId = "servedInMilitary"
  const tayNoId = "doNotConsider"

  beforeEach(() => {
    cy.fixture("listing.json")
      .as("listing")
      .then((listing) => {
        const programs = listing.listingPrograms

        cy.loadConfig(
          {
            listingPrograms: programs,
          },
          "applicationConfigFilled.json"
        )
      })

    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    // not sure why this needs to be here twice to work -JW
    cy.goNext()
    cy.goNext()

    cy.checkErrorAlert("be.visible")
  })

  it("Should save values", function () {
    cy.getByID(servedInMilitaryYesId).check()
    cy.goNext()
    cy.getByID(tayNoId).check()
    cy.goNext()

    // test first preference submission
    cy.getSubmissionContext()
      .its("programs")
      .should(
        "deep.nested.include",
        {
          key: "servedInMilitary",
          claimed: true,
          options: [
            { key: "servedInMilitary", checked: true, extraData: [] },
            { key: "doNotConsider", checked: false, extraData: [] },
          ],
        },
        {
          key: "tay",
          claimed: true,
          options: [
            { key: "tay", checked: false, extraData: [] },
            { key: "doNotConsider", checked: true, extraData: [] },
          ],
        }
      )
  })
})*/
