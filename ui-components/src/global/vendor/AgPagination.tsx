import React from "react"
import { Button, t } from "@bloom-housing/ui-components"

type AgPaginationProps = {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
  sticky?: boolean
  quantityLabel: string
  setCurrentPage: React.Dispatch<React.SetStateAction<number>> | ((page: number) => void)
  setItemsPerPage?: React.Dispatch<React.SetStateAction<number>>
  onPageChange?: (page: number) => void
  onPerPageChange?: (size: number) => void
  includeBorder?: boolean
  matchListingCardWidth?: boolean
}

const AG_PER_PAGE_OPTIONS = [8, 100, 500, 1000]

const AgPagination = ({
  totalItems,
  totalPages,
  currentPage,
  sticky,
  quantityLabel,
  setCurrentPage,
  onPageChange,
  includeBorder,
  matchListingCardWidth,
}: AgPaginationProps) => {
  const onNextClick = () => {
    setCurrentPage(currentPage + 1)
    onPageChange && onPageChange(currentPage)
  }

  const onPrevClick = () => {
    let pageNumber = currentPage - 1
    if (pageNumber > totalPages) {
      // Go to the last page if we've gotten to a nonexistant page and click back.
      pageNumber = totalPages
    }
    setCurrentPage(pageNumber)
    onPageChange && onPageChange(currentPage)
  }

  const dataPagerContainerClassName = ["data-pager-container"]
  if (sticky) {
    dataPagerContainerClassName.push("sticky")
  }
  if (includeBorder) {
    dataPagerContainerClassName.push("include-border")
  }

  const dataPagerClassName = ["data-pager"]
  if (matchListingCardWidth) {
    dataPagerClassName.push("match-listing-card-width")
  }

  return (
    <div className={dataPagerContainerClassName.join(" ")}>
      <div className={dataPagerClassName.join(" ")}>
        <div className="hidden md:block">
          <Button
            className="data-pager__previous data-pager__control"
            onClick={onPrevClick}
            disabled={currentPage === 1}
          >
            {t("t.previous")}
          </Button>
        </div>

        <div className="data-pager__control-group ml-0 md:ml-auto w-full md:w-auto md:flex md:items-center">
          <div className="data-pager__control">
            <span className="field-label">
              <strong>
                Page {currentPage} of {totalPages}
              </strong>
            </span>
            <span className="field-label">
              ({totalItems} {quantityLabel})
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-between mt-5 md:mt-0 ">
          <div className="md:hidden">
            <Button
              className="data-pager__previous data-pager__control"
              onClick={onPrevClick}
              disabled={currentPage === 1}
            >
              {t("t.previous")}
            </Button>
          </div>

          <Button
            className="data-pager__next data-pager__control"
            onClick={onNextClick}
            disabled={totalPages <= currentPage || totalPages === 0}
          >
            {t("t.next")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { AgPagination as default, AgPagination, AG_PER_PAGE_OPTIONS }
