import React, { useState } from "react"
import { Button } from "../../actions/Button"
import { Icon, UniversalIconType } from "../../icons/Icon"
import "./ListingsGroup.scss"

export interface ListingsGroupProps {
  children?: React.ReactNode
  header: string
  hideButtonText: string
  icon?: UniversalIconType
  info?: string
  listingsCount: number
  showButtonText: string
}

const ListingsGroup = (props: ListingsGroupProps) => {
  const [showListings, setShowListings] = useState(false)
  const toggleListings = () => setShowListings(!showListings)

  const listingsCount = ` (${props.listingsCount})`

  return (
    <div className="listings-group">
      <div className="listings-group__header">
        <div className={"listings-group__content"}>
          <div className="listings-group__icon">
            <Icon size="xlarge" symbol={props.icon ?? `clock`} />
          </div>
          <div className="listings-group__header-group">
            <h2 className="listings-group__title">{props.header}</h2>
            {props.info && <div className="listings-group__info">{props.info}</div>}
          </div>
        </div>
        <div className="listings-group__button">
          <Button className="w-full" onClick={() => toggleListings()}>
            {showListings
              ? props.hideButtonText + listingsCount
              : props.showButtonText + listingsCount}
          </Button>
        </div>
      </div>
      {showListings && props.children}
    </div>
  )
}

export { ListingsGroup as default, ListingsGroup }
