import { Listing } from "@bloom-housing/backend-core/types"

// This contains client metadata about the Listing object.
// For example, which API it was fetched from.
export interface ListingWithSourceMetadata extends Listing {
  /**  */
  isBloomListing?: boolean
}
