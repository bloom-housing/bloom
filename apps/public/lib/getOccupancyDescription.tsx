import t from "@bloom/ui-components/src/helpers/translator"
import { Listing } from "@bloom/ui-components/src/types"

const getOccupancyDescription = (listing: Listing) => {
  const unitTypes = listing.unit_summaries.general.map((item: any) => {
    item.unit_type
  })

  const onlySRO = unitTypes.length == 1 && unitTypes[0] == "SRO"
  const hasSomeSRO = unitTypes.length > 1 && unitTypes.includes("SRO")

  if (onlySRO) {
    return t("listings.occupancy_description_all_sro")
  } else if (hasSomeSRO) {
    return t("listings.occupancy_description_some_sro")
  } else {
    return t("listings.occupancy_description_no_sro")
  }
}

export default getOccupancyDescription
