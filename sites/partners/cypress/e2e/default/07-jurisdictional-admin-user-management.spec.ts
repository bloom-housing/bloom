describe("Jurisdictional Admin User Mangement Tests", () => {
  beforeEach(() => {
    cy.loginApi("jurisdictionalAdmin")
    cy.visit("/")
    cy.getByTestId("Users-1").click()
  })

  afterEach(() => {
    cy.signOutApi()
  })

  it("as jurisdictional admin user, should only see partners/jurisdictional admins on the same jurisdiction", () => {
    const rolesArray = ["Partner", "Jurisdictional admin", "Jurisdictional admin - No PII"]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="userRoles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as jurisdictional admin user, should be able to create new jurisidictional admin", () => {
    cy.getByID("add-user").click()
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
            id: "userRoles",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByID("invite-user").click()
    cy.getByTestId("toast-alert").contains("Invite sent").should("have.text", "Invite sent")
  })

  it("as jurisdictional admin user, should be able to create new partner", () => {
    cy.getByID("add-user").click()
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
            id: "userRoles",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByTestId("listings_Bloomington").first().click()
    cy.getByTestId("listings_Bloomington").last().click({ force: true })
    cy.getByID("invite-user").click()
    cy.getByTestId("toast-alert").contains("Invite sent").should("have.text", "Invite sent")
  })
})
