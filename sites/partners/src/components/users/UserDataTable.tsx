import React, { useContext, useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"
import { mutate } from "swr"
import {
  AgTable,
  useAgTable,
  Button,
  t,
  AppearanceStyleType,
  AlertBox,
  UniversalIconType,
} from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import { useUserList, useListingsData, useUsersExport } from "../../lib/hooks"

const UserDataTable = ({ setUserDrawer, drawerOpen }) => {
  const { profile } = useContext(AuthContext)
  const [errorAlert, setErrorAlert] = useState(false)

  const tableOptions = useAgTable()

  const { data: userList, loading, error, cacheKey } = useUserList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
  })

  const { onExport, csvExportLoading, csvExportError } = useUsersExport()
  useEffect(() => {
    setErrorAlert(csvExportError)
  }, [csvExportError])

  useEffect(() => {
    void mutate(cacheKey)
  }, [drawerOpen, cacheKey])

  const columns = useMemo(() => {
    return [
      {
        headerName: t("t.name"),
        field: "",
        flex: 1,
        minWidth: 150,
        valueGetter: ({ data }) => {
          const { firstName, lastName } = data
          return `${firstName} ${lastName}`
        },
        cellRendererFramework: (params) => {
          const user = params.data
          return (
            <button
              className="text-blue-700 underline"
              onClick={() => setUserDrawer({ type: "edit", user })}
            >
              {params.value}
            </button>
          )
        },
      },
      {
        headerName: t("t.email"),
        field: "email",
        flex: 1,
        minWidth: 250,
      },
      {
        headerName: t("t.listing"),
        field: "leasingAgentInListings",
        valueFormatter: ({ value }) => {
          return value.map((item) => item.name).join(", ")
        },
      },
      {
        headerName: t("t.role"),
        field: "roles",
        valueFormatter: ({ value }) => {
          const { isAdmin, isPartner, isJurisdictionalAdmin } = value || {}

          const roles = []

          if (isAdmin) {
            roles.push(t("users.administrator"))
          }

          if (isPartner) {
            roles.push(t("users.partner"))
          }

          if (isJurisdictionalAdmin) {
            roles.push(t("users.jurisdictionalAdmin"))
          }

          return roles.join(", ")
        },
      },
      {
        headerName: t("listings.details.createdDate"),
        field: "createdAt",
        valueFormatter: ({ value }) => dayjs(value).format("MM/DD/YYYY"),
      },
      {
        headerName: t("listings.unit.status"),
        field: "confirmedAt",
        valueFormatter: ({ value }) => (value ? t("users.confirmed") : t("users.unconfirmed")),
      },
    ]
  }, [setUserDrawer])

  const { listingDtos } = useListingsData({
    limit: "all",
  })

  if (error) return <div>An error has occurred.</div>

  return (
    <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
      {errorAlert && (
        <AlertBox
          className="mb-8"
          onClose={() => setErrorAlert(false)}
          closeable
          type="alert"
          inverted
        >
          {t("account.settings.alerts.genericError")}
        </AlertBox>
      )}
      <AgTable
        id="users-table"
        pagination={{
          perPage: tableOptions.pagination.itemsPerPage,
          setPerPage: tableOptions.pagination.setItemsPerPage,
          currentPage: tableOptions.pagination.currentPage,
          setCurrentPage: tableOptions.pagination.setCurrentPage,
        }}
        config={{
          columns,
          totalItemsLabel: t("users.totalUsers"),
        }}
        data={{
          items: userList?.items,
          loading: loading,
          totalItems: userList?.meta.totalItems,
          totalPages: userList?.meta.totalPages,
        }}
        search={{
          setSearch: tableOptions.filter.setFilterValue,
        }}
        headerContent={
          <div className="flex-row">
            <Button
              className="mx-1"
              styleType={AppearanceStyleType.primary}
              onClick={() => setUserDrawer({ type: "add" })}
              disabled={!listingDtos}
              dataTestId={"add-user"}
            >
              {t("users.addUser")}
            </Button>
            {(profile?.roles?.isAdmin || profile?.roles?.isJurisdictionalAdmin) && (
              <Button
                className="mx-1"
                icon={!csvExportLoading ? (faFileExport as UniversalIconType) : null}
                onClick={() => onExport()}
                loading={csvExportLoading}
                dataTestId={"export-users"}
              >
                {t("t.exportToCSV")}
              </Button>
            )}
          </div>
        }
      />
    </article>
  )
}

export { UserDataTable as default, UserDataTable }
