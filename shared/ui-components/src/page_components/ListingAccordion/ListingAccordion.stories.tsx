import * as React from "react"
import { storiesOf } from "@storybook/react"
import ListingAccordion from "./ListingAccordion"

storiesOf("Listing|ListingAccordion", module).add("with content", () => {
  const listing = {
    id: 1,
    name: "Test Listing",
    image_url: "/images/listing.jpg",
    building_street_address: "123 Test St",
    building_city: "Bayville",
    building_state: "CA",
    building_zip_code: "94015",
    neighborhood: "Downtown",
    year_built: 2000,
    required_documents: "There will be required documents",
    smoking_policy: "No smoking",
    pet_policy: "Pets allowed, with restrictions",
    amenities: "Property amenities include gym and garden",
    developer: "Test Developer",
    credit_history: "Applicants must have good credit history",
    rental_history: "Applicants must have good rental history"
  }

  return <ListingAccordion listing={listing} />
})
