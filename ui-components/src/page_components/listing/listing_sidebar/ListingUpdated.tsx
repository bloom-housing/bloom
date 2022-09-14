import * as React from "react"
import { t } from "../../../helpers/translator"
import dayjs from "dayjs"

interface ListingUpdatedProps {
  listingUpdated: Date
  strings?: {
    listingUpdated?: string
  }
}

const ListingUpdated = (props: ListingUpdatedProps) => {
  const listingUpdated = props.listingUpdated
  return (
    <section className="aside-block">
      <p className="text-tiny text-gray-800">
        {props?.strings?.listingUpdated ??
          `${t("listings.listingUpdated")}: ${dayjs(listingUpdated).format("MMMM DD, YYYY")}`}
      </p>
    </section>
  )
}

export { ListingUpdated as default, ListingUpdated }
