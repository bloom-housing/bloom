import React, { useState } from "react"
import { Listing } from "@bloom-housing/core/src/listings"
import ListingsList from "./ListingsList"
import Button from "../../atoms/Button"

export interface ListingsGroupProps {
  listings: Listing[]
  unitSummariesTable?: any
  header: string
  info?: string
  showButtonText: string
  hideButtonText: string
}

const ListingsGroup = (props: ListingsGroupProps) => {
  const [showListings, setShowListings] = useState(false)
  const toggleListings = () => setShowListings(!showListings)

  let listingsSection, buttonText
  if (showListings) {
    listingsSection = (
      <ListingsList listings={props.listings} unitSummariesTable={props.unitSummariesTable} />
    )
  }
  const listingsCount = ` (${props.listings.length})`
  if (showListings) {
    buttonText = props.hideButtonText + listingsCount
  } else {
    buttonText = props.showButtonText + listingsCount
  }

  return (
    <div className="border-b-2 border-gray-400 mb-5">
      <div className="flex flex-row flex-wrap max-w-5xl m-auto mt-5 mb-8 p-3">
        <div className="w-full hidden md:w-1/12 md:flex items-center"></div>
        <div className="w-full md:w-7/12 flex items-center">
          <div className="border-0 md:border-l-4 border-gray-600">
            <h3 className="px-4 uppercase font-alt-sans font-semibold my-2">{props.header}</h3>
            <div className="px-4 my-2">{props.info}</div>
          </div>
        </div>
        <div className="w-full md:w-4/12 flex items-center">
          <Button className="w-full" onClick={() => toggleListings()}>
            {buttonText}
          </Button>
        </div>
      </div>
      {listingsSection}
    </div>
  )
}

export default ListingsGroup
