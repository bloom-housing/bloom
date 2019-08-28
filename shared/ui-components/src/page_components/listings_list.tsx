import * as React from "react"
import { Listing } from "../types"
import ImageCard from "../cards/image_card"
import Link from "next/link"

export interface ListingsProps {
  listings: Listing[]
}

const buttonClasses = [
  "border",
  "border-primary",
  "px-8",
  "py-4",
  "text-lg",
  "uppercase",
  "t-alt-sans",
  "inline-block"
]

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
          <Link href="listing/[id]" as={`/listing/${listing.id}`}>
            <a className={buttonClasses.join(" ")}>See Details</a>
          </Link>
        </div>
      </article>
    )
  })

  return <>{listItems}</>
}
