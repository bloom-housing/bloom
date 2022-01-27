import React, { useMemo, useState } from "react"
import Head from "next/head"
import { AgGridReact } from "ag-grid-react"
import dayjs from "dayjs"
import {
  PageHeader,
  AgPagination,
  Button,
  t,
  Drawer,
  AG_PER_PAGE_OPTIONS,
  SiteAlert,
} from "@bloom-housing/ui-components"
import { User } from "@bloom-housing/backend-core/types"
import Layout from "../../layouts"
import { useUserList, useListingsData } from "../../lib/hooks"
import { FormUserManage } from "../../src/users/FormUserManage"

const defaultColDef = {
  resizable: true,
  maxWidth: 300,
}

type UserDrawerValue = {
  type: "add" | "edit"
  user?: User
}

const Users = () => {
  /* Add user drawer */
  const [userDrawer, setUserDrawer] = useState<UserDrawerValue | null>(null)

  /* Ag Grid column definitions */
  const columns = useMemo(() => {
    return [
      {
        headerName: t("t.name"),
        field: "",
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
          const { isAdmin, isPartner } = value || {}

          const roles = []

          if (isAdmin) {
            roles.push(t("users.administrator"))
          }

          if (isPartner) {
            roles.push(t("users.partner"))
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

  /* Pagination */
  const [itemsPerPage, setItemsPerPage] = useState<number>(AG_PER_PAGE_OPTIONS[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  /* Fetch user list */
  const { data: userList } = useUserList({
    page: currentPage,
    limit: itemsPerPage,
  })

  /* Fetch listings */
  const { listingDtos } = useListingsData({
    limit: "all",
  })

  const resetPagination = () => {
    setCurrentPage(1)
  }

  if (!userList) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <PageHeader className="relative" title={t("nav.users")}>
        <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
          <SiteAlert type="alert" timeout={5000} dismissable />
        </div>
      </PageHeader>

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56"></div>
              <div className="flex-row">
                <Button
                  className="mx-1"
                  onClick={() => setUserDrawer({ type: "add" })}
                  disabled={!listingDtos}
                >
                  {t("users.addUser")}
                </Button>
              </div>
            </div>
            <div className="applications-table mt-5">
              <AgGridReact
                columnDefs={columns}
                defaultColDef={defaultColDef}
                rowData={userList.items}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              <AgPagination
                totalItems={userList.meta.totalItems}
                totalPages={userList.meta.totalPages}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("users.totalUsers")}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
                onPerPageChange={resetPagination}
              />
            </div>
          </div>
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
