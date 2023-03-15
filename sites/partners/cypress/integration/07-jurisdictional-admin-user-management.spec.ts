describe("Jurisdictional Admin User Mangement Tests", () => {
  beforeEach(() => {
    cy.loginAndAcceptTerms("jurisdictionalAdmin")
  })

  afterEach(() => {
    cy.signOut()
  })

  it("as jurisdictional admin user, should only see partners/jurisdictional admins on the same jurisdiction", () => {
    cy.visit("/")
    cy.getByTestId("Users").click()
    const rolesArray = ["Partner", "Jurisdictional Admin"]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="roles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as jurisdictional admin user, should be able to create new jurisidictional admin", () => {
    cy.visit("/")
    cy.getByTestId("Users").click()
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
    cy.getByTestId("Users").click()
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
