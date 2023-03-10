describe("Admin User Mangement Tests", () => {
  before(() => {
    cy.login()
  })

  after(() => {
    cy.signOut()
  })

  it("as admin user, should show all users", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    const rolesArray = ["Partner", "Administrator"]
    cy.getByTestId("ag-page-size").select("100", { force: true })

    const regex = new RegExp(`${rolesArray.join("|")}`, "g")

    cy.get(`.ag-center-cols-container [col-id="roles"]`).each((role) => {
      cy.wrap(role).contains(regex)
    })
  })

  it("as admin user, should be able to download export", () => {
    cy.visit("/")
    cy.getByTestId("Users-1").click()
    cy.getByTestId("export-users").click()
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
})
