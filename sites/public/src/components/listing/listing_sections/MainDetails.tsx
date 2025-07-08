import React, { Dispatch, SetStateAction } from "react"
import { CheckIcon } from "@heroicons/react/16/solid"
import {
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  MarketingTypeEnum,
  ReviewOrderTypeEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Heading, Link, Tag, Icon } from "@bloom-housing/ui-seeds"
import { TagVariant } from "@bloom-housing/ui-seeds/src/text/Tag"
import { ImageCard, t } from "@bloom-housing/ui-components"
import {
  IMAGE_FALLBACK_URL,
  imageUrlFromListing,
  oneLineAddress,
} from "@bloom-housing/shared-helpers"
import FavoriteButton from "../../shared/FavoriteButton"
import { Availability } from "./Availability"
import listingStyles from "../ListingViewSeeds.module.scss"
import styles from "./MainDetails.module.scss"

type MainDetailsProps = {
  listing: Listing
  jurisdiction: Jurisdiction
  listingFavorited?: boolean
  setListingFavorited?: Dispatch<SetStateAction<boolean>>
  showFavoriteButton?: boolean
  showHomeType?: boolean
}

type ListingTag = {
  title: string
  variant: TagVariant
  icon?: React.ReactNode
}

export const getListingTags = (
  listing: Listing,
  hideReviewTags?: boolean,
  hideHomeTypeTag?: boolean,
  enableIsVerified?: boolean
): ListingTag[] => {
  const listingTags: ListingTag[] = []

  if (enableIsVerified && listing.isVerified) {
    listingTags.push({
      title: t("listings.verifiedListing"),
      variant: "warn-inverse",
      icon: <CheckIcon />,
    })
  }

  if (!hideHomeTypeTag && listing.homeType) {
    listingTags.push({
      title: t(`listings.homeType.${listing.homeType}`),
      variant: "highlight-cool",
    })
  }

  if (listing.reservedCommunityTypes) {
    listingTags.push({
      title: t(`listings.reservedCommunityTypes.${listing.reservedCommunityTypes.name}`),
      variant: "highlight-warm",
    })
  }

  if (!hideReviewTags) {
    if (listing.reviewOrderType === ReviewOrderTypeEnum.waitlist) {
      listingTags.push({
        title: t("listings.waitlist.open"),
        variant: "primary",
      })
    }
    if (listing.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe) {
      listingTags.push({
        title: t("listings.availableUnits"),
        variant: "primary",
      })
    }
    if (listing.marketingType === MarketingTypeEnum.comingSoon) {
      listingTags.push({
        title: t("listings.underConstruction"),
        variant: "secondary",
      })
    }
  }

  return listingTags
}

export const MainDetails = ({
  jurisdiction,
  listing,
  listingFavorited,
  setListingFavorited,
  showFavoriteButton,
  showHomeType,
}: MainDetailsProps) => {
  if (!listing) return
  const enableIsVerified = jurisdiction.featureFlags.find(
    (flag) => flag.name === FeatureFlagEnum.enableIsVerified
  )?.active

  const googleMapsHref =
    "https://www.google.com/maps/place/" + oneLineAddress(listing.listingsBuildingAddress)
  const listingTags = getListingTags(listing, true, !showHomeType, enableIsVerified)
  return (
    <div>
      <ImageCard
        images={imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize)).map(
          (imageUrl: string) => {
            return {
              url: imageUrl,
            }
          }
        )}
        description={t("listings.buildingImageAltText")}
        moreImagesLabel={t("listings.moreImagesLabel")}
        moreImagesDescription={t("listings.moreImagesAltDescription", {
          listingName: listing.name,
        })}
        modalCloseLabel={t("t.backToListing")}
        modalCloseInContent
        fallbackImageUrl={IMAGE_FALLBACK_URL}
      />
      <div className={`${styles["listing-main-details"]} seeds-m-bs-header`}>
        <Heading
          priority={1}
          size={"xl"}
          className={`${styles["listing-heading"]} seeds-m-be-text`}
        >
          {listing.name}
        </Heading>
        <div className={styles["listing-address-container"]}>
          <div className={styles["listing-address"]}>
            <div className={`seeds-m-ie-4 ${styles["flex-margin"]}`}>
              {oneLineAddress(listing.listingsBuildingAddress)}
            </div>
            <div className={styles["flex-margin"]}>
              <Link href={googleMapsHref} newWindowTarget={true}>
                {t("t.viewOnMap")}
              </Link>
            </div>
          </div>
        </div>

        {listingTags.length > 0 && (
          <div className={`${styles["listing-tags"]} seeds-m-bs-3`} data-testid={"listing-tags"}>
            {listingTags.map((tag, index) => {
              return (
                <Tag variant={tag.variant} key={index} className={styles["tag"]}>
                  <span>
                    {tag.icon && <Icon>{tag.icon}</Icon>}
                    {tag.title}
                  </span>
                </Tag>
              )
            })}
          </div>
        )}
        <p className={"seeds-m-bs-3"}>{listing.developer}</p>
        {showFavoriteButton && (
          <p className={"seeds-m-bs-3"}>
            <FavoriteButton favorited={listingFavorited} setFavorited={setListingFavorited}>
              {t("listings.favorite")}
            </FavoriteButton>
          </p>
        )}
      </div>

      <div className={`${listingStyles["hide-desktop"]} seeds-m-bs-content`}>
        <Availability listing={listing} jurisdiction={jurisdiction} />
      </div>
    </div>
  )
}
