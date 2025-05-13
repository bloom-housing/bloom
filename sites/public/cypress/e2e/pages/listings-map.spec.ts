// When testing this locally outside of a test run, ensure your screen size compares to Cypress's screen size as it will affect the way the map creates clusters
describe("Listings map", function () {
  it("renders the listing map", function () {
    cy.viewport(1500, 800)
    cy.intercept("**/listings/mapMarkers", (req) => {
      req.headers["language"] = "en"
    }).as("markersSearch")
    cy.intercept("**/listings/combined", (req) => {
      req.headers["language"] = "en"
    }).as("listingsSearch")

    cy.get("@markersSearch.all").should("have.length", 0)
    cy.get("@listingsSearch.all").should("have.length", 0)

    cy.visit("/")
    cy.getByTestId("View Listings-1").click()
    cy.getByTestId("loading-overlay").should("not.exist")

    // Initial map load
    cy.getByTestId("map-total-results").contains("Total results 249")
    cy.getByTestId("map-pagination").contains("Page 1 of 10")
    cy.getByTestId("map-cluster").should("have.length", 11)

    cy.getByTestId("loading-overlay").should("not.exist")
    // Fetch markers + listings once on page load
    cy.get("@markersSearch.all").should("have.length", 1)
    cy.get("@listingsSearch.all").should("have.length", 1)

    // Click into one cluster
    cy.get('[aria-label="10 listings in this cluster"]').contains("10").click({ force: true })
    cy.getByTestId("map-total-results").contains("Total results 14")
    cy.getByTestId("map-pagination").contains("Page 1 of 1")

    cy.getByTestId("loading-overlay").should("not.exist")
    // Not filtering, just panning - only fetch listings
    cy.get("@markersSearch.all").should("have.length", 1)
    cy.get("@listingsSearch.all").should("have.length", 2)

    // Click into another cluster
    cy.get('[aria-label="3 listings in this cluster"]').contains("3").click({ force: true })
    cy.getByTestId("map-total-results").contains("Total results 6")
    cy.getByTestId("map-pagination").contains("Page 1 of 1")

    cy.getByTestId("loading-overlay").should("not.exist")
    // Not filtering, just panning - only fetch listings
    cy.get("@markersSearch.all").should("have.length", 1)
    cy.get("@listingsSearch.all").should("have.length", 3)

    // Filter out all visible listings
    cy.getByID("listings-map-filter-button").contains("Filters 0").click()
    cy.getByID("county-item-Contra Costa").click()
    cy.getByID("listings-map-filter-dialog-show-button").click()
    cy.getByTestId("map-total-results").contains("Total results 0")
    cy.contains("No visible listings")

    cy.getByTestId("loading-overlay").should("not.exist")
    // Filtering, but zero results - only fetch markers
    cy.get("@markersSearch.all").should("have.length", 2)

    // Clear filters
    cy.getByID("listings-map-filter-button").contains("Filters 1").click()
    cy.getByTestId("listings-map-filter-dialog-clear-button").click()
    cy.getByID("listings-map-filter-dialog-show-button").click()
    cy.getByTestId("loading-overlay").should("not.exist")

    cy.getByTestId("loading-overlay").should("not.exist")
    // Filtering with results - fetch both
    cy.get("@markersSearch.all").should("have.length", 3)
    cy.get("@listingsSearch.all").should("have.length", 4)

    // Open an info window
    cy.get('[id^="marker-id"]').first().click({ force: true })
    cy.getByTestId("listings-map-info-window").should("be.visible")
    cy.getByTestId("listings-map-info-window").within(() => {
      cy.get("a").contains("See Details")
    })

    cy.getByTestId("loading-overlay").should("not.exist")
    // Opening window - fetch neither
    cy.get("@markersSearch.all").should("have.length", 3)
    cy.get("@listingsSearch.all").should("have.length", 4)

    // Zoom out with buttons
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-total-results").contains("Total results 236")
    cy.getByTestId("map-pagination").contains("Page 1 of 10")
    cy.get("@listingsSearch.all").should("have.length", 5)

    // Paginate
    cy.getByID("pagination-2").click()
    cy.getByTestId("map-pagination").contains("Page 2 of 10")
    cy.get("@markersSearch.all").should("have.length", 3)
    cy.get("@listingsSearch.all").should("have.length", 6)

    // Recenter
    cy.getByID("map-recenter-button").click()
    cy.getByTestId("map-total-results").contains("Total results 249")
    cy.getByTestId("map-pagination").contains("Page 1 of 10")
    cy.getByTestId("map-cluster").should("have.length", 11)
    cy.get("@markersSearch.all").should("have.length", 3)
    cy.get("@listingsSearch.all").should("have.length", 7)
  })
})
