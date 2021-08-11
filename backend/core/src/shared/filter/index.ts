import { HttpException, HttpStatus } from "@nestjs/common"
import { WhereExpression } from "typeorm"
import { Compare } from "../dto/filter.dto"

/**
 *
 * @param filterParams
 * @param filterTypeToFieldMap
 * @param qb The query on which filters are applied.
 */
/**
 * Add filters to provided QueryBuilder, using the provided map to find the field name.
 * The order of the params matters:
 * - A $comparison must be first.
 * - Comparisons in $comparison will be applied to each filter in order.
 */
export function addFilters<FilterParams, FilterFieldMap>(
  filterParams: FilterParams,
  filterTypeToFieldMap: FilterFieldMap,
  qb: WhereExpression
): void {
  let comparisons: string[],
    comparisonCount = 0

  // TODO(https://github.com/CityOfDetroit/bloom/issues/210): This assumes that
  // the order of keys is consistent across browsers, that the key order is the
  // insertion order, and that the $comaprison field is first.
  // This may not always be the case.
  for (const filterType in filterParams) {
    const value = filterParams[filterType]
    if (filterType === "$comparison") {
      if (Array.isArray(value)) {
        comparisons = value
      } else if (typeof value === "string") {
        comparisons = [value]
      }
      // Ensure none of the user provided comparisons are invalid
      if (comparisons.some((c) => !Object.keys(Compare).includes(c))) {
        throw new HttpException("Comparison Not Implemented", HttpStatus.NOT_IMPLEMENTED)
      }
    } else {
      if (value !== undefined) {
        let values: string[]
        // Handle multiple values for the same key
        if (Array.isArray(value)) {
          values = value
        } else if (typeof value === "string") {
          values = [value]
        }

        const comparisonsForCurrentFilter = comparisons.slice(
          comparisonCount,
          comparisonCount + values.length
        )
        comparisonCount += values.length

        // Throw if this is not a supported filter type
        if (!(filterType in filterTypeToFieldMap)) {
          throw new HttpException("Filter Not Implemented", HttpStatus.NOT_IMPLEMENTED)
        }

        values.forEach((filterValue: string, i: number) => {
          // Each WHERE param must be unique across the entire QueryBuilder
          const whereParameterName = `${filterType}_${i}`
          const comparison = comparisonsForCurrentFilter[i]
          const filterField = filterTypeToFieldMap[filterType as string]

          // Handle custom filters here, before dropping into generic filter handler

          // Generic filter handler
          // Explicitly check for allowed comparisons, to prevent SQL injections
          switch (comparison) {
            case Compare.IN:
              qb.andWhere(`LOWER(CAST(${filterField} as text)) IN (:...${whereParameterName})`, {
                [whereParameterName]: filterValue
                  .split(",")
                  .map((s) => s.trim().toLowerCase())
                  .filter((s) => s.length !== 0),
              })
              break
            case Compare["<>"]:
            case Compare["="]:
            case Compare[">="]:
              qb.andWhere(
                `LOWER(CAST(${filterField} as text)) ${comparison} LOWER(:${whereParameterName})`,
                {
                  [whereParameterName]: filterValue,
                }
              )
              break
            case Compare.NA:
              // If we're here, it's because we expected this filter to be handled by a custom filter handler
              // that ignores the $comparison param, but it was not.
              throw new HttpException(
                `Filter "${filterType}" expected to be handled by a custom filter handler, but one was not implemented.`,
                HttpStatus.NOT_IMPLEMENTED
              )
            default:
              throw new HttpException("Comparison Not Implemented", HttpStatus.NOT_IMPLEMENTED)
          }
        })
      }
    }
  }
}
