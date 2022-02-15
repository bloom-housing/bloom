import * as React from "react"
import { ImageCard } from "./ImageCard"
import { t } from "../helpers/translator"
import { ApplicationStatusType } from "../global/ApplicationStatusType"

export default {
  title: "Blocks/Image Card",
  decorators: [(storyFn: any) => <div style={{ maxWidth: "700px" }}>{storyFn()}</div>],
}

export const imageWithTitle = () => <ImageCard imageUrl="/images/listing.jpg" title="Hello World" />

export const imageWithTitleAndSubtitle = () => (
  <ImageCard
    imageUrl="/images/listing.jpg"
    title="Hello World"
    subtitle="55 Triton Park Lane, Foster City CA, 94404"
  />
)

export const withLink = () => (
  <ImageCard href="/listings" imageUrl="/images/listing.jpg" title="Hello World" />
)

export const withNoImage = () => <ImageCard href="/listings" title="Hello World" />

export const withShortImageLongTitle = () => {
  return (
    <div style={{ maxWidth: "500px" }}>
      <ImageCard
        href="/listings"
        imageUrl="https://bit.ly/3jzVfwP
  "
        subtitle="55 Triton Park Lane, Foster City CA, 94404"
        title="Here is the name of a long listing"
      />
    </div>
  )
}

export const withShortImageLongerTitle = () => {
  return (
    <div style={{ maxWidth: "500px" }}>
      <ImageCard
        href="/listings"
        imageUrl="https://bit.ly/3jzVfwP
  "
        subtitle="55 Triton Park Lane, Foster City CA, 94404"
        title="Here is the name of a long listing, it should wrap"
      />
    </div>
  )
}

export const withOneStatus = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    title="Hello World"
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)

export const withDescriptionAsAlt = () => (
  <ImageCard
    imageUrl="/images/listing.jpg"
    title="Hello World"
    description="An image of the building"
  />
)

export const withOneStatusAndTag = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    title="Hello World"
    subtitle="55 Triton Park Lane, Foster City CA, 94404"
    tagLabel="Label"
    statuses={[{ status: ApplicationStatusType.Closed, content: t("listings.applicationsClosed") }]}
  />
)

export const withMultipleAppStatus = () => (
  <ImageCard
    href="/listings"
    imageUrl="/images/listing.jpg"
    title="Hello World"
    subtitle="55 Triton Park Lane, Foster City CA, 94404"
    tagLabel="Label"
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
    title="Hello World"
    subtitle="Matched"
    statuses={[
      {
        status: ApplicationStatusType.Matched,
        content: "Matched",
        iconType: "check",
      },
    ]}
  />
)
