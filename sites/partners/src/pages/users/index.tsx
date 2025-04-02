import React, { useContext, useMemo, useState } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { useSWRConfig } from "swr"
import { AgTable, useAgTable, t, AlertBox } from "@bloom-housing/ui-components"
import { User } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import { AuthContext } from "@bloom-housing/shared-helpers"
import Layout from "../../layouts"
import { useUserList, useListingsData, useUsersExport } from "../../lib/hooks"
import { FormUserManage } from "../../components/users/FormUserManage"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import DocumentArrowDownIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon"

type UserDrawerValue = {
  type: "add" | "edit"
  user?: User
}

const Users = () => {
  const { profile } = useContext(AuthContext)
  const { mutate } = useSWRConfig()
  const [userDrawer, setUserDrawer] = useState<UserDrawerValue | null>(null)
  const [errorAlert, setErrorAlert] = useState(false)

  const tableOptions = useAgTable()

  const { onExport, csvExportLoading } = useUsersExport()

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
              id={`user-link-${user.email}`}
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
        field: "listings",
        valueFormatter: ({ value }) => {
          return value?.map((item) => item?.name).join(", ")
        },
      },
      {
        headerName: t("t.role"),
        field: "userRoles",
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
  }, [])

  const {
    data: userList,
    loading,
    error,
    cacheKey,
  } = useUserList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
  })

  const { listingDtos } = useListingsData({
    limit: "all",
  })

  if (error) return <div>{t("t.errorOccurred")}</div>

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <NavigationHeader className="relative" title={t("nav.users")} />
      <section>
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
              <div className="flex gap-2 items-center">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setUserDrawer({ type: "add" })}
                  disabled={!listingDtos}
                  id={"add-user"}
                >
                  {t("users.addUser")}
                </Button>
                {(profile?.userRoles?.isAdmin || profile?.userRoles?.isJurisdictionalAdmin) && (
                  <Button
                    variant="primary-outlined"
                    size="sm"
                    leadIcon={
                      !csvExportLoading ? (
                        <Icon>
                          <DocumentArrowDownIcon />
                        </Icon>
                      ) : null
                    }
                    onClick={() => onExport()}
                    loadingMessage={csvExportLoading && t("t.formSubmitted")}
                    id={"export-users"}
                  >
                    {t("t.exportToCSV")}
                  </Button>
                )}
              </div>
            }
          />
        </article>
      </section>

      {userDrawer && (
        <FormUserManage
          isOpen={!!userDrawer}
          title={userDrawer?.type === "add" ? t("users.addUser") : t("users.editUser")}
          mode={userDrawer?.type}
          user={userDrawer?.user}
          listings={listingDtos?.items}
          onCancel={() => setUserDrawer(null)}
          onDrawerClose={() => {
            setUserDrawer(null)
            void mutate(cacheKey)
          }}
        />
      )}
    </Layout>
  )
}

export default Users
