import React from "react"
import { Heading, Icon } from "@bloom-housing/ui-seeds"
import HomeIcon from "@heroicons/react/24/solid/HomeModernIcon"
import styles from "./SiteHeader.module.scss"

interface LinkButtonProps {
  label: string
  onClicK: () => void
}

const LinkButton = (props: LinkButtonProps) => {
  return (
    <button className={styles["link"]} onClick={props.onClicK}>
      {props.label}
    </button>
  )
}

interface LanguageButtonProps {
  label: string
  onClicK: () => void
}

const LanguageButton = (props: LinkButtonProps) => {
  return (
    <button className={styles["language"]} onClick={props.onClicK}>
      {props.label}
    </button>
  )
}

interface HeadingWrapperProps {
  children: React.ReactNode
  className?: string
}

const HeadingWrapper = (props: HeadingWrapperProps) => {
  return (
    <div className={`${styles["header-container"]} ${props.className ? props.className : ""}`}>
      <div className={styles["header-wrapper"]}>
        <div className={styles["content"]}>{props.children}</div>
      </div>
    </div>
  )
}

export type Language = {
  label: string
  onClick: () => void
  active: boolean
}

interface SiteHeaderProps {
  title: string
  languages: Language[]
}

export const SiteHeader = (props: SiteHeaderProps) => {
  return (
    <div className={styles["site-header-container"]}>
      <HeadingWrapper className={styles["language-wrapper"]}>
        <div className={styles["language-container"]}>
          <LanguageButton label={"LanguageA"} onClicK={() => alert("LanguageA")} />
          <LanguageButton label={"LanguageB"} onClicK={() => alert("LanguageB")} />
          <LanguageButton label={"LanguageC"} onClicK={() => alert("LanguageC")} />
        </div>
      </HeadingWrapper>
      <HeadingWrapper className={styles["message-wrapper"]}>
        <div className={styles["message-container"]}>Message</div>
      </HeadingWrapper>
      <HeadingWrapper className={styles["navigation-wrapper"]}>
        <div className={styles["navigation-container"]}>
          <div className={styles["title-container"]}>
            <div className={styles["icon"]}>
              <Icon size={"xl"}>
                <HomeIcon />
              </Icon>
            </div>
            <div className={styles["title"]}>
              <Heading size={"xl"}>{props.title}</Heading>
            </div>
          </div>
          <div className={styles["links-container"]}>
            <LinkButton label={"LinkA"} onClicK={() => alert("LinkA")} />
            <LinkButton label={"LinkB"} onClicK={() => alert("LinkB")} />
            <LinkButton label={"LinkC"} onClicK={() => alert("LinkC")} />
          </div>
        </div>
      </HeadingWrapper>
    </div>
  )
}
