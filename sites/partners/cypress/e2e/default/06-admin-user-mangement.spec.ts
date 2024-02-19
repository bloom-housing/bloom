describe("Admin User Mangement Tests", () => {
  beforeEach(() => {
    cy.login()
  })

  afterEach(() => {
    cy.signOut()
  })

  it("as admin user, should show all users regardless of jurisdiction", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = ["Partner", "Administrator", "Jurisdictional Admin"]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="userRoles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as admin user, should be able to download export", () => {
    cy.intercept("GET", "api/adapter/user/csv", {
      success: true,
    })
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("export-users").click()
    cy.getByTestId("alert-box").contains(
      "An email containing the exported file has been sent to admin@example.com"
    )
  })

  it("as admin user, should be able to create new admin", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("add-user").click()
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
            id: "userRoles",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByID("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
  })

  it("as admin user, should be able to create new jurisidictional admin", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("add-user").click()
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
            id: "userRoles",
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
    cy.getByID("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
  })

  it("as admin user, should be able to create new partner", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("add-user").click()
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
            id: "userRoles",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByTestId("jurisdictions").first().click()
    cy.getByTestId("listings_Alameda").first().click()
    cy.getByTestId("listings_Alameda").last().click()
    cy.getByID("invite-user").click()
    cy.getByTestId("alert-box").contains("Invite sent").should("have.text", "Invite sent")
  })
})
