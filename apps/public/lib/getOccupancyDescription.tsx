import t from "@bloom/ui-components/src/helpers/translator"
import { Listing } from "@bloom/ui-components/src/types"

const getOccupancyDescription = (listing: Listing) => {
  const unitSummaries = listing.unit_summaries
  if (unitSummaries.map(item => item.unit_type).includes("SRO")) {
    return unitSummaries.length == 1
      ? t("listings.occupancy_description_all_sro")
      : t("listings.occupancy_description_some_sro")
  } else {
    return t("listings.occupancy_description_no_sro")
  }
}

export default getOccupancyDescription
