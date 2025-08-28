import React, { useEffect, useState } from "react"
import {
  AllCommunityModule,
  ModuleRegistry,
  createGrid,
  GridApi,
  GridOptions,
} from "ag-grid-community"

import styles from "./DataTable.module.scss"
import { t } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"

// TODO: Only register the modules we need to reduce bundle size
ModuleRegistry.registerModules([AllCommunityModule])

export interface IRow {
  name: string
  status: string
}

export interface DataTableProps {
  rowData: IRow[]
}

let gridApi: GridApi

const DataTable = (props: DataTableProps) => {
  const [gridElement, setGridElement] = useState<HTMLElement>(null)
  const [gridOptions, setGridOptions] = useState<GridOptions>({
    rowData: props.rowData,
    columnDefs: [{ field: "name" }, { field: "status" }],
  })

  useEffect(() => {
    setGridOptions({ ...gridOptions, rowData: props.rowData })
  }, [props.rowData])

  useEffect(() => {
    setGridElement(document.getElementById("gridId"))
  }, [])

  useEffect(() => {
    console.log({ gridElement })
    if (gridElement === null || !!gridApi) return
    gridElement.innerHTML = ""
    gridApi = createGrid(gridElement, gridOptions)
  }, [gridElement])

  return (
    <>
      <div className={styles["container"]} id="gridId"></div>
      <div className={styles["pagination"]}>
        <Button size={"sm"} variant={"primary-outlined"}>
          Previous
        </Button>
        <Button size={"sm"} variant={"primary-outlined"}>
          Next
        </Button>
      </div>
    </>
  )
}

export { DataTable as default, DataTable }
