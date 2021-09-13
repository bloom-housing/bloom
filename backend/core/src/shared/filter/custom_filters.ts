import { WhereExpression } from "typeorm"
import {
  AvailabilityFilterEnum,
  ListingFilterKeys,
} from "../../listings/types/listing-filter-keys-enum"
import { filterTypeToFieldMap } from "../../listings/dto/listing.dto"

export function addSeniorHousingQuery(qb: WhereExpression, filterValue: string) {
  const whereParameterName = ListingFilterKeys.seniorHousing
  const seniorHousingCommunityType = "senior62"
  const reservedCommunityTypeColumnName = `LOWER(CAST(${
    filterTypeToFieldMap[ListingFilterKeys.seniorHousing]
  } as text))`
  if (filterValue == "true") {
    qb.andWhere(`${reservedCommunityTypeColumnName} = LOWER(:${whereParameterName})`, {
      [whereParameterName]: seniorHousingCommunityType,
    })
  } else if (filterValue == "false") {
    qb.andWhere(
      `(${reservedCommunityTypeColumnName} IS NULL OR ${reservedCommunityTypeColumnName} <> LOWER(:${whereParameterName}))`,
      {
        [whereParameterName]: seniorHousingCommunityType,
      }
    )
  }
}

export function addAvailabilityQuery(qb: WhereExpression, filterValue: AvailabilityFilterEnum) {
  const whereParameterName = "availability"
  switch (filterValue) {
    case AvailabilityFilterEnum.hasAvailability:
      qb.andWhere(`unitsSummary.total_available >= :${whereParameterName}`, {
        [whereParameterName]: 1,
      })
      return
    case AvailabilityFilterEnum.noAvailability:
      qb.andWhere(`unitsSummary.total_available = :${whereParameterName}`, {
        [whereParameterName]: 0,
      })
      return
    case AvailabilityFilterEnum.waitlist:
      qb.andWhere(`listings.is_waitlist_open = :${whereParameterName}`, {
        [whereParameterName]: true,
      })
      return
    default:
      return
  }
}

export function addAmiPercentageFilter(qb: WhereExpression, filterValue: number) {
  const whereParameterName = "amiPercentage_unitsSummary"
  const whereParameterName2 = "amiPercentage_listings"

  // Check the listing.ami_percentage field iff the field is not set on the Units Summary table.
  qb.andWhere(
    `((unitsSummary.ami_percentage IS NOT NULL AND unitsSummary.ami_percentage >= :${whereParameterName}) ` +
      `OR (unitsSummary.ami_percentage IS NULL AND listings.ami_percentage_max >= :${whereParameterName2}))`,
    {
      [whereParameterName]: filterValue,
      [whereParameterName2]: filterValue,
    }
  )
  return
}
