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

    cy.get(`.ag-center-cols-container [col-id="roles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as admin user, should be able to download export", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("export-users").click()
    const convertToString = (value: number) => {
      return value < 10 ? `0${value}` : `${value}`
    }
    const now = new Date()
    const month = now.getMonth() + 1
    cy.readFile(
      `cypress/downloads/users-${now.getFullYear()}-${convertToString(month)}-${convertToString(
        now.getDate()
      )}_${convertToString(now.getHours())}_${convertToString(now.getMinutes())}.csv`
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
            id: "role",
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
    cy.getByID("invite-user").click()
    cy.getByTestId("toast-alert").contains("Invite sent").should("have.text", "Invite sent")
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
            id: "role",
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
    cy.getByTestId("toast-alert").contains("Invite sent").should("have.text", "Invite sent")
  })
})
