describe("Application Management Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("Application grid should display correct number of results", () => {
    cy.visit("/")
    cy.get(`[row-id="1"]`).find(`[col-id="status"]`).contains("Open").click()
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
