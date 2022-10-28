describe("Admin User Mangement Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("as admin user, should show all users regadless of jurisdiction", () => {
    cy.visit("/")
    cy.getByTestId("Users").click()
    const rolesArray = ["Partner", "Administrator", "Jurisdictional Admin"]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="roles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as admin user, should be able to create new admin", () => {
    cy.visit("/")
    cy.getByTestId("Users").click()
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
  })

  it("as admin user, should be able to create new jurisidictional admin", () => {
    cy.visit("/")
    cy.getByTestId("Users").click()
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
  })

  it("as admin user, should be able to create new partner", () => {
    cy.visit("/")
    cy.getByTestId("Users").click()
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
  })
})
