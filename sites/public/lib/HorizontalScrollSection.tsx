import { Button, debounce } from "@bloom-housing/ui-components"
import { Icon, IconTypes } from "@bloom-housing/ui-components/src/icons/Icon"
import React, { useEffect, useState } from "react"

export interface HorizontalScrollSectionProps {
  title: string
  scrollAmount: number
  children: React.ReactNode
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
    scrollContainerRef.current.addEventListener("scroll", debounceSetButtonState)

    // Cleanup
    return () => scrollContainerRef.current.removeEventListener("scroll", debounceSetButtonState)
  })

  return (
    <section className={props.className}>
      <div className="horizontal-scroll__title">
        {props.icon && (
          <Icon size="xlarge" symbol={props.icon} className="horizontal-scroll__icon" />
        )}
        <h2 className="horizontal-scroll__title__text">{props.title}</h2>
        <Button
          unstyled={true}
          className="horizontal-scroll__title__button"
          onClick={leftButtonClick}
          disabled={!canScrollLeft}
        >
          <Icon size="medium" symbol="left" />
        </Button>
        <Button
          unstyled={true}
          className="horizontal-scroll__title__button"
          onClick={rightButtonClick}
          disabled={!canScrollRight}
        >
          <Icon size="medium" symbol="right" />
        </Button>
      </div>
      <div className="horizontal-scroll__content" ref={scrollContainerRef}>
        {props.children}
      </div>
    </section>
  )
}

export { HorizontalScrollSection as default, HorizontalScrollSection }
