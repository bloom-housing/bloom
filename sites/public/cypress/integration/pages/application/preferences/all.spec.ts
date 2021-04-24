describe("applications/preferences/all", function () {
  const route = "/applications/preferences/all"

  beforeEach(() => {
    cy.fixture("applications/preferencesAll.json").as("data")

    // override listing preferences with fixture data
    cy.fixture("listing.json")
      .as("listing")
      .then((listing) => {
        const preferences = listing.preferences

        cy.loadConfig(
          {
            preferences,
          },
          "applicationConfigFilled.json"
        )
      })

    cy.visit(route)
  })

  it("Should render form", function () {
    cy.get("form").should("be.visible")
    cy.location("pathname").should("include", route)
  })

  it("Should show error alert when there are no preferences selected", function () {
    cy.goNext()

    cy.checkErrorAlert("be.visible")
  })

  it("Should show error alert when address preference is selected and fields are empty", function () {
    cy.getByID("application.preferences.liveWork.live.claimed").check()

    cy.getByID("application.preferences.displacedTenant.general.claimed").check()

    cy.goNext()

    cy.checkErrorAlert("be.visible")
  })

  it("Should save values and redirect to the next step (claimed for at least one preference)", function () {
    cy.getByID("application.preferences.liveWork.live.claimed").check()
    cy.getByID("application.preferences.liveWork.work.claimed").check()
    cy.getByID("application.preferences.displacedTenant-none").check()

    cy.goNext()
    cy.checkErrorAlert("not.exist")

    // should skip one step
    cy.isNextRouteValid("preferencesAll", 1)
  })

  it("Should save values and redirect to the general pool (not claimed for any preference)", function () {
    cy.getByID("application.preferences.liveWork-none").check()
    cy.getByID("application.preferences.displacedTenant-none").check()

    cy.goNext()
    cy.checkErrorAlert("not.exist")

    cy.isNextRouteValid("preferencesAll")
  })

  it("Should save values", function () {
    cy.getByID("application.preferences.liveWork.live.claimed").check()
    cy.getByID("application.preferences.liveWork.work.claimed").check()

    // fill Displaced Tenant preference
    cy.getByID("application.preferences.displacedTenant.general.claimed").check()
    cy.getByID("application.preferences.displacedTenant.general.name").select(this.data["claimant"])
    cy.getByID("application.preferences.displacedTenant.general.address.street").type(
      this.data.address["street"]
    )
    cy.getByID("application.preferences.displacedTenant.general.address.street2").type(
      this.data.address["street2"]
    )
    cy.getByID("application.preferences.displacedTenant.general.address.city").type(
      this.data.address["city"]
    )
    cy.getByID("application.preferences.displacedTenant.general.address.state").select(
      this.data.address["state"]
    )
    cy.getByID("application.preferences.displacedTenant.general.address.zipCode").type(
      this.data.address["zipCode"]
    )

    // fill Mission Corridor
    cy.getByID("application.preferences.displacedTenant.missionCorridor.claimed").check()
    cy.getByID("application.preferences.displacedTenant.missionCorridor.name").select(
      this.data["claimant"]
    )
    cy.getByID("application.preferences.displacedTenant.missionCorridor.address.street").type(
      this.data.address["street"]
    )
    cy.getByID("application.preferences.displacedTenant.missionCorridor.address.street2").type(
      this.data.address["street2"]
    )
    cy.getByID("application.preferences.displacedTenant.missionCorridor.address.city").type(
      this.data.address["city"]
    )
    cy.getByID("application.preferences.displacedTenant.missionCorridor.address.state").select(
      this.data.address["state"]
    )
    cy.getByID("application.preferences.displacedTenant.missionCorridor.address.zipCode").type(
      this.data.address["zipCode"]
    )

    cy.goNext()

    // skip general lottery info (preferences all selected)
    cy.isNextRouteValid("preferencesAll", 1)

    // test first preference submission
    cy.getSubmissionContext()
      .its("preferences")
      .should("deep.nested.include", {
        claimed: true,
        key: "liveWork",
        options: [
          {
            key: "live",
            checked: true,
          },
          {
            key: "work",
            checked: true,
          },
        ],
      })

    // test second preference submission
    // cy.getSubmissionContext()
    //   .its("preferences")
    //   .should("deep.nested.include", {
    //     claimed: true,
    //     key: "displacedTenant",
    //     options: [
    //       {
    //         checked: true,
    //         extraData: [
    //           {
    //             key: "name",
    //             type: "text",
    //             value: this.data["claimant"],
    //           },
    //           {
    //             key: "address",
    //             type: "address",
    //             value: {
    //               city: this.data.address["city"],
    //               state: this.data.address["state"],
    //               street: this.data.address["street"],
    //               street2: this.data.address["street2"],
    //               zipCode: this.data.address["zipCode"],
    //             },
    //           },
    //         ],
    //         key: "general",
    //       },
    //     ],
    //   })
  })
})
