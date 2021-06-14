import { WhereExpression } from "typeorm"

export type Operators = "=" | "<>"

interface Filter {
  [key: string]: {
    [operator in Operators]?: unknown
  }
}

/**
 *
 * @param filter
 * @param qb
 */
/**
 * This is super simple right now, but we can expand to include complex filter with ands, ors, more than one schema, etc
 */
export default function addFilter(filter: Filter, schema: string, qb: WhereExpression): void {
  const mainOperator = "andWhere"

  for (const key in filter) {
    const operator = Object.keys(filter[key])[0]
    const value = filter[key][operator]
    qb[mainOperator](`${schema}.${key} ${operator} :${key}`, {
      [key]: value,
    })
  }
}
