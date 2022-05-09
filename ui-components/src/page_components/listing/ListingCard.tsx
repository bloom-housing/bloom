import * as React from "react"
import { ImageCard, ImageCardProps, ImageTag } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import { Heading, HeaderType } from "../../headers/Heading"
import { Tag } from "../../text/Tag"
import { AppearanceStyleType } from "../../global/AppearanceTypes"
import { Icon, IconFillColors } from "../../icons/Icon"
import "./ListingCard.scss"

interface ListingCardTableProps extends StandardTableProps, StackedTableProps {}

export interface CardHeader {
  customClass?: string
  text: string
}

export interface FooterButton {
  href: string
  text: string
}

export interface ListingCardContentProps {
  contentHeader?: CardHeader
  contentSubheader?: CardHeader
  tableHeader?: CardHeader
  tableSubheader?: CardHeader
}
export interface ListingCardProps {
  cardTags?: ImageTag[]
  children?: React.ReactElement
  contentProps?: ListingCardContentProps
  footerButtons?: FooterButton[]
  footerContainerClass?: string
  footerContent?: React.ReactNode
  imageCardProps: ImageCardProps
  stackedTable?: boolean
  tableProps?: ListingCardTableProps
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
    header: CardHeader | undefined,
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
        {cardTags && cardTags?.length > 0 && (
          <div className={"inline-flex flex-wrap justify-start w-full"}>
            {cardTags?.map((cardTag, index) => {
              return (
                <Tag
                  styleType={AppearanceStyleType.accentLight}
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
          {getHeader(contentProps?.tableHeader, 4, "tableHeader")}
          {getHeader(contentProps?.tableSubheader, 5, "tableSubheader")}
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
        <div>{getContentHeader()}</div>
        {getContent()}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
