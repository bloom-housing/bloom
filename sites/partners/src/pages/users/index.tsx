import React, { useMemo, useState } from "react"
import Head from "next/head"
import dayjs from "dayjs"
import { useSWRConfig } from "swr"
import {
  NavigationHeader,
  AgTable,
  useAgTable,
  Button,
  t,
  Drawer,
  SiteAlert,
  AlertTypes,
} from "@bloom-housing/ui-components"
import { User } from "@bloom-housing/backend-core/types"
import Layout from "../../layouts"
import { useUserList, useListingsData } from "../../lib/hooks"
import { FormUserManage } from "../../components/users/FormUserManage"

type UserDrawerValue = {
  type: "add" | "edit"
  user?: User
}

const Users = () => {
  const { mutate } = useSWRConfig()
  const [userDrawer, setUserDrawer] = useState<UserDrawerValue | null>(null)
  const [alertMessage, setAlertMessage] = useState({
    type: "alert" as AlertTypes,
    message: undefined,
  })
  const tableOptions = useAgTable()

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
  }, [])

  const { data: userList, loading, error, cacheKey } = useUserList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
  })

  const { listingDtos } = useListingsData({
    limit: "all",
  })

  if (error) return <div>An error has occurred.</div>

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>
      <SiteAlert dismissable alertMessage={alertMessage} sticky={true} timeout={5000} />
      <NavigationHeader className="relative" title={t("nav.users")} />
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
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
                  onClick={() => setUserDrawer({ type: "add" })}
                  disabled={!listingDtos}
                  dataTestId={"add-user"}
                >
                  {t("users.addUser")}
                </Button>
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
          onDrawerClose={() => {
            setUserDrawer(null)
            void mutate(cacheKey)
          }}
          setAlertMessage={setAlertMessage}
        />
      </Drawer>
    </Layout>
  )
}

export default Users