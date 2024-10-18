import React, { useContext, useEffect, useState } from "react"
import {
  Heading,
  AppearanceStyleType,
  StandardTableProps,
  HeaderType,
  Icon,
  IconFillColors,
  LinkButton,
  StackedTableProps,
  Tag,
} from "@bloom-housing/ui-components"
import { ImageCard, ImageCardProps, ImageTag } from "../../blocks/ImageCard"
import { AppearanceShadeType } from "../../global/AppearanceTypes"
import "./ListingCard.scss"
import { NavigationContext } from "../../config/NavigationContext"
import { DoorwayListingTable } from "./DoorwayListingTable"

interface ListingCardTableProps extends StandardTableProps, StackedTableProps {}

export interface ListingCardHeader {
  content: string | React.ReactNode
  href?: string
  customClass?: string
  styleType?: AppearanceStyleType
  isPillType?: boolean
  priority?: number
  makeCardClickable?: boolean
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

export interface CardTag extends ImageTag {
  shadeType?: AppearanceShadeType
}

export interface ListingCardProps {
  /** A list of tags to be rendered below the content header, a Tag component is rendered for each */
  cardTags?: CardTag[]
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
  /** Prop for some text to go above the header */
  preheader?: string
  /** Toggles on the StackedTable component in place of the default StandardTable component - they are functionally equivalent with differing UIs */
  stackedTable?: boolean
  /** Prop interface for the StandardTable and StackedTable components */
  tableProps?: ListingCardTableProps
  /** Override for the minimum width for the desktop layout */
  desktopMinWidth?: number
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
  const linkRef = React.useRef<HTMLAnchorElement>(null)
  const simulateLinkClick = () => {
    if (linkRef.current) {
      linkRef.current.click()
    }
  }

  const [isDesktop, setIsDesktop] = useState(true)

  const DESKTOP_MIN_WIDTH = props.desktopMinWidth || 767 // @screen md
  useEffect(() => {
    if (window.innerWidth > DESKTOP_MIN_WIDTH) {
      setIsDesktop(true)
    } else {
      setIsDesktop(false)
    }

    const updateMedia = () => {
      if (window.innerWidth > DESKTOP_MIN_WIDTH) {
        setIsDesktop(true)
      } else {
        setIsDesktop(false)
      }
    }
    window.addEventListener("resize", updateMedia)
    return () => window.removeEventListener("resize", updateMedia)
  }, [DESKTOP_MIN_WIDTH])

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
        <Heading priority={priority} styleType={styleType} className={customClass}>
          {header.href ? (
            <LinkComponent className="is-card-link" href={header.href} linkref={linkRef}>
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
        {contentProps?.contentHeader &&
          getHeader(
            contentProps?.contentHeader,
            contentProps?.contentHeader?.priority ?? 2,
            "largePrimary",
            "order-1"
          )}
        {contentProps?.contentSubheader && (
          <p className="card-subheader order-2 font-serif">
            {contentProps?.contentSubheader?.content}
          </p>
        )}

        {cardTags && cardTags?.length > 0 && (
          <div className="listings-row_tags">
            {cardTags?.map((cardTag, index) => {
              return (
                <Tag
                  styleType={cardTag.styleType ?? AppearanceStyleType.warning}
                  shade={cardTag?.shadeType}
                  key={index}
                >
                  {cardTag.iconType && (
                    <Icon
                      size={"medium"}
                      symbol={cardTag.iconType}
                      fill={cardTag.iconColor ?? IconFillColors.primary}
                      className={"listing-card__tag-icon"}
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
          <div className={"listings-row_headers"}>
            {contentProps?.tableHeader &&
              getHeader(
                contentProps?.tableHeader,
                contentProps?.tableHeader?.priority ?? 3,
                "smallWeighted"
              )}
            {contentProps?.tableSubheader?.content && (
              <p className="text__small-normal">{contentProps?.tableSubheader?.content}</p>
            )}
          </div>
          {children && children}
          <hr></hr>
          {tableProps?.data && tableProps?.headers && (
            <DoorwayListingTable data={tableProps?.data} headers={tableProps?.headers} />
          )}
        </div>
        {isDesktop && getContentFooter()}
      </>
    )
  }

  const getContentFooter = () => {
    return (
      <>
        {footerContent && footerContent}
        {footerButtons && footerButtons?.length > 0 && (
          <div className={footerContainerClass ?? "listings-row_footer"}>
            {footerButtons?.map((footerButton, index) => {
              return (
                <LinkButton
                  href={footerButton.href}
                  ariaHidden={footerButton.ariaHidden}
                  key={index}
                  className={"is-secondary doorway-button"}
                >
                  {footerButton.text}
                </LinkButton>
              )
            })}
          </div>
        )}
      </>
    )
  }

  const componentIsClickable =
    contentProps?.contentHeader?.makeCardClickable && contentProps?.contentHeader?.href
  return (
    <article
      className={`listings-row ${componentIsClickable ? "cursor-pointer" : ""}`}
      data-testid={"listing-card-component"}
      onClick={componentIsClickable ? simulateLinkClick : undefined}
    >
      <div className="listings-row_figure">
        <ImageCard {...imageCardProps} />
      </div>
      <div className="listings-row_content">
        {props.preheader && (
          <div className="listings-row_preheader">
            <span className="card-preheader">{props.preheader}</span>
          </div>
        )}
        {getContentHeader()}
        {getContent()}
      </div>
      {!isDesktop && <div className={"listings-row_footer_container"}>{getContentFooter()}</div>}
    </article>
  )
}

export { ListingCard as default, ListingCard }
