import React from "react"
import { ELIGIBILITY_ROUTE, ELIGIBILITY_SECTIONS } from "./constants"

export const eligibilityRoute = (page: number) =>
  `/${ELIGIBILITY_ROUTE}/${ELIGIBILITY_SECTIONS[page]}`
import dayjs from "dayjs"
import {
  Address,
  Listing,
  ListingFeatures,
  ListingMarketingTypeEnum,
  ListingProgram,
} from "@bloom-housing/backend-core/types"
import {
  t,
  ListingCard,
  TableHeaders,
  FavoriteButton,
  LinkButton,
  Tag,
  Icon,
  AppearanceStyleType,
  IconFillColors,
  ImageTag,
  Tooltip,
} from "@bloom-housing/ui-components"
import { imageUrlFromListing, listingFeatures } from "@bloom-housing/shared-helpers"

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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

export const openInFuture = (listing: Listing) => {
  const nowTime = dayjs()
  return listing.applicationOpenDate && nowTime < dayjs(listing.applicationOpenDate)
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

export const accessibilityFeaturesExist = (features: ListingFeatures) => {
  if (!features) return false
  let featuresExist = false
  Object.keys(listingFeatures).map((feature) => {
    if (features[feature]) {
      featuresExist = true
    }
  })
  return featuresExist
}

export const getImageTagLabelFromListing = (listing: Listing) => {
  if (listing?.marketingType === ListingMarketingTypeEnum.comingSoon) {
    let label = t("listings.comingSoon")
    if (listing?.marketingSeason) {
      label = label.concat(` ${t(`seasons.${listing.marketingSeason}`)}`)
    }
    if (listing?.marketingDate) {
      label = label.concat(` ${dayjs(listing.marketingDate).year()}`)
    }
    return label
  }
  return listing?.isVerified ? t("listings.verifiedListing") : undefined
}

export const getListingTags = (
  listingPrograms: ListingProgram[],
  listingFeatures: ListingFeatures
) => {
  const tags: ImageTag[] =
    listingPrograms
      ?.sort((a, b) => (a.ordinal < b.ordinal ? -1 : 1))
      .map((program) => {
        return { text: program.program.title }
      }) ?? []
  if (accessibilityFeaturesExist(listingFeatures)) {
    tags.push({
      text: t("listings.reservedCommunityTypes.specialNeeds"),
      iconType: "universalAccess",
      iconColor: AppearanceStyleType.primary,
    })
  }
  return tags
}

export const getListingTag = (tag: ImageTag) => {
  return (
    <Tag
      styleType={AppearanceStyleType.accentLight}
      className={"mr-2 mb-2 font-bold px-3 py-2"}
      key={tag.text}
    >
      {tag.iconType && (
        <Icon
          size={"medium"}
          symbol={tag.iconType}
          fill={tag.iconColor ?? IconFillColors.primary}
          className={"mr-2"}
        />
      )}
      {tag.text}
    </Tag>
  )
}

export const getImageCardTag = (listing): ImageTag[] => {
  const tag = getImageTagLabelFromListing(listing)
  return tag
    ? [
        {
          text: tag,
          iconType:
            listing?.marketingType === ListingMarketingTypeEnum.comingSoon
              ? "calendarBlock"
              : "badgeCheck",
          iconColor:
            listing?.marketingType === ListingMarketingTypeEnum.comingSoon
              ? IconFillColors.white
              : "#193154",
          styleType:
            listing?.marketingType === ListingMarketingTypeEnum.comingSoon
              ? AppearanceStyleType.closed
              : AppearanceStyleType.accentLight,
          tooltip: {
            id: "verified",
            text: t("listings.managerHasConfirmedInformation"),
          },
        },
      ]
    : null
}

export const getListings = (listings) => {
  const unitSummariesHeaders = {
    unitType: "t.unitType",
    rent: "t.rent",
    availability: "t.availability",
  }

  return listings.map((listing: Listing, index) => (
    <ListingCard
      key={index}
      imageCardProps={{
        imageUrl: imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")),
        href: `/listing/${listing.id}/${listing.urlSlug}`,
        tags: getImageCardTag(listing),
      }}
      tableProps={{
        headers: unitSummariesHeaders,
        data: getUnitGroupSummary(listing).data,
        responsiveCollapse: true,
        cellClassName: "px-5 py-3",
      }}
      contentProps={{
        contentHeader: { text: listing.name },
        contentSubheader: { text: getListingCardSubtitle(listing.buildingAddress) },
        tableHeader: { text: listing.showWaitlist ? t("listings.waitlist.open") : null },
      }}
      cardTags={getListingTags(listing.listingPrograms, listing.features)}
      footerContent={
        <div className={"flex justify-between items-center"}>
          <FavoriteButton name={listing.name} id={listing.id} />
          <LinkButton href={`/listing/${listing.id}/${listing.urlSlug}`} key={index}>
            {t("t.seeDetails")}
          </LinkButton>
        </div>
      }
    />
  ))
}

export const usToIntlPhone = (usPhoneNumber: string | null): string => {
  return usPhoneNumber !== ""
    ? usPhoneNumber.replace(/\((\d{3})\) (\d{3})-(\d{4})/, "+1$1$2$3")
    : null
}

export const intlToUsPhone = (intlPhoneNumber: string | null): string => {
  return intlPhoneNumber !== "" ? intlPhoneNumber.replace(/\+1(\d{10})/, "$1") : null
}

interface UnitSummaryTable {
  headers: TableHeaders
  data: Record<string, React.ReactNode>[]
}

export const getUnitGroupSummary = (listing: Listing): UnitSummaryTable => {
  const groupedUnitHeaders: TableHeaders = {
    unitType: t("t.unitType"),
    rent: t("t.rent"),
    availability: t("t.availability"),
    ami: {
      name: "ami",
      className: "ami-header",
      icon: (
        <Tooltip id="ami-info" className="ml-2" text={t("listings.areaMedianIncome")}>
          <Icon size="medium" symbol="info" tabIndex={0} />
        </Tooltip>
      ),
    },
  }
  let groupedUnitData: Record<string, React.ReactNode>[] = null

  // unit group summary
  groupedUnitData = listing?.unitSummaries?.unitGroupSummary?.map((group) => {
    let rentRange = null
    let rentAsPercentIncomeRange = null
    if (group.rentRange && group.rentRange.min === group.rentRange.max) {
      rentRange = group.rentRange.min
    } else if (group.rentRange) {
      rentRange = `${group.rentRange.min} - ${group.rentRange.max}`
    }

    if (rentRange) {
      rentRange = (
        <span>
          <strong>{rentRange}</strong> {t("t.perMonth")}
        </span>
      )
    }

    if (
      group.rentAsPercentIncomeRange &&
      group.rentAsPercentIncomeRange.min === group.rentAsPercentIncomeRange.max
    ) {
      rentAsPercentIncomeRange = group.rentAsPercentIncomeRange.min
    } else if (group.rentAsPercentIncomeRange) {
      rentAsPercentIncomeRange = `${group.rentAsPercentIncomeRange.min} - ${group.rentAsPercentIncomeRange.max}`
    }

    if (rentAsPercentIncomeRange) {
      rentAsPercentIncomeRange = (
        <span>
          <strong>{rentAsPercentIncomeRange}%</strong> {t("t.income")}
        </span>
      )
    }

    let availability = null

    if (listing.marketingType && listing.marketingType === ListingMarketingTypeEnum.comingSoon) {
      availability = <strong>{t("listings.comingSoon")}</strong>
    } else {
      if (group.unitVacancies > 0) {
        availability = (
          <div>
            <strong>{group.unitVacancies} </strong>
            {group.unitVacancies === 1 ? t("listings.vacantUnit") : t("listings.vacantUnits")}
            {` ${t("t.&")}`}
          </div>
        )
      }

      availability = (
        <>
          {availability}
          <strong>
            {group.openWaitlist ? t("listings.waitlist.open") : t("listings.waitlist.closed")}
          </strong>
        </>
      )
    }

    let ami = null

    if (group.amiPercentageRange && group.amiPercentageRange.min === group.amiPercentageRange.max) {
      ami = `${group.amiPercentageRange.min}%`
    } else if (group.amiPercentageRange) {
      ami = `${group.amiPercentageRange.min} - ${group.amiPercentageRange.max}%`
    }

    let rent: React.ReactNode = null

    if (rentRange && rentAsPercentIncomeRange) {
      rent = (
        <>
          {rentRange}, {rentAsPercentIncomeRange}
        </>
      )
    } else if (rentRange) {
      rent = rentRange
    } else if (rentAsPercentIncomeRange) {
      rent = rentAsPercentIncomeRange
    }

    return {
      unitType: (
        <>
          {group.unitTypes
            .map<React.ReactNode>((type) => (
              <strong key={type}>{t(`listings.unitTypes.${type}`)}</strong>
            ))
            .reduce((acc, curr) => [acc, ", ", curr])}
        </>
      ),
      rent: rent ?? t("listings.unitsSummary.notAvailable"),
      availability: <strong>{availability ?? t("listings.unitsSummary.notAvailable")}</strong>,
      ami: ami ?? t("listings.unitsSummary.notAvailable"),
    }
  })

  return {
    headers: groupedUnitHeaders,
    data: groupedUnitData,
  }
}

export const getHmiSummary = (listing: Listing): UnitSummaryTable => {
  let hmiHeaders: TableHeaders
  let hmiData: Record<string, React.ReactNode>[] = null

  if (listing.unitGroups !== undefined && listing.unitGroups.length > 0) {
    // hmi summary
    const { columns, rows } = listing.unitSummaries.householdMaxIncomeSummary
    // hmiHeaders
    for (const key in columns) {
      if (hmiHeaders === undefined) {
        hmiHeaders = {}
      }

      if (key === "householdSize") {
        hmiHeaders[key] = t(`listings.householdSize`)
      } else {
        hmiHeaders[key] = t("listings.percentAMIUnit", { percent: key.replace("percentage", "") })
      }
    }
    // hmiData
    hmiData = rows.map((row) => {
      const obj = {}

      for (const key in row) {
        if (key === "householdSize") {
          obj[key] = (
            <>
              <strong>{row[key]}</strong> {row[key] === "1" ? t("t.person") : t("t.people")}
            </>
          )
        } else {
          obj[key] = (
            <>
              <strong>${row[key].toLocaleString("en")}</strong> {t("t.perYear")}
            </>
          )
        }
      }

      return obj
    })
  }

  return {
    headers: hmiHeaders,
    data: hmiData,
  }
}
