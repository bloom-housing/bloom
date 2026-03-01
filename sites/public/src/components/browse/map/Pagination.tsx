import React from "react"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import styles from "./Pagination.module.scss"

type PaginationProps = {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function Pagination(props: PaginationProps) {
  const canNavBackward = props.currentPage > 1
  const canNavForward = props.currentPage < props.lastPage
  const pageButtons = []

  const siblingCount = 1

  // Keep pagination focus in the listings pane by scrolling the list containers,
  // with a window fallback for layouts where those containers are not present
  const scrollListingsToTop = () => {
    const scrollTargets = [
      document.getElementById("listings-list-expanded"),
      document.getElementById("listings-list"),
      document.getElementById("listings-outer-container"),
    ]

    let didScroll = false
    scrollTargets.forEach((target) => {
      if (!target) return
      target.scrollTo({ top: 0 })
      didScroll = true
    })

    if (!didScroll) {
      window.scrollTo({ top: 0 })
    }
  }

  const setPage = (page: number) => {
    scrollListingsToTop()
    props.onPageChange(page)
  }

  const renderPageButton = (pageNumber: number) => {
    const isCurrent = pageNumber === props.currentPage
    return (
      <Button
        key={`pagination-${pageNumber}`}
        variant={isCurrent ? "primary" : "primary-outlined"}
        onClick={isCurrent ? undefined : () => setPage(pageNumber)}
        id={`pagination-${pageNumber}`}
        size={"sm"}
        className={styles["circle-button"]}
        aria-current={isCurrent ? "page" : undefined}
        ariaLabel={isCurrent ? `Current page, ${pageNumber}` : `Go to page ${pageNumber}`}
      >
        {pageNumber}
      </Button>
    )
  }

  const shouldShowSimplePagination = props.lastPage <= 7

  if (shouldShowSimplePagination) {
    for (let page = 1; page <= props.lastPage; page++) {
      pageButtons.push(renderPageButton(page))
    }
  } else {
    const windowStart = Math.max(2, props.currentPage - siblingCount)
    const windowEnd = Math.min(props.lastPage - 1, props.currentPage + siblingCount)

    pageButtons.push(renderPageButton(1))

    if (windowStart > 2) {
      pageButtons.push(
        <span key="pagination-ellipsis-left" aria-hidden="true" className="px-1">
          ...
        </span>
      )
    }

    for (let page = windowStart; page <= windowEnd; page++) {
      pageButtons.push(renderPageButton(page))
    }

    if (windowEnd < props.lastPage - 1) {
      pageButtons.push(
        <span key="pagination-ellipsis-right" aria-hidden="true" className="px-1">
          ...
        </span>
      )
    }

    pageButtons.push(renderPageButton(props.lastPage))
  }

  if (props.lastPage === 1) return <></>

  let buttonColumns = []

  if (canNavBackward) {
    buttonColumns.push(
      <Button
        key="pagination-prev"
        disabled={!canNavBackward}
        onClick={() => setPage(props.currentPage - 1)}
        ariaLabel={t("t.previous")}
        size={"sm"}
        className={styles["circle-button"]}
        variant={"primary-outlined"}
      >
        {"<"}
      </Button>
    )
  }

  buttonColumns = [...buttonColumns, ...pageButtons]

  if (canNavForward) {
    buttonColumns.push(
      <Button
        key="pagination-next"
        disabled={!canNavForward}
        onClick={() => setPage(props.currentPage + 1)}
        ariaLabel={t("t.next")}
        size={"sm"}
        variant={"primary-outlined"}
        className={styles["circle-button"]}
      >
        {">"}
      </Button>
    )
  }

  return (
    <nav aria-label={"Listings list pagination"} className={styles["pagination-container"]}>
      {buttonColumns}
    </nav>
  )
}
