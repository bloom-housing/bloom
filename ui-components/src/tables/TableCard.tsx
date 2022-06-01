import React from "react"
import { Heading } from "../headers/Heading"
import { Button } from "../actions/Button"
import { t } from "../helpers/translator"
import "./TableCard.scss"

export interface TableCardProps {
  title: string
  children?: React.ReactNode
  elementsQty: number // to show/hide an empty state
  onAddClick: () => void
}

const TableCard = ({ title, children, elementsQty, onAddClick }: TableCardProps) => {
  return (
    <div className="table-card">
      <div className="table-card__inner">
        <Heading className="table-card__title" priority={3}>
          {title}
        </Heading>

        {(() => {
          if (!elementsQty || elementsQty === 0)
            return <div className="table-card__blank">{t("t.addItemsToEdit")}</div>

          return children
        })()}
      </div>

      <div className="table-card__footer">
        <Button type="button" onClick={onAddClick} data-test-id="table-card-btn-add">
          {t("t.addItem")}
        </Button>
      </div>
    </div>
  )
}

export { TableCard as default, TableCard }
