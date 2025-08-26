import React from "react"
import dayjs from "dayjs"
import InfoIcon from "@heroicons/react/20/solid/InformationCircleIcon"
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon"
import {
  t,
  ListingCard,
  ApplicationStatusType,
  StatusBarType,
  AppearanceStyleType,
} from "@bloom-housing/ui-components"
import {
  imageUrlFromListing,
  getSummariesTable,
  IMAGE_FALLBACK_URL,
  cleanMultiselectString,
  getStackedSummariesTable,
  ResponseException,
  getStackedGroupSummariesTable,
} from "@bloom-housing/shared-helpers"
import {
  Address,
  ApplicationMultiselectQuestion,
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  ListingsStatusEnum,
  MarketingSeasonEnum,
  MarketingTypeEnum,
  ModificationEnum,
  ReviewOrderTypeEnum,
  UnitGroupsSummarized,
  UnitsSummarized,
  UserService,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { CommonMessageVariant } from "@bloom-housing/ui-seeds/src/blocks/shared/CommonMessage"
import { Icon, Message } from "@bloom-housing/ui-seeds"
import styles from "./helpers.module.scss"
import { ApplicationFormConfig } from "./applications/configInterfaces"

export const getGenericAddress = (bloomAddress: Address) => {
  return bloomAddress
    ? {
        city: bloomAddress.city,
        street: bloomAddress.street,
        street2: bloomAddress.street2,
        state: bloomAddress.state,
        zipCode: bloomAddress.zipCode,
        latitude: bloomAddress.latitude,
        longitude: bloomAddress.longitude,
        placeName: bloomAddress.placeName,
      }
    : null
}

export const disableContactFormOption = (id: string, noPhone: boolean, noEmail: boolean) => {
  if (id === "phone" || id === "text") {
    return noPhone
  }
  return id === "email" && noEmail
}

export const openInFuture = (listing: Listing) => {
  const nowTime = dayjs()
  return listing.applicationOpenDate && nowTime < dayjs(listing.applicationOpenDate)
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

export const getListingTableData = (
  unitsSummarized: UnitsSummarized,
  listingReviewOrder: ReviewOrderTypeEnum
) => {
  return unitsSummarized !== undefined
    ? getSummariesTable(unitsSummarized.byUnitTypeAndRent, listingReviewOrder)
    : []
}

export const getListingStackedTableData = (unitsSummarized: UnitsSummarized) => {
  return unitsSummarized !== undefined
    ? getStackedSummariesTable(unitsSummarized.byUnitTypeAndRent)
    : []
}

export const getListingStackedGroupTableData = (
  unitGroupsSummarized: UnitGroupsSummarized,
  isComingSoon?: boolean
) => {
  return unitGroupsSummarized !== undefined
    ? getStackedGroupSummariesTable(unitGroupsSummarized.unitGroupSummary, isComingSoon)
    : []
}

export const getListingApplicationStatus = (
  listing: Listing,
  hideTime?: boolean,
  hideReviewOrder?: boolean
): StatusBarType => {
  if (!listing) return
  let content = ""
  let subContent = ""
  let formattedDate = ""
  let status = ApplicationStatusType.Open

  if (openInFuture(listing)) {
    const date = listing.applicationOpenDate
    const openDate = dayjs(date)
    formattedDate = openDate.format("MMM D, YYYY")
    content = t("listings.applicationOpenPeriod")
  } else {
    if (listing.status === ListingsStatusEnum.closed) {
      status = ApplicationStatusType.Closed
      content = t("listings.applicationsClosed")
    } else if (listing.applicationDueDate) {
      const dueDate = dayjs(listing.applicationDueDate)
      formattedDate = dueDate.format("MMM DD, YYYY")
      formattedDate = !hideTime
        ? formattedDate + ` ${t("t.at")} ` + dueDate.format("h:mmA")
        : formattedDate

      // if due date is in future, listing is open
      if (dayjs() < dueDate) {
        content = t("listings.applicationDue")
      } else {
        status = ApplicationStatusType.Closed
        content = t("listings.applicationsClosed")
      }
    } else {
      content = t("listings.applicationOpenPeriod")
    }
  }

  if (formattedDate !== "") {
    content = content + `: ${formattedDate}`
  }

  if (!hideReviewOrder) {
    if (listing.reviewOrderType === ReviewOrderTypeEnum.firstComeFirstServe) {
      subContent = content
      content = t("listings.applicationFCFS")
    }
  }

  return {
    status,
    content,
    subContent,
  }
}

export const getStatusPrefix = (
  listing: Listing,
  enableMarketingStatus: boolean,
  enableUnitGroups: boolean
): { label: string; variant: CommonMessageVariant } => {
  if (
    listing.status === ListingsStatusEnum.closed ||
    (listing.applicationDueDate && dayjs() > dayjs(listing.applicationDueDate))
  ) {
    return { label: t("listings.applicationsClosed"), variant: "secondary-inverse" }
  }
  if (enableMarketingStatus && listing.marketingType === MarketingTypeEnum.comingSoon)
    return { label: t("listings.underConstruction"), variant: "warn" }

  if (enableUnitGroups) {
    const hasUnitGroupsWaitlistOpen = listing.unitGroups.some((group) => group.openWaitlist)
    const unitsAvailable =
      listing.unitGroups.length > 0
        ? listing.unitGroups.reduce((acc, curr) => acc + curr.totalAvailable, 0)
        : listing.unitsAvailable
    if (listing.reviewOrderType === ReviewOrderTypeEnum.lottery)
      return { label: t("listings.lottery"), variant: "primary" }
    if (unitsAvailable) return { label: t("listings.applicationFCFS"), variant: "primary" }
    if (!listing.unitGroups || listing.unitGroups.length === 0) {
      return { label: t("listings.availabilityUnknown"), variant: "warn" }
    }
    if (hasUnitGroupsWaitlistOpen) {
      return { label: t("listings.waitlist.open"), variant: "secondary" }
    } else {
      return { label: t("listings.availability.closedWaitlist"), variant: "secondary-inverse" }
    }
  } else {
    switch (listing.reviewOrderType) {
      case ReviewOrderTypeEnum.lottery:
        return { label: t("listings.lottery"), variant: "primary" }
      case ReviewOrderTypeEnum.waitlist:
        return { label: t("listings.waitlist.open"), variant: "secondary" }
      default:
        return { label: t("listings.applicationFCFS"), variant: "primary" }
    }
  }
}

export const getListingStatusMessageContent = (
  status: ListingsStatusEnum,
  applicationDueDate: Date,
  enableMarketingStatus: boolean,
  marketingType: MarketingTypeEnum,
  marketingSeason: MarketingSeasonEnum,
  marketingYear: number,
  hideTime?: boolean
) => {
  let content = ""
  let formattedDate = ""
  if (status !== ListingsStatusEnum.closed) {
    if (applicationDueDate) {
      const dueDate = dayjs(applicationDueDate)
      formattedDate = dueDate.format("MMM DD, YYYY")
      formattedDate = !hideTime
        ? formattedDate + ` ${t("t.at")} ` + dueDate.format("h:mmA")
        : formattedDate

      if (dayjs() < dueDate) {
        content = t("listings.applicationDue")
        if (formattedDate) content = content + ": "
      }
    } else {
      content = t("listings.applicationOpenPeriod")
    }

    if (formattedDate !== "") {
      content = content + `${formattedDate}`
    }

    if (marketingType === MarketingTypeEnum.comingSoon && enableMarketingStatus) {
      content = getApplicationSeason(marketingSeason, marketingYear)
    }
  }
  return content
}

export const getListingStatusMessage = (
  listing: Listing,
  jurisdiction: Jurisdiction | { featureFlags: FeatureFlag[] },
  content?: React.ReactNode,
  hideTime?: boolean,
  hideDate?: boolean,
  className?: string
) => {
  if (!listing) return

  const enableMarketingStatus = isFeatureFlagOn(jurisdiction, "enableMarketingStatus")
  const enableUnitGroups = isFeatureFlagOn(jurisdiction, "enableUnitGroups")
  const prefix = getStatusPrefix(listing, enableMarketingStatus, enableUnitGroups)

  const overwriteHide =
    listing.reviewOrderType !== ReviewOrderTypeEnum.lottery &&
    listing.marketingType !== MarketingTypeEnum.comingSoon

  const hideNoUnitGroups =
    enableUnitGroups && (!listing.unitGroups || listing.unitGroups.length === 0) && overwriteHide
  const hideWaitlistClosedNoAvailableUnits =
    enableUnitGroups &&
    !listing.unitGroups.some((group) => group.openWaitlist || group.totalAvailable > 0) &&
    overwriteHide
  const hideIsClosed =
    listing.status === ListingsStatusEnum.closed ||
    (listing.applicationDueDate && dayjs() > dayjs(listing.applicationDueDate))
  const hideNoDateMarketingStatus =
    listing.marketingType === MarketingTypeEnum.comingSoon &&
    !listing.marketingSeason &&
    !listing.marketingYear

  const hideStatusMessageContent =
    hideDate ||
    hideNoUnitGroups ||
    hideWaitlistClosedNoAvailableUnits ||
    hideIsClosed ||
    hideNoDateMarketingStatus

  const classNames = [styles["status-bar"]]
  if (className) classNames.push(className)

  return (
    <Message
      className={classNames.join(" ")}
      customIcon={
        <Icon size="md" className={styles["primary-color-icon"]}>
          {prefix?.variant === "secondary-inverse" ? <LockClosedIcon /> : <InfoIcon />}
        </Icon>
      }
      variant={prefix?.variant}
    >
      {content ? (
        content
      ) : (
        <div className={styles["due-date-content"]}>
          <div className={styles["date-review-order"]}>{prefix?.label}</div>
          {!hideStatusMessageContent && (
            <div>
              {getListingStatusMessageContent(
                listing.status,
                listing.applicationDueDate,
                enableMarketingStatus,
                listing.marketingType,
                listing.marketingSeason,
                listing.marketingYear,
                hideTime
              )}
            </div>
          )}
        </div>
      )}
    </Message>
  )
}

export const getApplicationSeason = (
  marketingSeason: MarketingSeasonEnum,
  marketingYear: number
) => {
  let label = t("listings.apply.applicationSeason")
  if (marketingSeason) {
    label = label.concat(` ${t(`seasons.${marketingSeason}`)}`)
  }
  if (marketingYear) {
    label = label.concat(` ${marketingYear}`)
  }
  return marketingSeason || marketingYear ? label : null
}

export const getListings = (listings) => {
  const unitSummariesHeaders = {
    unitType: "t.unitType",
    minimumIncome: "t.minimumIncome",
    rent: "t.rent",
  }

  const generateTableSubHeader = (listing) => {
    if (listing.reviewOrderType !== ReviewOrderTypeEnum.waitlist) {
      return {
        content: t("listings.availableUnits"),
        styleType: AppearanceStyleType.success,
        isPillType: true,
      }
    } else if (listing.reviewOrderType === ReviewOrderTypeEnum.waitlist) {
      return {
        content: t("listings.waitlist.open"),
        styleType: AppearanceStyleType.primary,
        isPillType: true,
      }
    }
    return null
  }
  return listings.map((listing: Listing, index) => {
    return (
      <ListingCard
        key={index}
        imageCardProps={{
          imageUrl: imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize))[0],
          tags: listing.reservedCommunityTypes
            ? [
                {
                  text: t(`listings.reservedCommunityTypes.${listing.reservedCommunityTypes.name}`),
                },
              ]
            : undefined,
          statuses: [getListingApplicationStatus(listing)],
          description: listing.name,
          fallbackImageUrl: IMAGE_FALLBACK_URL,
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing.unitsSummarized, listing.reviewOrderType),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        footerButtons={[
          {
            text: t("t.seeDetails"),
            href: `/listing/${listing.id}/${listing.urlSlug}`,
            ariaHidden: true,
          },
        ]}
        contentProps={{
          contentHeader: {
            content: listing.name,
            href: `/listing/${listing.id}/${listing.urlSlug}`,
          },
          contentSubheader: { content: getListingCardSubtitle(listing.listingsBuildingAddress) },
          tableHeader: generateTableSubHeader(listing),
        }}
      />
    )
  })
}

export const untranslateMultiselectQuestion = (
  data: ApplicationMultiselectQuestion[],
  listing: Listing
) => {
  const multiselectQuestions = listing?.listingMultiselectQuestions ?? []

  data.forEach((datum) => {
    const question = multiselectQuestions.find(
      (elem) =>
        elem.multiselectQuestions.text === datum.key ||
        elem.multiselectQuestions.untranslatedText === datum.key
    )?.multiselectQuestions

    if (question) {
      datum.key = question.untranslatedText ?? question.text

      if (datum.options) {
        datum.options.forEach((option) => {
          const selectedOption = question.options.find((elem) => {
            return cleanMultiselectString(elem.text) === cleanMultiselectString(option.key)
          })
          if (selectedOption) {
            option.key = selectedOption.untranslatedText ?? selectedOption.text
          } else if (
            cleanMultiselectString(question?.optOutText) === cleanMultiselectString(option.key)
          ) {
            option.key = question.untranslatedOptOutText ?? question.optOutText
          }

          if (option.extraData) {
            option.extraData.forEach((extra) => {
              if (!extra.key) {
                extra.key = selectedOption.untranslatedText ?? selectedOption.text
              }
            })
          }
        })
      }
    }
  })
}

export const downloadExternalPDF = async (fileURL: string, fileName: string) => {
  try {
    await fetch(fileURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/pdf",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement("a")
        link.href = url
        link.target = "_blank"
        link.setAttribute("download", `${fileName}.pdf`)

        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
      })
  } catch (err) {
    console.log(err)
  }
}

