import React, { useMemo, useState } from "react"
import Head from "next/head"
import { AgGridReact } from "ag-grid-react"
import moment from "moment"
<<<<<<< HEAD
import {
  PageHeader,
  AgPagination,
  Button,
  t,
  Drawer,
  AG_PER_PAGE_OPTIONS,
  SiteAlert,
} from "@bloom-housing/ui-components"

import Layout from "../../layouts"
import { useUserList, useListingsData } from "../../lib/hooks"
import { FormUserAdd } from "../../src/users/FormUserAdd"
=======
import { PageHeader, AgPagination, t, AG_PER_PAGE_OPTIONS } from "@bloom-housing/ui-components"

import Layout from "../../layouts"
import { useUserList } from "../../lib/hooks"
>>>>>>> master

const defaultColDef = {
  resizable: true,
  maxWidth: 300,
}

const Users = () => {
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
        valueFormatter: ({ value }) => moment(value).format("MM/DD/YYYY"),
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

<<<<<<< HEAD
  /* Add user drawer */
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false)

=======
>>>>>>> master
  /* Fetch user list */
  const { data: userList } = useUserList({
    page: currentPage,
    limit: itemsPerPage,
  })

<<<<<<< HEAD
  /* Fetch listings */
  const { listingDtos } = useListingsData({
    limit: "all",
  })

  const resetPagination = () => {
    setCurrentPage(1)
  }

=======
>>>>>>> master
  if (!userList) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

<<<<<<< HEAD
      <PageHeader className="relative" title={t("nav.users")}>
        <div className="flex top-4 right-4 absolute z-50 flex-col items-center">
          <SiteAlert type="success" timeout={5000} dismissable />
          <SiteAlert type="alert" timeout={5000} dismissable />
        </div>
      </PageHeader>
=======
      <PageHeader className="relative" title={t("nav.users")} />
>>>>>>> master

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
<<<<<<< HEAD
            <div className="flex justify-between">
              <div className="w-56"></div>
              <div className="flex-row">
                <Button
                  className="mx-1"
                  onClick={() => setDrawerOpen(true)}
                  disabled={!listingDtos}
                >
                  {t("users.addUser")}
                </Button>
              </div>
            </div>
=======
>>>>>>> master
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
<<<<<<< HEAD
                onPerPageChange={resetPagination}
=======
>>>>>>> master
              />
            </div>
          </div>
        </article>
      </section>
<<<<<<< HEAD

      <Drawer
        open={isDrawerOpen}
        title={t("users.addUser")}
        ariaDescription={t("users.addUser")}
        onClose={() => setDrawerOpen(false)}
      >
        <FormUserAdd listings={listingDtos?.items} onDrawerClose={() => setDrawerOpen(false)} />
      </Drawer>
=======
>>>>>>> master
    </Layout>
  )
}

export default Users
