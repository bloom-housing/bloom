import t from "@bloom/ui-components/src/helpers/translator"
import { Listing } from "@bloom/core/src/listings"

const getOccupancyDescription = (listing: Listing) => {
  const unitsSummarized = listing.unitsSummarized
  if (unitsSummarized.unitTypes.includes("SRO")) {
    return unitsSummarized.grouped.length == 1
      ? t("listings.occupancyDescriptionAllSro")
      : t("listings.occupancyDescriptionSomeSro")
  } else {
    return t("listings.occupancyDescriptionNoSro")
  }
}

export default getOccupancyDescription
