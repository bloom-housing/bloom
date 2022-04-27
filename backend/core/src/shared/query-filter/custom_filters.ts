import { getMetadataArgsStorage, WhereExpression } from "typeorm"
import { UnitGroup } from "../../units-summary/entities/unit-group.entity"
import { UnitType } from "../../unit-types/entities/unit-type.entity"

export function addAvailabilityQuery(qb: WhereExpression, filterValue: string) {
  const val = filterValue?.split(",")
  val.forEach((option) => {
    switch (option) {
      case "vacantUnits":
        qb.andWhere("(unitGroups.total_available >= :vacantUnits)", {
          vacantUnits: 1,
        })
        return
      case "openWaitlist":
        if (!val.includes("closedWaitlist")) {
          qb.andWhere("(coalesce(unitGroups.open_waitlist, false) = :openWaitlist)", {
            openWaitlist: true,
          })
        }
        return
      case "closedWaitlist":
        if (!val.includes("openWaitlist")) {
          qb.andWhere("(coalesce(unitGroups.open_waitlist, false) = :closedWaitlist)", {
            closedWaitlist: false,
          })
        }
        return
      default:
        return
    }
  })
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

export function addProgramFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("programs.id IN (:...communityPrograms) ", {
      communityPrograms: val,
    })
  }
  return
}

export function addRegionFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  if (val.length) {
    qb.andWhere("property.region IN (:...region) ", {
      region: val,
    })
  }
  return
}

export function addAccessibilityFilter(qb: WhereExpression, filterValue: string) {
  const val = filterValue.split(",").filter((elem) => !!elem)
  val.forEach((key) => {
    qb.andWhere(`listing_features.${key} = true`)
  })
  return
}
