import * as React from "react"
import { ImageCard, ImageCardProps, ImageTag } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import Heading from "../../headers/Heading"
import { Tag } from "../../text/Tag"

import "./ListingCard.scss"
import { AppearanceStyleType } from "../../global/AppearanceTypes"
import { Icon, IconFillColors } from "../../icons/Icon"

interface ListingCardTableProps extends StandardTableProps, StackedTableProps {}

export interface CardHeader {
  text: string
  customClass?: string
}

export interface FooterButton {
  text: string
  href: string
}

export interface ListingCardContentProps {
  contentHeader?: CardHeader
  contentSubheader?: CardHeader
  tableHeader?: CardHeader
  tableSubheader?: CardHeader
}
export interface ListingCardProps {
  children?: React.ReactElement
  footerButtons?: FooterButton[]
  footerContent?: React.ReactNode
  footerContainerClass?: string
  imageCardProps: ImageCardProps
  cardTags?: ImageTag[]
  stackedTable?: boolean
  contentProps?: ListingCardContentProps
  tableProps?: ListingCardTableProps
}

/**
 * @component ListingCard
 *
 * A component that renders an image with optional status bars below it,
 * and a content section associated with the image which can include titles, a table, and custom content
 *
 * @prop children - Custom content rendered in the content section above the table
 * @prop footerButtons - A list of buttons to render in the footer of the content section
 * @prop footerContainerClass - A class name applied to the footer container of the content section
 * @prop imageCardProps - Prop interface for the ImageCard component
 * @prop stackedTable - Toggles on the StackedTable component in place of the default StandardTable component - they are functionally equivalent with differing UIs
 * @prop contentProps - An object containing fields that render optional headers above the content section's table
 * @prop tableProps - Prop interface for the StandardTable and StackedTable components
 *
 */
const ListingCard = (props: ListingCardProps) => {
  const { imageCardProps, tableProps, contentProps, children } = props

  const getHeader = (header: CardHeader | undefined, priority: number, defaultClass?: string) => {
    if (header && header.text) {
      return (
        <Heading priority={priority} className={`${defaultClass} ${header.customClass}`}>
          {header.text}
        </Heading>
      )
    } else {
      return <></>
    }
  }

  const getContentHeader = () => {
    return (
      <>
        {getHeader(contentProps?.contentHeader, 2, "listings-content_header")}
        {getHeader(contentProps?.contentSubheader, 3, "listings-content_subheader")}
        <div className={"inline-flex flex-wrap md:justify-start justify-center w-full"}>
          {props.cardTags?.map((cardTag) => {
            return (
              <Tag styleType={AppearanceStyleType.warning} className={"mr-2 mb-2"}>
                {cardTag.iconType && (
                  <Icon
                    size={"medium"}
                    symbol={cardTag.iconType}
                    fill={cardTag.iconColor ?? IconFillColors.primary}
                    className={"mr-2"}
                  />
                )}
                {cardTag.text}
              </Tag>
            )
          })}
        </div>
      </>
    )
  }

  const getContent = () => {
    return (
      <>
        <div className="listings-row_table">
          {getHeader(contentProps?.tableHeader, 4, "listings-table_header")}
          {getHeader(contentProps?.tableHeader, 5, "listings-table_subheader")}
          {children && children}
          {tableProps && (tableProps.data || tableProps.stackedData) && (
            <>
              {props.stackedTable ? (
                <StackedTable {...(tableProps as StackedTableProps)} />
              ) : (
                <StandardTable {...(tableProps as StandardTableProps)} />
              )}
            </>
          )}
        </div>
        <div className={"flex flex-col"}>
          {props.footerContent && props.footerContent}
          {props.footerButtons && props.footerButtons?.length > 0 && (
            <div className={props.footerContainerClass ?? "listings-row_footer"}>
              {props.footerButtons?.map((footerButton) => {
                return <LinkButton href={footerButton.href}>{footerButton.text}</LinkButton>
              })}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <article className="listings-row" data-test-id={"listing-card-component"}>
      <div className={"block md:hidden w-full flex flex-col items-center"}>
        {getContentHeader()}
      </div>
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        <div className={"hidden md:block"}>{getContentHeader()}</div>
        {getContent()}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
