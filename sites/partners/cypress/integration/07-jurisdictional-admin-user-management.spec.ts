describe("Admin User Mangement Tests", () => {
  before(() => {
    cy.login("jurisdictionalAdmin")
  })

  after(() => {
    cy.signOut()
  })

  it("as jurisdictional admin user, should only see partners/jurisdictional admins on the same jurisdiction", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = ["Partner", "Partner", "Jurisdictional Admin"]
    cy.get(`.ag-center-cols-container [row-id="0"] [col-id="roles"]`)
      .contains(rolesArray[0])
      .should("have.text", rolesArray[0])
    cy.get(`.ag-center-cols-container [row-id="1"] [col-id="roles"]`)
      .contains(rolesArray[1])
      .should("have.text", rolesArray[1])
    cy.get(`.ag-center-cols-container [row-id="2"] [col-id="roles"]`)
      .contains(rolesArray[2])
      .should("have.text", rolesArray[2])
  })

  it("as jurisdictional admin user, should be able to create new jurisidictional admin", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByTestId("add-user").click()
    cy.fixture("createJurisdictionalAdminUser2").then((obj) => {
      cy.fillFields(
        obj,
        [
          {
            id: "firstName",
            fieldKey: "firstName",
          },
          {
            id: "lastName",
            fieldKey: "lastName",
          },
          {
            id: "email",
            fieldKey: "email",
          },
        ],
        [
          {
            id: "role",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByTestId("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
  })

  it("as jurisdictional admin user, should be able to create new partner", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByTestId("add-user").click()
    cy.fixture("createPartnerUser2").then((obj) => {
      cy.fillFields(
        obj,
        [
          {
            id: "firstName",
            fieldKey: "firstName",
          },
          {
            id: "lastName",
            fieldKey: "lastName",
          },
          {
            id: "email",
            fieldKey: "email",
          },
        ],
        [
          {
            id: "role",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByTestId("listings_Alameda").first().click()
    cy.getByTestId("listings_Alameda").last().click()
    cy.getByTestId("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
  })
})
