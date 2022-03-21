import * as React from "react"
import { ImageCard } from "./ImageCard"
import { t } from "../helpers/translator"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { IconFillColors } from "../icons/Icon"

export default {
  title: "Blocks/Image Card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
}

export const image = () => <ImageCard imageUrl="/images/listing.jpg" />

export const withLink = () => <ImageCard href="/listings" imageUrl="/images/listing.jpg" />

export const withNoImage = () => <ImageCard href="/listings" />

export const withOneStatus = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)

export const withDescriptionAsAlt = () => (
  <ImageCard imageUrl="/images/listing.jpg" description="An image of the building" />
)

export const withOneStatusAndTag = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    tags={[{ text: "Label" }]}
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)
export const withMultipleTags = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    tags={[{ text: "Label" }, { text: "Label2" }]}
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)

export const withLongTagsAndIcons = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    tags={[
      { text: "This is a long label", iconType: "mail", iconColor: IconFillColors.white },
      { text: "This is another longer label" },
    ]}
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)

export const withManyTags = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    tags={[
      { text: "Label 1" },
      { text: "Label 2" },
      { text: "Label 3" },
      { text: "Label 4" },
      { text: "Label 5" },
      { text: "Label 6" },
      { text: "Label 7" },
      { text: "Label 8" },
    ]}
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)

export const withMultipleAppStatus = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    tags={[{ text: "Label" }]}
    statuses={[
      {
        status: ApplicationStatusType.Open,
        content: "First Come First Served",
        subContent: "Application Due Date: July 10th",
      },
      { status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") },
      {
        status: ApplicationStatusType.PostLottery,
        content: "Lottery Results Posted: September 3rd",
        hideIcon: true,
      },
    ]}
  />
)

export const withCustomIconType = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    statuses={[
      {
        status: ApplicationStatusType.Matched,
        content: "Matched",
        iconType: "check",
      },
    ]}
  />
)
