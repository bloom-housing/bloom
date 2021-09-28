import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { GroupedTable, GroupedTableProps } from "../../tables/GroupedTable"
import { t } from "../../helpers/translator"
import "./ListingCard.scss"

export interface ListingCardHeaderProps {
  tableHeader?: string
  tableHeaderClass?: string
  tableSubHeader?: string
  tableSubHeaderClass?: string
}
export interface ListingCardProps {
  imageCardProps: ImageCardProps
  seeDetailsLink?: string
  tableHeaderProps?: ListingCardHeaderProps
  tableProps: GroupedTableProps
  detailsLinkClass?: string
}

const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, detailsLinkClass, tableHeaderProps } = props

  return (
    <article className="listings-row">
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        {tableHeaderProps?.tableHeader && (
          <h4
            className={`listings-row_title ${
              tableHeaderProps.tableHeaderClass && tableHeaderProps.tableHeaderClass
            }`}
          >
            {tableHeaderProps?.tableHeader}
          </h4>
        )}
        {tableHeaderProps?.tableSubHeader && (
          <h5
            className={`listings-row_subtitle ${
              tableHeaderProps.tableSubHeaderClass && tableHeaderProps.tableSubHeaderClass
            }`}
          >
            {tableHeaderProps?.tableSubHeader}
          </h5>
        )}
        <div className="listings-row_table">
          {tableProps.data && <GroupedTable {...tableProps} />}
        </div>
        {props.seeDetailsLink && (
          <LinkButton className={detailsLinkClass} href={props.seeDetailsLink}>
            {t("t.seeDetails")}
          </LinkButton>
        )}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
