import React from "react"

import styles from "./HeroDeprecated.module.scss"

const PageHeroHeader = (props) => {
  return <header className={styles["page-hero-header"]}>{props.children}</header>
}

const PageHeroActions = (props) => {
  return <div className={styles["page-hero-actions"]}>{props.children}</div>
}

const PageHero = (props) => {
  return (
    <div id="hero-component" className={styles["page-hero"]}>
      <section>{props.children}</section>
    </div>
  )
}

PageHero.Header = PageHeroHeader
PageHero.Actions = PageHeroActions

export default PageHero
