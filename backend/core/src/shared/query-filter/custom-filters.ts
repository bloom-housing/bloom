import { getMetadataArgsStorage, WhereExpression } from "typeorm"
import { AvailabilityFilterEnum } from "../../listings/types/listing-filter-keys-enum"
import { UnitGroup } from "../../units-summary/entities/unit-group.entity"
import { UnitType } from "../../unit-types/entities/unit-type.entity"

export function addAvailabilityQuery(
  qb: WhereExpression,
  filterValue: AvailabilityFilterEnum,
  includeNulls?: boolean
) {
  const whereParameterName = "availability"
  switch (filterValue) {
    case AvailabilityFilterEnum.hasAvailability:
      qb.andWhere(
        `(unitGroups.total_available >= :${whereParameterName}${
          includeNulls ? ` OR unitGroups.total_available IS NULL` : ""
        })`,
        {
          [whereParameterName]: 1,
        }
      )
      return
    case AvailabilityFilterEnum.noAvailability:
      qb.andWhere(
        `(unitGroups.total_available = :${whereParameterName}${
          includeNulls ? ` OR unitGroups.total_available IS NULL` : ""
        })`,
        {
          [whereParameterName]: 0,
        }
      )
      return
    case AvailabilityFilterEnum.waitlist:
      qb.andWhere(
        `(listings.is_waitlist_open = :${whereParameterName}${
          includeNulls ? ` OR listings.is_waitlist_open is NULL` : ""
        })`,
        {
          [whereParameterName]: true,
        }
      )
      return
    default:
      return
  }
}

export function addBedroomsQuery(qb: WhereExpression, filterValue: number[]) {
  const typeOrmMetadata = getMetadataArgsStorage()
  const unitGroupEntityMetadata = typeOrmMetadata.tables.find((table) => table.target === UnitGroup)
  const unitTypeEntityMetadata = typeOrmMetadata.tables.find((table) => table.target === UnitType)
  const whereParameterName = "unitGroups_numBedrooms"

  const unitGroupUnitTypeJoinTableName = `${unitGroupEntityMetadata.name}_unit_type_${unitTypeEntityMetadata.name}`
  qb.andWhere(
    `
      (
        SELECT bool_or(num_bedrooms  IN (:...${whereParameterName})) FROM ${unitGroupEntityMetadata.name}
        LEFT JOIN ${unitGroupUnitTypeJoinTableName} ON ${unitGroupUnitTypeJoinTableName}.unit_group_id = ${unitGroupEntityMetadata.name}.id
        LEFT JOIN ${unitTypeEntityMetadata.name}  ON ${unitTypeEntityMetadata.name}.id = ${unitGroupUnitTypeJoinTableName}.unit_types_id
        WHERE ${unitGroupEntityMetadata.name}.listing_id = listings.id
      ) = true
    `,
    {
      [whereParameterName]: filterValue,
    }
  )
  return
}

export function addMinAmiPercentageFilter(
  qb: WhereExpression,
  filterValue: number,
  includeNulls?: boolean
) {
  const whereParameterName = "amiPercentage_unitGroups"
  const whereParameterName2 = "amiPercentage_listings"

  // Check the listing.ami_percentage field iff the field is not set on the Unit Groups table.
  qb.andWhere(
    `(("unitGroupsAmiLevels"."ami_percentage" IS NOT NULL AND "unitGroupsAmiLevels"."ami_percentage" >= :${whereParameterName}) ` +
      `OR ("unitGroupsAmiLevels"."ami_percentage" IS NULL AND listings.ami_percentage_max >= :${whereParameterName2})
      ${
        includeNulls
          ? `OR "unitGroupsAmiLevels"."ami_percentage" is NULL AND listings.ami_percentage_max is NULL`
          : ""
      })`,
    {
      [whereParameterName]: filterValue,
      [whereParameterName2]: filterValue,
    }
  )
  return
}

export function addFavoritedFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("listings.id IN (:...favoritedListings) ", {
      favoritedListings: val,
    })
  }
  return
}
