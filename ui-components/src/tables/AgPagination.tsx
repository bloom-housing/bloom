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
    <div className="data-pager flex flex-col md:flex-row">
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
          <span className="field-label" id="lbTotalPages">
            {totalItems}
          </span>
          {quantityLabel && <span className="field-label">{quantityLabel}</span>}
        </div>

        <div className="flex mt-5 md:mt-0 md:items-center">
          <div className="field data-pager__control md:mb-0">
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
          </div>

          <div className="field data-pager__control">
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
          </div>
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
          disabled={totalPages === currentPage || totalPages === 0}
        >
          {t("t.next")}
        </Button>
      </div>
    </div>
  )
}

export { AgPagination as default, AgPagination, AG_PER_PAGE_OPTIONS }
