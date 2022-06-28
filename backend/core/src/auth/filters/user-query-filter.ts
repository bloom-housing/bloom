import { BaseQueryFilter } from "../../shared/query-filter/base-query-filter"
import { Brackets, WhereExpression } from "typeorm"
import { UserFilterKeys } from "../types/user-filter-keys"
import { userFilterTypeToFieldMap } from "../dto/user-filter-type-to-field-map"
import { User } from "../entities/user.entity"

export class UserQueryFilter extends BaseQueryFilter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addFilters<FilterParams extends any[], FilterFieldMap>(
    filters: FilterParams,
    filterTypeToFieldMap: FilterFieldMap,
    qb: WhereExpression,
    user: User
  ) {
    for (const [index, filter] of filters.entries()) {
      for (const filterKey in filter) {
        if (BaseQueryFilter._shouldSkipKey(filter, filterKey)) {
          continue
        }
        BaseQueryFilter._isSupportedFilterTypeOrThrow(filterKey, filterTypeToFieldMap)
        const filterValue = BaseQueryFilter._getFilterValue(filter, filterKey)
        switch (filterKey) {
          case UserFilterKeys.isPortalUser:
            this.addIsPortalUserQuery(qb, filterValue, user)
            continue
        }
        BaseQueryFilter._compare(qb, filter, filterKey, filterTypeToFieldMap, index)
      }
    }
  }

  private addIsPortalUserQuery(qb: WhereExpression, filterValue: string, user: User) {
    addIsPortalUserQuery(qb, filterValue, user)
  }
}

export function addIsPortalUserQuery(qb: WhereExpression, filterValue: string, user: User) {
  const userRolesColumnName = userFilterTypeToFieldMap[UserFilterKeys.isPortalUser]
  if (filterValue == "true") {
    if (user.roles.isAdmin) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb.where(`${userRolesColumnName}.isPartner = true`)
          subQb.orWhere(`${userRolesColumnName}.isAdmin = true`)
          subQb.orWhere(`${userRolesColumnName}.isJurisdictionalAdmin = true`)
        })
      )
    } else if (user.roles.isJurisdictionalAdmin) {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb.where(`${userRolesColumnName}.isPartner = true`)
          subQb.orWhere(`${userRolesColumnName}.isJurisdictionalAdmin = true`)
        })
      )
      qb.andWhere("user_jurisdictions.jurisdictions_id in (:...jurisdictions)", {
        jurisdictions: user.jurisdictions.map((juris) => juris.id),
      })
    } else {
      qb.andWhere(
        new Brackets((subQb) => {
          subQb.where(`${userRolesColumnName}.isPartner = true`)
        })
      )
    }
  } else if (filterValue == "false") {
    qb.andWhere(
      new Brackets((subQb) => {
        subQb.where(`${userRolesColumnName}.isPartner IS NULL`)
        subQb.orWhere(`${userRolesColumnName}.isPartner = false`)
      })
    )
    qb.andWhere(
      new Brackets((subQb) => {
        subQb.where(`${userRolesColumnName}.isAdmin IS NULL`)
        subQb.orWhere(`${userRolesColumnName}.isAdmin = false`)
      })
    )
  }
}
