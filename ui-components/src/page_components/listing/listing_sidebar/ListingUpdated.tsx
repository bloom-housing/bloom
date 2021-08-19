import * as React from "react"
import { t } from "../../../helpers/translator"
import moment from "moment"

interface ListingUpdatedProps {
  listingUpdated: Date
}

const ListingUpdated = (props: ListingUpdatedProps) => {
  const listingUpdated = props.listingUpdated
  return (
    <section className="aside-block">
      <p className="text-tiny text-gray-800">
        {`${t("listings.listingUpdated")}: ${moment(listingUpdated).format("MMMM DD, YYYY")}`}
      </p>
    </section>
  )
}

export { ListingUpdated as default, ListingUpdated }
