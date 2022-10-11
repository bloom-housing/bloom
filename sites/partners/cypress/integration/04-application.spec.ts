describe("Application Management Tests", () => {
  beforeEach(() => {
    cy.login()
  })

  afterEach(() => {
    cy.signOut()
  })

  it("Application grid should display correct number of results", () => {
    cy.visit("/")
    cy.getByTestId("listing-status-cell").eq(1).click()
    cy.getByID("lbTotalPages").contains("24")
    cy.get(".applications-table")
      .first()
      .find(".ag-center-cols-container")
      .first()
      .find(".ag-row")
      .should((elems) => {
        expect(elems).to.have.length(8)
      })
  })
})
