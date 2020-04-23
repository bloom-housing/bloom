import React, { useState } from "react"
import { Listing } from "@bloom-housing/core"
import ListingsList from "./ListingsList"
import Button from "../../atoms/Button"
import Icon from "../../atoms/Icon"
import "./ListingsGroup.scss"

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
    <div className="listings-group">
      <div className="listings-group__header">
        <div className="listings-group__icon">
          <Icon size="xlarge" symbol="clock" />
        </div>
        <div className="listings-group__header-group">
          <h2 className="listings-group__title">{props.header}</h2>
          {props.info && <div className="px-4 my-2">{props.info}</div>}
        </div>
        <div className="listings-group__button">
          <Button className="w-full" onClick={() => toggleListings()}>
            {buttonText}
          </Button>
        </div>
      </div>
      {listingsSection}
    </div>
  )
}

export { ListingsGroup as default, ListingsGroup }
