import React from "react"
import { Button, t } from "@bloom-housing/ui-components"

type AgPaginationProps = {
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
  quantityLabel?: string
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>
  onPageChange?: (page: number) => void
  onPerPageChange?: (size: number) => void
}

const AG_PER_PAGE_OPTIONS = [8, 100, 500, 1000]

const AgPagination = ({
  totalItems,
  totalPages,
  currentPage,
  itemsPerPage,
  quantityLabel,
  setCurrentPage,
  setItemsPerPage,
  onPageChange,
  onPerPageChange,
}: AgPaginationProps) => {
  const onNextClick = () => {
    setCurrentPage(currentPage + 1)
    onPageChange && onPageChange(currentPage)
  }

  const onPrevClick = () => {
    setCurrentPage(currentPage - 1)
    onPageChange && onPageChange(currentPage)
  }

  const onRowLimitChange = (size: string) => {
    setItemsPerPage(parseInt(size))
    onPerPageChange && onPerPageChange(itemsPerPage)
  }

  return (
    <div className="data-pager">
      <Button
        className="data-pager__previous data-pager__control"
        onClick={onPrevClick}
        disabled={currentPage === 1}
      >
        {t("t.previous")}
      </Button>

      <div className="data-pager__control-group">
        <span className="data-pager__control">
          <span className="field-label" id="lbTotalPages">
            {totalItems}
          </span>
          {quantityLabel && <span className="field-label">{quantityLabel}</span>}
        </span>

        <span className="field data-pager__control">
          <label className="field-label font-sans" htmlFor="page-size">
            {t("t.show")}
          </label>
          <select
            name="page-size"
            id="page-size"
            value={itemsPerPage}
            onChange={({ target }) => onRowLimitChange(target.value)}
          >
            {AG_PER_PAGE_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </span>

        <span className="field data-pager__control">
          <label className="field-label font-sans" htmlFor="page-jump">
            {t("t.jumpTo")}
          </label>
          <select
            name="page-jump"
            id="page-jump"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setCurrentPage(parseInt(e.target.value))
            }
            value={currentPage}
          >
            {Array(totalPages)
              .fill(totalPages)
              .map((_, i) => {
                const value = i + 1
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                )
              })}
          </select>
        </span>
      </div>

      <Button
        className="data-pager__next data-pager__control"
        onClick={onNextClick}
        disabled={totalPages === currentPage}
      >
        {t("t.next")}
      </Button>
    </div>
  )
}

export { AgPagination as default, AgPagination, AG_PER_PAGE_OPTIONS }
