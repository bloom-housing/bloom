import React, { useState, useCallback, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { AgGridReact } from "ag-grid-react"
import {
  GridOptions,
  ColumnState,
  ColumnApi,
  ColDef,
  ColGroupDef,
  GridApi,
} from "ag-grid-community"
import { AgPagination, AG_PER_PAGE_OPTIONS } from "./AgPagination"
import { LoadingOverlay } from "../overlays/LoadingOverlay"
import { Field } from "../forms/Field"
import { AlertBox } from "../notifications/AlertBox"
import { debounce } from "../helpers/debounce"
import { t } from "../helpers/translator"

export interface ColumnOrder {
  orderBy: string
  orderDir: string
}

export interface AgTableProps {
  className?: string
  config: AgTableConfig
  data: AgTableData
  headerContent?: React.ReactNode
  id: string
  pagination?: AgTablePagination
  search: AgTableSearch
  selectConfig?: AgTableSelectConfig
  sort?: AgTableSort
}

export interface AgTablePagination {
  perPage: number
  setPerPage: React.Dispatch<React.SetStateAction<number>>
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export interface AgTableSelectConfig {
  setGridApi: React.Dispatch<React.SetStateAction<GridApi | null>>
  updateSelectedValues: () => void
}

export interface AgTableConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gridComponents?: { [p: string]: any }
  columns: (ColDef | ColGroupDef)[]
  totalItemsLabel: string
  rowSelection?: boolean
}

export interface AgTableData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]
  loading: boolean
  totalItems: number
  totalPages: number
}

export interface AgTableSearch {
  setSearch: React.Dispatch<React.SetStateAction<string>>
  showSearch?: boolean
}

export interface AgTableSort {
  setSort?: React.Dispatch<React.SetStateAction<ColumnOrder[]>>
}

export const useAgTable = () => {
  const [sortOptions, setSortOptions] = useState<ColumnOrder[]>([])
  const [filterValue, setFilterValue] = useState("")

  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  return {
    filter: {
      filterValue,
      setFilterValue,
    },
    sort: {
      sortOptions,
      setSortOptions,
    },
    pagination: {
      itemsPerPage,
      setItemsPerPage,
      currentPage,
      setCurrentPage,
    },
  }
}

const AgTable = ({
  className,
  config: { gridComponents, columns, totalItemsLabel, rowSelection },
  data,
  headerContent,
  id,
  selectConfig,
  pagination,
  search: { setSearch, showSearch = true },
  sort: { setSort } = {},
}: AgTableProps) => {
  // local storage key with column state
  const columnStateLsKey = `column-state_${id}`
  const defaultColDef = {
    resizable: true,
  }

  const [gridColumnApi, setGridColumnApi] = useState<ColumnApi | null>(null)

  const [validSearch, setValidSearch] = useState<boolean>(true)

  const gridOptions: GridOptions = {
    onSortChanged: (params) => {
      if (!setSort) return

      saveColumnState(params.columnApi)
      onSortChange(params.columnApi.getColumnState())
    },
    onColumnMoved: (params) => saveColumnState(params.columnApi),
    components: gridComponents,
    suppressNoRowsOverlay: data.loading,
  }

  // update table items order on sort change
  const initialLoadOnSort = useRef<boolean>(false)

  const onSortChange = useCallback(
    (columns: ColumnState[]) => {
      if (!setSort) return

      // prevent multiple fetch on initial render
      if (!initialLoadOnSort.current) {
        initialLoadOnSort.current = true
        return
      }

      const sortedColumns = columns.filter((col) => !!col.sort)

      setSort(() =>
        sortedColumns?.map((col) => ({
          orderBy: col?.colId || "",
          orderDir: col?.sort?.toUpperCase() || "",
        }))
      )
    },
    [setSort]
  )

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()
  const filterField = watch("filter-input", "")
  const debounceFilter = useRef(
    debounce((value: string) => {
      setSearch(value)
      pagination?.setCurrentPage(1)
    }, 500)
  )
  useEffect(() => {
    if (filterField.length === 0 || filterField.length > 2) {
      setValidSearch(true)
      debounceFilter.current(filterField)
    } else {
      setSearch("")
      setValidSearch(false)
    }
  }, [filterField, setSearch])

  // Load a table state on initial render & pagination change (because the new data comes from the API)
  useEffect(() => {
    const savedColumnState = sessionStorage.getItem(columnStateLsKey)

    if (gridColumnApi && savedColumnState) {
      const parsedState: ColumnState[] = JSON.parse(savedColumnState)

      gridColumnApi.applyColumnState({
        state: parsedState,
        applyOrder: true,
      })
    }
  }, [gridColumnApi, id, columnStateLsKey])

  const saveColumnState = (api: ColumnApi) => {
    const columnState = api.getColumnState()
    const columnStateJSON = JSON.stringify(columnState)
    sessionStorage.setItem(columnStateLsKey, columnStateJSON)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGridReady = (params: any) => {
    setGridColumnApi(params.columnApi)
    if (selectConfig?.setGridApi) {
      selectConfig.setGridApi(params.api)
    }
  }

  return (
    <div className={`ag-theme-alpine ag-theme-bloom ${className || ""}`}>
      <div className="flex justify-between flex-col md:flex-row">
        <div className={`flex flex-wrap ${showSearch ? "" : "hidden"}`}>
          <div className="md:mr-5 w-full md:w-56">
            <Field
              dataTestId="ag-search-input"
              name="filter-input"
              label={t("t.filter")}
              readerOnly={true}
              register={register}
              placeholder={t("t.filter")}
            />
          </div>
          <div className="w-full md:w-auto mt-2 md:mt-0 mb-2 md:mb-0">
            {!validSearch && (
              <AlertBox type="notice">{t("applications.table.searchError")}</AlertBox>
            )}
          </div>
        </div>

        {headerContent}
      </div>
      <div className="applications-table mt-5">
        <LoadingOverlay isLoading={data.loading}>
          <div>
            <AgGridReact
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              gridOptions={gridOptions}
              columnDefs={columns}
              rowData={data.items}
              domLayout={"autoHeight"}
              headerHeight={83}
              rowHeight={58}
              suppressPaginationPanel={true}
              paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
              suppressScrollOnNewData={true}
              rowSelection={rowSelection ? "multiple" : undefined}
              rowMultiSelectWithClick={rowSelection}
              onRowDataChanged={selectConfig?.updateSelectedValues ?? undefined}
              onFirstDataRendered={selectConfig?.updateSelectedValues ?? undefined}
            ></AgGridReact>
          </div>
        </LoadingOverlay>

        {pagination && (
          <AgPagination
            totalItems={data.totalItems}
            totalPages={data.totalPages}
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.perPage}
            quantityLabel={totalItemsLabel}
            setCurrentPage={pagination.setCurrentPage}
            setItemsPerPage={pagination.setPerPage}
          />
        )}
      </div>
    </div>
  )
}

export { AgTable as default, AgTable }
