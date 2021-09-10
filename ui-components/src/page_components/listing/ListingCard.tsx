import * as React from "react"
import { ImageCard, ImageCardProps } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { GroupedTable, GroupedTableProps } from "../../tables/GroupedTable"
import { t } from "../../helpers/translator"
import "./ListingCard.scss"

export interface ListingCardProps {
  imageCardProps: ImageCardProps
  seeDetailsLink: string
  tableHeader: string
  tableProps: GroupedTableProps
  detailsLinkClass?: string
}

const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, detailsLinkClass } = props

  return (
    <article className="listings-row">
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        {props.tableHeader && <h4 className="listings-row_title">{props.tableHeader}</h4>}
        <div className="listings-row_table">
          {tableProps.data && <GroupedTable {...tableProps} />}
        </div>
        <LinkButton className={detailsLinkClass} href={props.seeDetailsLink}>
          {t("t.seeDetails")}
        </LinkButton>
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
