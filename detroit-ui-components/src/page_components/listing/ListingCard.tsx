import * as React from "react"
import { ImageCard, ImageCardProps, ImageTag } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "@bloom-housing/ui-components"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import { HeaderType, Heading } from "../../headers/Heading"
import { Tag } from "../../text/Tag"
import { AppearanceShadeType, AppearanceStyleType } from "../../global/AppearanceTypes"
import { Icon, IconFillColors } from "../../icons/Icon"
import "./ListingCard.scss"

export interface ListingCardHeader {
  customClass?: string
  text: string
}

export interface ListingFooterButton {
  href: string
  text: string
}

export interface ListingCardContentProps {
  contentHeader?: ListingCardHeader
  contentSubheader?: ListingCardHeader
  tableHeader?: ListingCardHeader
  tableSubheader?: ListingCardHeader
}

export interface CardTag extends ImageTag {
  shadeType?: AppearanceShadeType
}

export interface ListingCardProps {
  cardTags?: CardTag[]
  children?: React.ReactElement
  contentProps?: ListingCardContentProps
  footerButtons?: ListingFooterButton[]
  footerContainerClass?: string
  footerContent?: React.ReactNode
  imageCardProps: ImageCardProps
  stackedTable?: boolean
  tableProps?: any
}

/**
 * @component ListingCard
 *
 * A component that renders an image with optional status bars below it,
 * and a content section associated with the image which can include titles, a table, and custom content
 *
 * @prop cardTags -A list of tags to be rendered below the content header, a Tag component is rendered for each
 * @prop children - Custom content rendered in the content section above the table
 * @prop footerButtons - A list of buttons to render in the footer of the content section
 * @prop footerContent - Custom content rendered below the content table
 * @prop footerContainerClass - A class name applied to the footer container of the content section
 * @prop imageCardProps - Prop interface for the ImageCard component
 * @prop stackedTable - Toggles on the StackedTable component in place of the default StandardTable component - they are functionally equivalent with differing UIs
 * @prop contentProps - An object containing fields that render optional headers above the content section's table
 * @prop tableProps - Prop interface for the StandardTable and StackedTable components
 *
 */
const ListingCard = (props: ListingCardProps) => {
  const {
    cardTags,
    children,
    footerButtons,
    footerContent,
    footerContainerClass,
    imageCardProps,
    stackedTable,
    contentProps,
    tableProps,
  } = props

  const getHeader = (
    header: ListingCardHeader | undefined,
    priority: number,
    style?: HeaderType,
    customClass?: string
  ) => {
    if (header && header.text) {
      return (
        <Heading priority={priority} style={style} className={customClass}>
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
        {getHeader(contentProps?.contentHeader, 2, "cardHeader", "order-1")}
        {getHeader(contentProps?.contentSubheader, 3, "cardSubheader", "order-2")}
      </>
    )
  }
  const getContent = () => {
    return (
      <>
        <div className="listings-row_table">
          {(contentProps?.tableHeader?.text || contentProps?.tableSubheader?.text) &&
            (contentProps.contentHeader?.text || contentProps?.contentSubheader?.text) && (
              <hr className={"mb-2"} />
            )}
          <div className={"listings-row_headers"}>
            {getHeader(contentProps?.tableHeader, 4, "tableHeader")}
            {getHeader(contentProps?.tableSubheader, 5, "tableSubheader")}
            {cardTags && cardTags?.length > 0 && (
              <div className={"inline-flex flex-wrap justify-start w-full"}>
                {cardTags?.map((cardTag, index) => {
                  return (
                    <Tag
                      styleType={cardTag.styleType ?? AppearanceStyleType.accentLight}
                      shade={cardTag?.shadeType}
                      className={"me-2 mb-2 font-bold px-3 py-2"}
                      key={index}
                    >
                      {cardTag.iconType && (
                        <Icon
                          size={"medium"}
                          symbol={cardTag.iconType}
                          fill={cardTag.iconColor ?? IconFillColors.primary}
                          className={"me-2"}
                        />
                      )}
                      {cardTag.text}
                    </Tag>
                  )
                })}
              </div>
            )}
          </div>
          {children && children}
          {tableProps && (tableProps.data || tableProps.stackedData) && (
            <>
              {stackedTable ? (
                <StackedTable {...(tableProps as StackedTableProps)} />
              ) : (
                <StandardTable {...(tableProps as StandardTableProps)} />
              )}
            </>
          )}
        </div>
        <div className={"listings-row_footer_container"}>
          {footerContent && footerContent}
          {footerButtons && footerButtons?.length > 0 && (
            <div className={footerContainerClass ?? "listings-row_footer"}>
              {footerButtons?.map((footerButton, index) => {
                return (
                  <LinkButton href={footerButton.href} key={index}>
                    {footerButton.text}
                  </LinkButton>
                )
              })}
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <article className="listings-row" data-test-id={"listing-card-component"}>
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        <div className={"listings-row_headers"}>{getContentHeader()}</div>
        {getContent()}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
