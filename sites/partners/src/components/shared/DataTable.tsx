import React, { useEffect, useState } from "react"
import { AllCommunityModule, ColDef, ModuleRegistry, themeQuartz } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import styles from "./DataTable.module.scss"

ModuleRegistry.registerModules([AllCommunityModule])

// export interface DataTableProps {}

interface IRow {
  make: string
  model: string
  price: number
  electric: boolean
}

export const DataTable = () => {
  const [rowData, setRowData] = useState<IRow[]>(null)

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<IRow>[]>(null)

  useEffect(() => {
    setColDefs([{ field: "make" }, { field: "model" }, { field: "price" }, { field: "electric" }])
    setRowData([
      { make: "Tesla", model: "Model Y", price: 64950, electric: true },
      { make: "Ford", model: "F-Series", price: 33850, electric: false },
      { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ])
  }, [])

  console.log({ rowData, colDefs })

  // Container: Defines the grid's theme & dimensions.
  return (
    <div className={`${styles["data-table-container"]}`}>
      hi
      <div className={styles["data-table-wrapper"]}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          theme={themeQuartz}
          className={styles["data-table"]}
        />
      </div>
    </div>
  )
}
