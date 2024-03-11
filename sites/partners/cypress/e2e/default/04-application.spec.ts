describe("Application Management Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("Application grid should display correct number of results", () => {
    cy.visit("/")
    cy.getByTestId("listing-status-cell-Hollywood Hills Heights").click()
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
})
