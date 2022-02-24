import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"

import { t } from "../../helpers/translator"
import "./ListingCard.scss"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"

interface ListingCardTableProps extends StandardTableProps, StackedTableProps {}

export interface ListingCardHeaderProps {
  tableHeader?: string
  tableHeaderClass?: string
  tableSubHeader?: string
  tableSubHeaderClass?: string
  stackedTable?: boolean
}
export interface ListingCardProps {
  imageCardProps: ImageCardProps
  children?: React.ReactElement
  seeDetailsLink?: string
  tableHeaderProps?: ListingCardHeaderProps
  tableProps?: ListingCardTableProps
  detailsLinkClass?: string
}

const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, detailsLinkClass, tableHeaderProps, children } = props

  const tableHeader = () => {
    return (
      <h3
        className={`listings-row_title ${
          tableHeaderProps?.tableHeaderClass && tableHeaderProps?.tableHeaderClass
        }`}
      >
        {tableHeaderProps?.tableHeader}
      </h3>
    )
  }

  const tableSubHeader = () => {
    return (
      <h4
        className={`listings-row_subtitle ${
          tableHeaderProps?.tableSubHeaderClass && tableHeaderProps?.tableSubHeaderClass
        }`}
      >
        {tableHeaderProps?.tableSubHeader}
      </h4>
    )
  }

  return (
    <article className="listings-row" data-test-id={"listing-card-component"}>
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        {tableHeaderProps?.tableHeader && tableHeader()}
        {tableHeaderProps?.tableSubHeader && tableSubHeader()}
        <div className="listings-row_table">
          {children && children}
          {tableProps && (tableProps.data || tableProps.stackedData) && (
            <>
              {tableHeaderProps?.stackedTable ? (
                <StackedTable {...(tableProps as StackedTableProps)} />
              ) : (
                <StandardTable {...(tableProps as StandardTableProps)} />
              )}
            </>
          )}
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
