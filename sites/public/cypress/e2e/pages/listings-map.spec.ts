// When testing this locally, ensure your screen size compares to Cypress's screen size as it will affect the way the map creates clusters
describe.skip("Listings map", function () {
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
    cy.getByTestId("map-cluster").should("have.length", 17)

    cy.getByTestId("loading-overlay").should("not.exist")
    // Fetch markers + listings once on page load
    cy.get("@markersSearch.all").should("have.length", 1)
    cy.get("@listingsSearch.all").should("have.length", 1)

    // Click into one cluster
    cy.get('[aria-label="4 listings in this cluster"]').contains("4").click({ force: true })
    cy.getByTestId("map-total-results").contains("Total results 11")
    cy.getByTestId("map-pagination").contains("Page 1 of 1")

    cy.getByTestId("loading-overlay").should("not.exist")
    // Not filtering, just panning - only fetch listings
    cy.get("@markersSearch.all").should("have.length", 1)
    cy.get("@listingsSearch.all").should("have.length", 2)

    // Click into another cluster
    cy.get('[aria-label="4 listings in this cluster"]').contains("4").click({ force: true })
    cy.getByTestId("map-total-results").contains("Total results 5")
    cy.getByTestId("map-pagination").contains("Page 1 of 1")

    cy.getByTestId("loading-overlay").should("not.exist")
    // Not filtering, just panning - only fetch listings
    cy.get("@markersSearch.all").should("have.length", 1)
    cy.get("@listingsSearch.all").should("have.length", 3)

    // Filter out all visible listings
    cy.getByID("listings-map-filter-button").contains("Filters 0").click()
    cy.getByID("county-item-Sonoma").click()
    cy.getByID("listings-map-filter-dialog-show-button").click()
    cy.getByTestId("map-total-results").contains("Total results 0")
    cy.contains("No matching listings")

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

    cy.getByTestId("loading-overlay").should("not.exist")
    // Opening window - fetch neither
    cy.get("@markersSearch.all").should("have.length", 3)
    cy.get("@listingsSearch.all").should("have.length", 4)

    // Click manually into empty space
    cy.getByTestId("map").dblclick(300, 20)
    cy.getByTestId("listings-map-info-window").should("not.exist")
    cy.getByTestId("map-total-results").contains("Total results 3")
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.get("@listingsSearch.all").should("have.length", 5)

    cy.getByTestId("map").dblclick(100, 20)
    cy.getByTestId("map-total-results").contains("Total results 1")
    cy.getByTestId("loading-overlay").should("not.exist")

    cy.get("@markersSearch.all").should("have.length", 3)
    cy.get("@listingsSearch.all").should("have.length", 6)

    // Zoom out with buttons
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-zoom-out").click()
    cy.getByTestId("loading-overlay").should("not.exist")
    cy.getByTestId("map-total-results").contains("Total results 45")
    cy.getByTestId("map-pagination").contains("Page 1 of 2")
    cy.get("@listingsSearch.all").should("have.length", 7)
  })
})
