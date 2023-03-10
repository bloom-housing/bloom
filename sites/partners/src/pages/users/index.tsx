import React, { useContext, useMemo, useState } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { t, SiteAlert } from "@bloom-housing/ui-components"
import { Button } from "../../../../../detroit-ui-components/src/actions/Button"
import { PageHeader } from "../../../../../detroit-ui-components/src/headers/PageHeader"
import { Drawer } from "../../../../../detroit-ui-components/src/overlays/Drawer"
import { AgTable, useAgTable } from "../../../../../detroit-ui-components/src/tables/AgTable"
import {
  AppearanceSizeType,
  AppearanceStyleType,
} from "../../../../../detroit-ui-components/src/global/AppearanceTypes"
import { User } from "@bloom-housing/backend-core/types"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { faFileExport } from "@fortawesome/free-solid-svg-icons"
import Layout from "../../layouts"
import { useUserList, useListingsData, useUsersExport } from "../../lib/hooks"
import { FormUserManage } from "../../components/users/FormUserManage"

type UserDrawerValue = {
  type: "add" | "edit"
  user?: User
}

const getRolesDisplay = ({ value }) => {
  const { isAdmin, isPartner } = value || {}

  const roles = []

  if (isAdmin) {
    roles.push(t("users.administrator"))
  }

  if (isPartner) {
    roles.push(t("users.partner"))
  }

  return roles.join(", ")
}

const Users = () => {
  /* Add user drawer */
  const { profile } = useContext(AuthContext)
  const [userDrawer, setUserDrawer] = useState<UserDrawerValue | null>(null)

  const tableOptions = useAgTable()

  const { onExport, csvExportLoading, csvExportError, csvExportSuccess } = useUsersExport()

  const columns = useMemo(() => {
    return [
      {
        headerName: t("t.name"),
        field: "",
        sortable: true,
        unSortIcon: true,
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
        sortable: true,
        unSortIcon: true,
        flex: 1,
        minWidth: 250,
      },
      {
        headerName: t("t.listing"),
        sortable: true,
        unSortIcon: true,
        field: "leasingAgentInListings",
        comparator: (valueA, valueB) => {
          if (!valueA.length || !valueB.length) {
            return !valueA.length ? 1 : -1
          }
          return valueA
            .map((item) => item.name)
            .join(", ")
            .localeCompare(valueB.map((item) => item.name).join(", "))
        },
        valueFormatter: ({ value }) => {
          return value.map((item) => item.name).join(", ")
        },
      },
      {
        headerName: t("t.role"),
        field: "roles",
        sortable: true,
        unSortIcon: true,
        comparator: (valueA, valueB) => {
          return getRolesDisplay({ value: valueA }).localeCompare(
            getRolesDisplay({ value: valueB })
          )
        },
        valueFormatter: getRolesDisplay,
      },
      {
        headerName: t("listings.details.createdDate"),
        field: "createdAt",
        sortable: true,
        unSortIcon: true,
        valueFormatter: ({ value }) => dayjs(value).format("MM/DD/YYYY"),
      },
      {
        headerName: t("listings.unit.status"),
        field: "confirmedAt",
        sortable: true,
        unSortIcon: true,
        comparator: (valueA, valueB, _nodeA, _nodeB, isInverted) => {
          let comparatorValue = 0
          if (!valueA || !valueB) {
            comparatorValue = valueA ? -1 : 1
          } else {
            comparatorValue = valueA < valueB ? -1 : 1
          }
          return isInverted ? Math.abs(comparatorValue) : comparatorValue
        },
        valueFormatter: ({ value }) => (value ? t("users.confirmed") : t("users.unconfirmed")),
      },
    ]
  }, [])

  /* Fetch user list */
  const { data: userList, loading, error } = useUserList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
  })
  /* Fetch listings */
  const { listingDtos } = useListingsData({
    limit: "all",
  })

  if (error) return <div>An error has occurred.</div>

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <PageHeader className={"relative md:pt-16"} title={t("nav.users")}>
        <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
          {csvExportSuccess && (
            <SiteAlert
              timeout={5000}
              dismissable
              sticky={true}
              alertMessage={{ message: t("users.exportSuccess"), type: "success" }}
            />
          )}{" "}
        </div>
      </PageHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          {csvExportError && (
            <SiteAlert
              dismissable
              className="mb-4"
              alertMessage={{ message: t("errors.alert.exportFailed"), type: "alert" }}
            />
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
                  size={AppearanceSizeType.small}
                  styleType={AppearanceStyleType.primary}
                  onClick={() => setUserDrawer({ type: "add" })}
                  disabled={!listingDtos}
                  dataTestId={"add-user"}
                >
                  {t("users.addUser")}
                </Button>
                {profile?.roles?.isAdmin && (
                  <Button
                    className="mx-1"
                    size={AppearanceSizeType.small}
                    icon={faFileExport}
                    onClick={() => onExport()}
                    loading={csvExportLoading}
                    dataTestId={"export-users"}
                  >
                    {t("t.export")}
                  </Button>
                )}
              </div>
            }
          />
        </article>
      </section>

      <Drawer
        open={!!userDrawer}
        title={userDrawer?.type === "add" ? t("users.addUser") : t("users.editUser")}
        ariaDescription={t("users.addUser")}
        onClose={() => setUserDrawer(null)}
      >
        <FormUserManage
          mode={userDrawer?.type}
          user={userDrawer?.user}
          listings={listingDtos?.items}
          onDrawerClose={() => setUserDrawer(null)}
        />
      </Drawer>
    </Layout>
  )
}

export default Users
