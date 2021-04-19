describe("applications/household/member", function () {
  const route = "/applications/household/member"

  beforeEach(() => {
    cy.loadConfig()
    cy.fixture("applications/member.json").as("data")
    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should display initial form errors", function () {
    cy.getByID("save-member").click()

    cy.checkErrorAlert("be.visible")

    cy.getByID("firstName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("lastName-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("applicant.member.dateOfBirth-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("sameAddress-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("workInRegion-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("relationship-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should validate address when user check an option", function () {
    cy.getByID("sameAddressNo").check()

    cy.getByID("save-member").click()

    cy.checkErrorAlert("be.visible")

    cy.getByID("addressStreet-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressCity-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressState-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("addressZipCode-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should validate work address when user check an option", function () {
    cy.getByID("workInRegionYes").check()

    cy.getByID("save-member").click()

    cy.checkErrorAlert("be.visible")

    cy.getByID("workAddress.street-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("workAddress.city-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("workAddress.state-error").should("be.visible").and("not.to.be.empty")
    cy.getByID("workAddress.zipCode-error").should("be.visible").and("not.to.be.empty")
  })

  it("Should go back to members screen without adding current member", function () {
    cy.getByID("cancel-add").click()
    cy.location("pathname").should("include", "/applications/household/add-members")
  })

  it("should save form values and redirect to the next step", function () {
    // initial fields
    cy.getByID("firstName").type(this.data["firstName"])
    cy.getByID("middleName").type(this.data["middleName"])
    cy.getByID("lastName").type(this.data["lastName"])
    cy.getByID("birthMonth").type(this.data["birthMonth"])
    cy.getByID("birthDay").type(this.data["birthDay"])
    cy.getByID("birthYear").type(this.data["birthYear"])
    cy.getByID("relationship").select(this.data["relationship"])

    // fill address
    cy.getByID("sameAddressNo").check()

    cy.getByID("addressStreet").type(this.data["addressStreet"])
    cy.getByID("addressStreet2").type(this.data["addressStreet2"])
    cy.getByID("addressCity").type(this.data["addressCity"])
    cy.getByID("addressZipCode").type(this.data["addressZipCode"])
    cy.getByID("addressState").select(this.data["addressState"]).should("have.value", "CA")

    // fill region details
    cy.getByID("workInRegionYes").check()

    cy.getByID("workAddress.street").type(this.data["workAddress.street"])
    cy.getByID("workAddress.street2").type(this.data["workAddress.street2"])
    cy.getByID("workAddress.city").type(this.data["workAddress.city"])
    cy.getByID("workAddress.zipCode").type(this.data["workAddress.zipCode"])
    cy.getByID("workAddress.state")
      .select(this.data["workAddress.state"])
      .should("have.value", "AL")

    cy.getByID("save-member").click()

    cy.checkErrorAlert("not.exist")
    cy.checkErrorMessages("not.exist")

    cy.location("pathname").should("include", "/applications/household/add-members")

    cy.getSubmissionContext()
      .its("householdMembers")
      .should("deep.nested.include", {
        address: {
          city: this.data["addressCity"],
          state: this.data["addressState"],
          street: this.data["addressStreet"],
          street2: this.data["addressStreet2"],
          zipCode: this.data["addressZipCode"],
        },
        birthDay: this.data["birthDay"],
        birthMonth: this.data["birthMonth"],
        birthYear: this.data["birthYear"],
        emailAddress: "",
        firstName: this.data["firstName"],
        lastName: this.data["lastName"],
        middleName: this.data["middleName"],
        orderId: 0,
        phoneNumber: "",
        phoneNumberType: "",
        relationship: this.data["relationship"],
        sameAddress: "no",
        workAddress: {
          city: this.data["workAddress.city"],
          state: this.data["workAddress.state"],
          street: this.data["workAddress.street"],
          street2: this.data["workAddress.street2"],
          zipCode: this.data["workAddress.zipCode"],
        },
        workInRegion: "yes",
      })
  })
})
