import * as React from "react"
import { Listing } from "../types"
import ImageCard from "../cards/image_card"
import Button from "../atoms/Button"

export interface ListingsProps {
  listings: Listing[]
}

export const ListingsList = (props: ListingsProps) => {
  const listings = props.listings

  const listItems = listings.map(listing => {
    const imageUrl = listing.image_url || ""

    return (
      <article key={listing.id} className="flex flex-row flex-wrap max-w-5xl m-auto mb-12">
        <div className="w-full md:w-6/12 p-3">
          <ImageCard
            title={listing.name}
            imageUrl={imageUrl}
            href={`listing/id=${listing.id}`}
            as={`/listing/${listing.id}`}
          />
        </div>
        <div className="w-full md:w-6/12 p-3">
          <Button href="listing/[id]" as={`/listing/${listing.id}`}>
            See Details
          </Button>
        </div>
      </article>
    )
  })

  return <>{listItems}</>
}
