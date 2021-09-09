/**
 * Formats the input string as a URL slug.
 * This includes the following transformations:
 * - All lowercase
 * - Remove special characters
 * - snake_case
 * @param input
 */
import { Listing } from "../listings/entities/listing.entity"

export const formatUrlSlug = (input: string): string => {
  return (
    (
      (input || "")
        // Divide into words based on upper case letters followed by lower case letters
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]+|[0-9]+/g) || []
    )
      .join("_")
      .toLowerCase()
  )
}

export const listingUrlSlug = (listing: Listing): string => {
  const { name } = listing

  const { city, street, state } = listing?.property?.buildingAddress
  return formatUrlSlug([name, street, city, state].join(" "))
}
