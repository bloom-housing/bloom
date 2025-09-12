describe("Navigation elements", function () {
  it("updates nav links based on translation", () => {
    cy.visit("/")
    cy.get("button").contains("Español").click()
    cy.url().should("include", "/es")
    // TODO - get all a tags and exclude the external ones
    cy.get('nav')
    .find('a')
    .should('have.length.greaterThan', 0)
    .each(($a) => {
        expect($a.attr('href')).to.contain('es')
        cy.log(`${$a.text()}: ${$a.attr('href')}`)
    })
  });

  it("renders each page in the selected language", function () {
    cy.visit("/")
    cy.get("button").contains("Español").click()
    cy.url().should("include", "/es")
    cy.document()
    .then((doc) => {
        expect(doc.documentElement.lang).to.eq("es")
    })
    // TODO - navigate through site to verify click navigation keeps language selection
  })
})
