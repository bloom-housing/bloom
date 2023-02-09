import { debounce } from "@bloom-housing/ui-components"
import { Button } from "../../../detroit-ui-components/src/actions/Button"
import { Icon, IconTypes } from "../../../detroit-ui-components/src/icons/Icon"
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

function isRtl(): boolean {
  return getComputedStyle(document.body).direction == "rtl"
}

const HorizontalScrollSection = (props: HorizontalScrollSectionProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const leftButtonClick = () => {
    scrollContainerRef.current.scrollBy({
      left: -props.scrollAmount,
      top: 0,
      behavior: "smooth",
    })
  }

  const rightButtonClick = () => {
    scrollContainerRef.current.scrollBy({
      left: props.scrollAmount,
      top: 0,
      behavior: "smooth",
    })
  }

  const setButtonState = () => {
    const scrollLeft = scrollContainerRef.current?.scrollLeft
    const scrollWidth = scrollContainerRef.current?.scrollWidth
    const clientWidth = scrollContainerRef.current?.clientWidth

    const scrollStart = isRtl() ? -scrollLeft : scrollLeft
    const scrollEnd = scrollWidth - clientWidth + (isRtl() ? scrollLeft : -scrollLeft)
    setCanScrollLeft(isRtl() ? scrollEnd > 0 : scrollStart > 0)
    setCanScrollRight(isRtl() ? scrollStart > 0 : scrollEnd > 0)
  }

  const debounceSetButtonState = debounce(setButtonState, 100)
  let observer: MutationObserver

  useEffect(() => {
    window.addEventListener("resize", debounceSetButtonState)
    observer = new MutationObserver(() => {
      setButtonState()
    })
    observer.observe(document.body, { attributes: true })
    // Set the initial state incase window is wide enough to not have any scrolling
    setButtonState()

    // Cleanup
    return () => {
      window.removeEventListener("resize", debounceSetButtonState)
      observer.disconnect()
    }
  })

  return (
    <section className={props.className}>
      <div className={styles.title}>
        {props.icon && (
          <Icon size="xlarge" symbol={props.icon} className={styles.icon} ariaHidden={true} />
        )}
        <h2 className={`${styles.title__text} ${props.icon ? styles["icon-space"] : ""}`}>
          {props.title}
        </h2>
        <div className={styles.controls_container}>
          <Button
            unstyled={true}
            className={styles.title__button}
            onClick={leftButtonClick}
            disabled={!canScrollLeft}
            ariaLabel="Scroll left"
          >
            <Icon size="medium" symbol="left" />
          </Button>
          <Button
            unstyled={true}
            className={styles.title__button}
            onClick={rightButtonClick}
            disabled={!canScrollRight}
            ariaLabel="Scroll right"
          >
            <Icon size="medium" symbol="right" />
          </Button>
        </div>
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
