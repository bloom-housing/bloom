import * as React from "react"
import { t } from "../../../helpers/translator"
import { Listing } from "@bloom-housing/backend-core/types"
import moment from "moment"

interface ListingUpdatedProps {
  listing: Listing
}

const ListingUpdated = (props: ListingUpdatedProps) => {
  const listing = props.listing
  return (
    <section className="aside-block">
      <p className="text-tiny text-gray-800">
        {t("listings.listingUpdated")}
        {": "}
        {moment(listing.updatedAt).format("MMMM DD, YYYY")}
      </p>
    </section>
  )
}

export { ListingUpdated as default, ListingUpdated }
