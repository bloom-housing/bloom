import * as React from "react"
import { t } from "@bloom-housing/ui-components"
import { BADGES } from "../../.storybook/constants"
import { ImageCard } from "./ImageCard"
import { ApplicationStatusType } from "../global/ApplicationStatusType"
import { IconFillColors, UniversalIconType } from "../icons/Icon"
import ImageCardDocumentation from "./ImageCard.docs.mdx"

export default {
  title: "Blocks/Image Card 🚩",
  id: "blocks/image-card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
  parameters: {
    docs: {
      page: ImageCardDocumentation,
    },
    badges: [BADGES.GEN2],
  },
}

export const image = () => <ImageCard imageUrl="/images/listing.jpg" />

export const twoImages = () => (
  <ImageCard
    images={[
      { url: "/images/listing.jpg" },
      {
        url: "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/oakhouse_cgdqmx.jpg",
      },
    ]}
  />
)

export const threeImages = () => (
  <ImageCard
    images={[
      { url: "/images/listing.jpg" },
      {
        url: "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/oakhouse_cgdqmx.jpg",
      },
      {
        url: "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/house_goo3cp.jpg",
      },
    ]}
  />
)

export const fourImages = () => (
  <ImageCard
    images={[
      { url: "/images/listing.jpg" },
      {
        url: "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/oakhouse_cgdqmx.jpg",
        mobileUrl:
          "https://res.cloudinary.com/exygy/image/upload/w_767,c_limit,q_55/dev/oakhouse_cgdqmx.jpg",
        thumbnailUrl:
          "https://res.cloudinary.com/exygy/image/upload/w_480,c_limit,q_55/dev/oakhouse_cgdqmx.jpg",
        description: "The second photo in the list",
      },
      {
        url: "https://res.cloudinary.com/exygy/image/upload/w_1302,c_limit,q_65/dev/house_goo3cp.jpg",
      },
      {
        url: "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
      },
    ]}
    modalCloseLabel="Back to listing"
    moreImagesLabel="images"
    moreImagesDescription="more images for 'Property Name'"
  />
)

export const withLink = () => <ImageCard href="/listings" imageUrl="/images/listing.jpg" />

export const withNoImage = () => <ImageCard />

export const withOneStatusAndSmaller = () => (
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

export const withTooltip = () => (
  <div style={{ margin: "5rem" }}>
    <ImageCard
      href="/listings"
      imageUrl="/images/listing.jpg"
      tags={[
        {
          text: "Label",
        },
        {
          text: "Label2",
          iconType: "globe" as UniversalIconType,
          iconColor: IconFillColors.white,
          tooltip: {
            id: "tooltip",
            text: "Here is some helpful tooltip content. Here is even more helpful tooltip content.",
          },
        },
      ]}
      statuses={[
        { status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") },
      ]}
    />
  </div>
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
