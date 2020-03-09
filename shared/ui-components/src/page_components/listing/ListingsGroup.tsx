import React, { useState } from "react"
import { Listing } from "@bloom-housing/core"
import ListingsList from "./ListingsList"
import Button from "../../atoms/Button"
import Icon from "../../atoms/Icon"

export interface ListingsGroupProps {
  listings: Listing[]
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
    listingsSection = <ListingsList listings={props.listings} />
  }
  const listingsCount = ` (${props.listings.length})`
  if (showListings) {
    buttonText = props.hideButtonText + listingsCount
  } else {
    buttonText = props.showButtonText + listingsCount
  }

  return (
    <div className="border-t border-gray-450 mb-5">
      <div className="flex flex-row flex-wrap max-w-5xl m-auto mt-6 mb-8 p-3">
        <div className="hidden md:inline-block pt-2 pr-5">
          <Icon size="xlarge" symbol="clock" />
        </div>
        <div className="w-full md:w-7/12 flex items-center mb-4 md:mb-0">
          <div className="border-b-4 md:border-b-0 md:border-l-4 border-gray-600">
            <h2 className="md:px-4 uppercase font-alt-sans font-black my-1 tracking-wider">
              {props.header}
            </h2>
            {props.info && <div className="px-4 my-2">{props.info}</div>}
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
