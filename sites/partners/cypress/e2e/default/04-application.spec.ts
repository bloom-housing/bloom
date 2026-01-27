describe("Application Management Tests", () => {
  beforeEach(() => {
    cy.loginApi()
    cy.visit("/")
    cy.getByID("listing-status-cell-Hollywood Hills Heights").click()
  })

  afterEach(() => {
    cy.signOutApi()
  })

  it("Application grid should display correct number of results", () => {
    cy.getByID("lbTotalPages").contains("2")
    cy.get(".applications-table")
      .first()
      .find(".ag-center-cols-container")
      .first()
      .find(".ag-row")
      .should((elems) => {
        expect(elems).to.have.length(2)
      })
  })

  it("Can download applications csv", () => {
    const convertToString = (value: number) => {
      return value < 10 ? `0${value}` : `${value}`
    }
    // intercept api request to extract the listing id for filename
    cy.intercept("/api/adapter/applications/csv?id=*").as("getCsvId")
    const now = new Date()
    cy.get("button").contains("export", { matchCase: false }).click()
    cy.getByID("seeds-toast-stack").should("have.text", "File exported successfully")

    cy.wait("@getCsvId").then((interception) => {
      const url = interception.request.url
      const urlParams = new URLSearchParams(url.split("?")[1])
      const listingId = urlParams.get("id")

      const dateString = `${now.getFullYear()}-${convertToString(
        now.getMonth() + 1
      )}-${convertToString(now.getDate())}`

      // file name format: applications-{listingId}-YYYY-MM-DD_HH-mm.zip
      const csvName = `applications-${listingId}-${dateString}_${convertToString(
        now.getHours()
      )}-${convertToString(now.getMinutes())}.zip`
      const downloadFolder = Cypress.config("downloadsFolder")
      const completeZipPath = `${downloadFolder}/${csvName}`
      cy.readFile(completeZipPath).should("exist")
    })
  })
})
