import React from "react"
import { ListingStatus } from "@bloom-housing/backend-core/types"
import { getListingStatusTag } from "./helpers"

export interface ListingStatusBarProps {
  className?: string
  status: ListingStatus
}

const ListingStatusBar = ({ className, status }: ListingStatusBarProps) => {
  return (
    <section className={`border-t bg-white flex-none ${className ?? ""}`}>
      <div className="flex flex-row w-full mx-auto max-w-screen-xl justify-end px-5 items-center my-3">
        <div className="status-bar__status md:pl-6 md:w-3/12">{getListingStatusTag(status)}</div>
      </div>
    </section>
  )
}

export { ListingStatusBar as default, ListingStatusBar }