export const isFeatureFlagOn = (
  // optional type when no full jurisdiction data is available
  jurisdiction: Jurisdiction | { featureFlags: FeatureFlag[] },
  featureFlag: string
) => {
  return jurisdiction?.featureFlags?.some((flag) => flag.name === featureFlag && flag.active)
}

export const setFeatureFlagLocalStorage = (
  jurisdiction: Jurisdiction,
  featureFlag: string,
  storageKey: string
) => {
  window.localStorage.setItem(
    `bloom-${storageKey}`,
    (isFeatureFlagOn(jurisdiction, featureFlag) === true).toString()
  )
}

/**
 * @throws {ResponseError}
 */
export const saveListingFavorite = async (
  userService: UserService,
  listingId: string,
  favorited: boolean
) => {
  try {
    await userService.modifyFavoriteListings({
      body: {
        id: listingId,
        action: favorited ? ModificationEnum.add : ModificationEnum.remove,
      },
    })
  } catch (err) {
    console.error(err)
    throw new ResponseException(t("listings.favoriteSaveError"))
  }
}

export const fetchFavoriteListingIds = async (userId: string, userService: UserService) => {
  return (await userService.favoriteListings({ id: userId })).map((item) => item.id)
}

export const isTrue = (value) => {
  return value === true || value === "true"
}

export const isUnitGroupAppWaitlist = (listing: Listing, config: ApplicationFormConfig) => {
  return (
    isFeatureFlagOn(config, FeatureFlagEnum.enableUnitGroups) &&
    listing.unitGroups.some((group) => group.openWaitlist) &&
    !listing.unitGroups.some((group) => group.totalAvailable > 0)
  )
}

export const isUnitGroupAppBase = (listing: Listing, config: ApplicationFormConfig) => {
  return (
    isFeatureFlagOn(config, FeatureFlagEnum.enableUnitGroups) &&
    !listing.unitGroups.some((group) => group.openWaitlist) &&
    !listing.unitGroups.some((group) => group.totalAvailable > 0)
  )
}
