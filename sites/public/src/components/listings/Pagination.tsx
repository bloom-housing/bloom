import React from "react"
import {
  AppearanceSizeType,
  Button,
  ButtonGroup,
  ButtonGroupSpacing,
} from "@bloom-housing/doorway-ui-components"
import { t, AppearanceStyleType } from "@bloom-housing/ui-components"
import { Icon } from "@bloom-housing/ui-seeds"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon"

type PaginationProps = {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function Pagination(props: PaginationProps) {
  // Max number of numbered page buttons to show
  const maxPageCount = 4
  // The number of pages we're actually going to show based on the number available
  const pagesToShow = Math.min(maxPageCount, props.lastPage)

  // Find the midpoint
  const middle = Math.floor(pagesToShow / 2)

  const pagesBefore = Math.max(
    // See how close we are to the beginning
    Math.min(
      // Are we closer to the first page?
      props.currentPage - 1,
      // Or the middle?
      middle
    ),
    // Now see how close we are to the end
    props.currentPage - props.lastPage + pagesToShow - 1,

    // No negative values
    0
  )

  // Whatever isn't on the left is on the right, except for the current page
  const pagesAfter = pagesToShow - pagesBefore - 1

  const firstPageToShow = props.currentPage - pagesBefore
  const lastPageToShow = props.currentPage + pagesAfter

  const canNavBackward = props.currentPage > 1
  const canNavForward = props.currentPage < props.lastPage
  const pageButtons = []

  for (let i = firstPageToShow; i <= lastPageToShow; i++) {
    const isCurrent = i == props.currentPage

    // only set an onclick handler if not the current page
    const onClick = isCurrent ? null : () => setPage(i)
    const styleType = isCurrent ? AppearanceStyleType.primary : null

    pageButtons.push(
      <Button
        styleType={styleType}
        onClick={onClick}
        size={AppearanceSizeType.small}
        id={`pagination-${i}`}
      >
        {i}
      </Button>
    )
  }

  const setPage = (page: number) => {
    props.onPageChange(page)
  }

  // border={{borderRadius: "var(--bloom-rounded-full)"}}
  // className={styles["pagination"]}
  // size={AppearanceSizeType.small}

  if (props.lastPage === 1) return <></>

  let buttonColumns = []

  if (canNavBackward) {
    buttonColumns.push(
      <Button
        disabled={!canNavBackward}
        onClick={() => setPage(props.currentPage - 1)}
        ariaLabel={t("t.previous")}
        size={AppearanceSizeType.small}
      >
        <Icon size="md" className="-m-1">
          <ChevronLeftIcon />
        </Icon>
      </Button>
    )
  }

  buttonColumns = [...buttonColumns, ...pageButtons]

  if (canNavForward) {
    buttonColumns.push(
      <Button
        disabled={!canNavForward}
        onClick={() => setPage(props.currentPage + 1)}
        ariaLabel={t("t.next")}
        size={AppearanceSizeType.small}
      >
        <Icon size="md" className="-m-1">
          <ChevronRightIcon />
        </Icon>
      </Button>
    )
  }

  return (
    <section aria-label={"Listings list pagination"}>
      <ButtonGroup
        spacing={ButtonGroupSpacing.even}
        pagination={true}
        columns={buttonColumns}
        className={"pagination-button-group"}
      />
    </section>
  )
}
