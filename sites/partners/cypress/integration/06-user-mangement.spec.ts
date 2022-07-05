describe("User Mangement Tests", () => {
  it("as admin user, should show all users regadless of jurisdiction", () => {
    cy.login()
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = [
      "Partner",
      "Partner",
      "Administrator",
      "Administrator",
      "Jurisdictional Admin",
    ]
    cy.get(`.ag-center-cols-container [row-id="0"] [col-id="roles"]`)
      .contains(rolesArray[0])
      .should("have.text", rolesArray[0])
    cy.get(`.ag-center-cols-container [row-id="1"] [col-id="roles"]`)
      .contains(rolesArray[1])
      .should("have.text", rolesArray[1])
    cy.get(`.ag-center-cols-container [row-id="2"] [col-id="roles"]`)
      .contains(rolesArray[2])
      .should("have.text", rolesArray[2])
    cy.get(`.ag-center-cols-container [row-id="3"] [col-id="roles"]`)
      .contains(rolesArray[3])
      .should("have.text", rolesArray[3])
    cy.get(`.ag-center-cols-container [row-id="4"] [col-id="roles"]`)
      .contains(rolesArray[4])
      .should("have.text", rolesArray[4])
    cy.signOut()
  })

  it("as admin user, should be able to create new admin", () => {
    cy.login()
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByTestId("add-user").click()
    cy.fixture("createAdminUser").then((obj) => {
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
    cy.signOut()
  })

  it("as admin user, should be able to create new jurisidictional admin", () => {
    cy.login()
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByTestId("add-user").click()
    cy.fixture("createJurisdictionalAdminUser").then((obj) => {
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
          {
            id: "jurisdictions",
            fieldKey: "jurisdictions",
          },
        ],
        [],
        []
      )
    })
    cy.getByTestId("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
    cy.signOut()
  })

  it("as admin user, should be able to create new partner", () => {
    cy.login()
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByTestId("add-user").click()
    cy.fixture("createPartnerUser").then((obj) => {
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
    cy.getByTestId("jurisdictions").last().click()
    cy.getByTestId("listings_Alameda").first().click()
    cy.getByTestId("listings_Alameda").last().click()
    cy.getByTestId("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
    cy.signOut()
  })

  it("as jurisdictional admin user, should only see partners/jurisdictional admins on the same jurisdiction", () => {
    cy.login("jurisdictionalAdmin")
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
    cy.signOut()
  })
})
