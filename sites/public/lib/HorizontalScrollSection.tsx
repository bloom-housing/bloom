import { Button, debounce } from "@bloom-housing/ui-components"
import { Icon, IconTypes } from "@bloom-housing/ui-components/src/icons/Icon"
import React, { useEffect, useState } from "react"
import styles from "../lib/HorizontalScrollSection.module.scss"

export interface HorizontalScrollSectionProps {
  title: string
  scrollAmount: number
  children: React.ReactNode
  subtitle?: string
  className?: string
  icon?: IconTypes
}

const HorizontalScrollSection = (props: HorizontalScrollSectionProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const leftButtonClick = () => {
    scrollContainerRef.current.scrollBy({
      left: -1 * props.scrollAmount,
      top: 0,
      behavior: "smooth",
    })
  }

  const rightButtonClick = () => {
    scrollContainerRef.current.scrollBy({ left: props.scrollAmount, top: 0, behavior: "smooth" })
  }

  const setButtonState = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setCanScrollLeft(scrollLeft > 0)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
  }

  const debounceSetButtonState = debounce(setButtonState, 100)

  useEffect(() => {
    window.addEventListener("resize", debounceSetButtonState)
    // Set the initial state incase window is wide enough to not have any scrolling
    setButtonState()

    // Cleanup
    return () => {
      window.removeEventListener("resize", debounceSetButtonState)
    }
  })

  return (
    <section className={props.className}>
      <div className={styles.title}>
        {props.icon && <Icon size="xlarge" symbol={props.icon} className={styles.icon} />}
        <h2 className={`${styles.title__text} ${props.icon ? styles["icon-space"] : ""}`}>
          {props.title}
        </h2>
        <Button
          unstyled={true}
          className={styles.title__button}
          onClick={leftButtonClick}
          disabled={!canScrollLeft}
        >
          <Icon size="medium" symbol="left" />
        </Button>
        <Button
          unstyled={true}
          className={styles.title__button}
          onClick={rightButtonClick}
          disabled={!canScrollRight}
        >
          <Icon size="medium" symbol="right" />
        </Button>
      </div>
      {props.subtitle && (
        <div className={`${styles.subtitle} ${props.icon ? styles["icon-space"] : ""}`}>
          {props.subtitle}
        </div>
      )}
      <div className={styles.content} ref={scrollContainerRef} onScroll={debounceSetButtonState}>
        {props.children}
      </div>
    </section>
  )
}

export { HorizontalScrollSection as default, HorizontalScrollSection }
