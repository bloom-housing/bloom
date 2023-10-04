import * as React from "react"
import { Heading } from "@bloom-housing/ui-components"

export interface QuantityRow {
  amount: number | null
  text: string
  emphasized?: boolean
}

export interface QuantityRowSectionProps {
  /** Any amount of number/text combinations, rendered in a list */
  quantityRows: QuantityRow[]
  strings: {
    sectionTitle: string
    description?: string | React.ReactNode
  }
}

const QuantityRowSection = ({ quantityRows, strings }: QuantityRowSectionProps) => {
  const getRow = (row: QuantityRow) => {
    if (row.amount === null) return null
    return (
      <li
        key={row.text}
        className={`uppercase text-gray-800 ${
          row.emphasized ? "font-bold" : "font-normal"
        } font-alt-sans leading-7`}
      >
        <span className="text-right w-12 inline-block pr-2.5 text-base">{row.amount}</span>
        <span className={"text-xs"}>{row.text}</span>
      </li>
    )
  }

  return (
    <section className="aside-block is-tinted">
      <Heading priority={4} styleType={"capsWeighted"}>
        {strings.sectionTitle}
      </Heading>
      <div>
        {strings.description && (
          <div className="text-sm text-gray-800 pb-3">
            {typeof strings.description === "string" ? (
              <p>{strings.description}</p>
            ) : (
              strings.description
            )}
          </div>
        )}
        {quantityRows.length && <ul>{quantityRows.map((row) => getRow(row))}</ul>}
      </div>
    </section>
  )
}

export { QuantityRowSection as default, QuantityRowSection }
