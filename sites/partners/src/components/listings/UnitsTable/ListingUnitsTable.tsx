import React, { useEffect, useId, useMemo, useState } from "react"
import { t } from "@bloom-housing/ui-components"
import { Button, Message } from "@bloom-housing/ui-seeds"
import { Unit } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { DataTable, TableDataRow } from "../../shared/DataTable"
import { getUnitColumns, unitGlobalFilterFn, unitToRow } from "../UnitTableColDefs"
import unitTableStyles from "../UnitTableColDefs.module.scss"
import { UnitFilterDrawer } from "./UnitFilterDrawer"
import {
  applyUnitFilters,
  buildUnitFilterOptions,
  emptyUnitFilters,
  isUnitFilterActive,
  pruneUnitFilters,
  UnitFilters,
} from "./unitFilterHelpers"
import styles from "./ListingUnitsTable.module.scss"

interface ListingUnitsTableProps {
  actionsCell: (row: TableDataRow) => React.ReactNode
  id?: string
  units: (Unit & { tempId?: number })[]
}

export const ListingUnitsTable = ({ actionsCell, id, units }: ListingUnitsTableProps) => {
  const [filters, setFilters] = useState<UnitFilters>(emptyUnitFilters)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const filterButtonId = useId()

  const options = useMemo(() => buildUnitFilterOptions(units), [units])

  useEffect(() => {
    setFilters((prev) => pruneUnitFilters(prev, options))
  }, [options])

  const columns = useMemo(
    () => getUnitColumns({ enableUnitGroups: false, showNonRegulated: false, actionsCell }),
    [actionsCell]
  )

  const rows = useMemo(() => applyUnitFilters(units, filters).map(unitToRow), [units, filters])

  const clearFilters = () => {
    setFilters(emptyUnitFilters)
    document.getElementById(filterButtonId)?.focus()
  }

  const filtersActive = isUnitFilterActive(filters)

  return (
    <>
      <DataTable
        id={id}
        description={t("listings.units")}
        columns={columns}
        data={rows}
        disablePagination
        filterType={"global"}
        minSearchCharacters={1}
        globalFilterFn={unitGlobalFilterFn}
        tableClassName={unitTableStyles["unit-table"]}
        headerRightContent={
          <div className={styles["header-actions"]}>
            {filtersActive && (
              <Button type="button" variant="primary-outlined" onClick={clearFilters}>
                {t("t.clearAllFilters")}
              </Button>
            )}
            <Button
              id={filterButtonId}
              type="button"
              variant="primary"
              onClick={() => setIsDrawerOpen(true)}
            >
              {t("t.filter")}
            </Button>
          </div>
        }
        headerBottomContent={
          filtersActive && (
            <Message variant="primary" fullwidth>
              {t("listings.unit.filtersApplied")}
            </Message>
          )
        }
      />
      {isDrawerOpen && (
        <UnitFilterDrawer
          filters={filters}
          options={options}
          onApply={(nextFilters) => {
            setFilters(nextFilters)
            setIsDrawerOpen(false)
          }}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  )
}
