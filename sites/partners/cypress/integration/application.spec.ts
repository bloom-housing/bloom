describe("Application Management Tests", () => {
  before(() => {
    cy.login()
  })

  it("Application grid should display correct number of results", () => {
    cy.visit("/")
    cy.get(`[col-id="status"]`).eq(1).contains("Accepting Applications").click()
    cy.getByID("lbTotalPages").contains("20")
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
