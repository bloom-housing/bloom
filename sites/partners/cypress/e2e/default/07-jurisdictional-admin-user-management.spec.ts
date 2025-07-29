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
    const rolesArray = ["Partner", "Jurisdictional Admin"]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="userRoles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as jurisdictional admin user, should be able to download export", () => {
    const convertToString = (value: number) => {
      return value < 10 ? `0${value}` : `${value}`
    }
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByID("export-users").click()
    const now = new Date()
    const dateString = `${now.getFullYear()}-${convertToString(
      now.getMonth() + 1
    )}-${convertToString(now.getDate())}`
    const csvName = `users-${dateString}_${convertToString(now.getHours())}_${convertToString(
      now.getMinutes()
    )}.csv`
    const downloadFolder = Cypress.config("downloadsFolder")
    const completeZipPath = `${downloadFolder}/${csvName}`
    cy.readFile(completeZipPath)
  })
})
