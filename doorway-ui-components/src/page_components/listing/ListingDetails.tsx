import * as React from "react"
import {
  ResponsiveContentList,
  ResponsiveContentItem,
  ResponsiveContentItemHeader,
  ResponsiveContentItemBody,
} from "../../sections/ResponsiveContentList"
import { ListingDetailHeader, ListingDetailHeaderProps } from "./ListingDetailHeader"
import "./ListingDetails.scss"

export const ListingDetails = (props: any) => (
  <div className="details">
    <ResponsiveContentList>{props.children}</ResponsiveContentList>
  </div>
)

export const ListingDetailItem = (props: ListingDetailHeaderProps) => (
  <ResponsiveContentItem desktopClass={props.desktopClass}>
    <ResponsiveContentItemHeader>
      <ListingDetailHeader
        title={props.title}
        subtitle={props.subtitle}
        imageSrc={props.imageSrc}
        imageAlt={props.imageAlt}
        hideHeader={props.hideHeader}
      />
    </ResponsiveContentItemHeader>
    <ResponsiveContentItemBody>{props.children}</ResponsiveContentItemBody>
  </ResponsiveContentItem>
)
