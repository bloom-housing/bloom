describe("Admin User Mangement Tests", () => {
  beforeEach(() => {
    cy.loginApi()
  })

  afterEach(() => {
    cy.signOutApi()
  })

  it("as admin user, should show all users regardless of jurisdiction", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = [
      "Partner",
      "Administrator",
      "Jurisdictional admin",
      "Limited Jurisdictional admin",
      "Admin \\(support\\)",
    ]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="userRoles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as admin user, should be able to download export", () => {
    const convertToString = (value: number) => {
      return value < 10 ? `0${value}` : `${value}`
    }
    const fixed = new Date(2026, 2, 10, 22, 7, 0)
    cy.clock(fixed.getTime())

    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("export-users").click()
    const dateString = `${fixed.getFullYear()}-${convertToString(
      fixed.getMonth() + 1
    )}-${convertToString(fixed.getDate())}`
    const csvName = `users-${dateString}_${convertToString(fixed.getHours())}_${convertToString(
      fixed.getMinutes()
    )}.csv`
    const downloadFolder = Cypress.config("downloadsFolder")
    const completeZipPath = `${downloadFolder}/${csvName}`
    cy.readFile(completeZipPath).should("exist")
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
            id: "userRoles",
            fieldKey: "role",
          },
        ],
        [],
        []
      )
    })
    cy.getByTestId("jurisdictions").eq(1).click()
    cy.getByTestId("listings_Bloomington").first().click({ force: true })
    cy.getByTestId("listings_Bloomington").last().click({ force: true })
    cy.getByID("invite-user").click()
    cy.getByTestId("toast-alert").contains("Invite sent").should("have.text", "Invite sent")
  })
})
