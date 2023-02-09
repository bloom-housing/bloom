import * as React from "react"
import {
  ResponsiveContentList,
  ResponsiveContentItem,
  ResponsiveContentItemHeader,
  ResponsiveContentItemBody,
} from "@bloom-housing/ui-components"
import { ListingDetailHeader, ListingDetailHeaderProps } from "./ListingDetailHeader"

export const ListingDetails = (props: any) => (
  <div className="w-full md:pr-8 md:pt-8">
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
