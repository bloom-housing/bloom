import { WhereExpression } from "typeorm"
import {
  AvailabilityFilterEnum,
  ListingFilterKeys,
} from "../../listings/types/listing-filter-keys-enum"
import { filterTypeToFieldMap } from "../../listings/dto/listing.dto"
import { Compare } from "../dto/filter.dto"

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

function addAvailabilityParams(
  qb: WhereExpression,
  filterType: AvailabilityFilterEnum,
  comparison: string,
  filterValue: any
) {
  const hasAvailabilityColumnName = `LOWER(CAST(${filterTypeToFieldMap[filterType]} as text))`
  const whereParameterName = filterType
  qb.andWhere(`${hasAvailabilityColumnName} ${comparison} LOWER(:${whereParameterName})`, {
    [whereParameterName]: filterValue,
  })
}

export function addAvailabilityQuery(qb: WhereExpression, filterValue: AvailabilityFilterEnum) {
  switch (filterValue) {
    case AvailabilityFilterEnum.hasAvailability:
      addAvailabilityParams(qb, filterValue, Compare[">="], 1)
      return
    case AvailabilityFilterEnum.noAvailability:
      addAvailabilityParams(qb, filterValue, Compare["="], 0)
      return
    case AvailabilityFilterEnum.waitlist:
      addAvailabilityParams(qb, filterValue, Compare["="], true)
      return
    default:
      return
  }
}
