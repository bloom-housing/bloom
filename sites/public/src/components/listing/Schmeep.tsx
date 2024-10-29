import * as React from "react"

export interface OrdinalListItemLink {
  title: string
  url: string
  ariaLabel?: string
}

export interface OrdinalListItemProps {
  index: number
  children: React.ReactNode
  className?: string
}

export interface OrdinalListItemSectionProps {
  text: string
  className?: string
}

export interface OrdinalListItemOrdinalProps {
  showOrdinalSection: boolean
  ordinal: number
  ordinalSuffix: string
  className?: string
}

export interface OrdinalListItemLinksProps {
  links: OrdinalListItemLink[]
  className?: string
}

export const OrdinalListItemTitle = (props: OrdinalListItemSectionProps) => {
  const classNames = ["info-card__title"]
  if (props.className) {
    classNames.push(props.className)
  }
  return <h4 className={classNames.join(" ")}>{props.text}</h4>
}

export const OrdinalListItemDescription = (props: OrdinalListItemSectionProps) => {
  if (!props.text) {
    return null
  }
  const classNames = ["preferences-list__description"]
  if (props.className) {
    classNames.push(props.className)
  }
  return <div className={classNames.join(" ")}>{props.text}</div>
}

export const OrdinalListItemLinks = (props: OrdinalListItemLinksProps) => {
  if (!props.links) {
    return null
  }
  const classNames = ["preferences-list__links"]
  if (props.className) {
    classNames.push(props.className)
  }
  return (
    <div className={classNames.join(" ")}>
      {props.links.map((link: OrdinalListItemLink, linkIndex: number) => (
        <span key={linkIndex}>
          <a href={link.url} target="_blank" aria-label={link.ariaLabel}>
            {link.title}
          </a>
        </span>
      ))}
    </div>
  )
}

export const OrdinalListItemOrdinal = (props: OrdinalListItemOrdinalProps) => {
  if (!props.showOrdinalSection) {
    return null
  }
  const classNames = ["preferences-list__number"]
  if (props.className) {
    classNames.push(props.className)
  }
  return (
    <div className={classNames.join(" ")}>
      {props.ordinal}
      <sup>{props.ordinal && props.ordinalSuffix ? props.ordinalSuffix : ""}</sup>
    </div>
  )
}

export const OrdinalListItem = (props: OrdinalListItemProps) => {
  const classNames = ["preferences-list__item", "info-card"]

  if (props.className) {
    classNames.push(props.className)
  }
  return (
    <li key={props.index} className={classNames.join(" ")}>
      {props.children}
    </li>
  )
}

export interface OrdinalListProps {
  children: React.ReactNode
}

export const OrdinalList = (props: OrdinalListProps) => {
  return <ol className="preferences-list">{props.children}</ol>
}
