import React, { useContext } from "react"
import { ImageCard, ImageCardProps, ImageTag } from "../../blocks/ImageCard"
import { LinkButton } from "../../actions/LinkButton"
import { StackedTable, StackedTableProps } from "../../tables/StackedTable"
import { StandardTable, StandardTableProps } from "../../tables/StandardTable"
import { Heading, HeaderType } from "../../text/Heading"
import { Tag } from "../../text/Tag"
import { AppearanceShadeType, AppearanceStyleType } from "../../global/AppearanceTypes"
import { Icon, IconFillColors } from "../../icons/Icon"
import "./ListingCard.scss"
import { NavigationContext } from "../../config/NavigationContext"

interface ListingCardTableProps extends StandardTableProps, StackedTableProps {}

export interface ListingCardHeader {
  content: string | React.ReactNode
  href?: string
  customClass?: string
  styleType?: AppearanceStyleType
  isPillType?: boolean
}

export interface ListingFooterButton {
  href: string
  text: string
  ariaHidden?: boolean
}

export interface ListingCardContentProps {
  contentHeader?: ListingCardHeader
  contentSubheader?: ListingCardHeader
  tableHeader?: ListingCardHeader
  tableSubheader?: ListingCardHeader
}
export interface ListingCardProps {
  /** A list of tags to be rendered below the content header, a Tag component is rendered for each */
  cardTags?: ImageTag[]
  /** Custom content rendered in the content section above the table */
  children?: React.ReactElement
  /** An object containing fields that render optional headers above the content section's table */
  contentProps?: ListingCardContentProps
  /** A list of buttons to render in the footer of the content section */
  footerButtons?: ListingFooterButton[]
  /** A class name applied to the footer container of the content section */
  footerContainerClass?: string
  /** Custom content rendered below the content table */
  footerContent?: React.ReactNode
  /** Prop interface for the ImageCard component */
  imageCardProps: ImageCardProps
  /** Toggles on the StackedTable component in place of the default StandardTable component - they are functionally equivalent with differing UIs */
  stackedTable?: boolean
  /** Prop interface for the StandardTable and StackedTable components */
  tableProps?: ListingCardTableProps
}

/**
 * @component ListingCard
 *
 * A component that renders an image with optional status bars below it,
 * and a content section associated with the image which can include titles, a table, and custom content
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
  const { LinkComponent } = useContext(NavigationContext)

  const getHeader = (
    header: ListingCardHeader | undefined,
    priority: number,
    styleType?: HeaderType,
    customClass?: string
  ) => {
    if (header && header.content) {
      if (header.isPillType) {
        return (
          <Tag
            className="listings-pill_header"
            pillStyle
            capitalized
            styleType={header.styleType}
            shade={AppearanceShadeType.light}
          >
            {header.content}
          </Tag>
        )
      }
      return (
        <Heading priority={priority} style={styleType} className={customClass}>
          {header.href ? (
            <LinkComponent className="is-card-link" href={header.href}>
              {header.content}
            </LinkComponent>
          ) : (
            header.content
          )}
        </Heading>
      )
    } else {
      return <></>
    }
  }

  const getContentHeader = () => {
    return (
      <div className="listings-row_headers">
        {getHeader(contentProps?.contentHeader, 2, "largePrimary", false, "order-1")}
        {getHeader(contentProps?.contentSubheader, 3, "mediumNormal", false, "order-2")}
        {cardTags && cardTags?.length > 0 && (
          <div className="listings-row_tags">
            {cardTags?.map((cardTag, index) => {
              return (
                <Tag styleType={cardTag.styleType || AppearanceStyleType.warning} key={index}>
                  {cardTag.iconType && (
                    <Icon
                      size={"medium"}
                      symbol={cardTag.iconType}
                      fill={cardTag.iconColor ?? IconFillColors.primary}
                    />
                  )}
                  {cardTag.text}
                </Tag>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const getContent = () => {
    return (
      <>
        <div className="listings-row_table">
          {(contentProps?.tableHeader?.content || contentProps?.tableSubheader?.content) &&
            (contentProps.contentHeader?.content || contentProps?.contentSubheader?.content) && (
              <hr className={"mb-2"} />
            )}
          <div className={"listings-row_headers"}>
            {getHeader(contentProps?.tableHeader, 4, "smallWeighted")}
            {getHeader(contentProps?.tableSubheader, 5, "smallNormal")}
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
        <div className={"flex flex-col"}>
          {footerContent && footerContent}
          {footerButtons && footerButtons?.length > 0 && (
            <div className={footerContainerClass ?? "listings-row_footer"}>
              {footerButtons?.map((footerButton, index) => {
                return (
                  <LinkButton
                    href={footerButton.href}
                    ariaHidden={footerButton.ariaHidden}
                    key={index}
                  >
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
        {getContentHeader()}
        {getContent()}
      </div>
    </article>
  )
}

export { ListingCard as default, ListingCard }
