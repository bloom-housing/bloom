import t from "@bloom/ui-components/src/helpers/translator"
import { Listing } from "@bloom/ui-components/src/types"

const getOccupancyDescription = (listing: Listing) => {
  const unitsSummarized = listing.unitsSummarized
  if (unitsSummarized.unitTypes.includes("SRO")) {
    return unitsSummarized.grouped.length == 1
      ? t("listings.occupancy_description_all_sro")
      : t("listings.occupancy_description_some_sro")
  } else {
    return t("listings.occupancy_description_no_sro")
  }
}

export default getOccupancyDescription
