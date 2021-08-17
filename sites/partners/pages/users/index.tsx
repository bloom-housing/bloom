import React, { useMemo, useState } from "react"
import Head from "next/head"
import { AgGridReact } from "ag-grid-react"
import moment from "moment"
import { PageHeader, AgPagination, t, AG_PER_PAGE_OPTIONS } from "@bloom-housing/ui-components"

import Layout from "../../layouts"
import { useUserList } from "../../lib/hooks"

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
        field: "",
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

  /* Fetch user list */
  const { data: userList } = useUserList({
    page: currentPage,
    limit: itemsPerPage,
  })

  if (!userList) return null

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitlePartners")}</title>
      </Head>

      <PageHeader className="relative" title={t("nav.users")} />

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="applications-table mt-5">
              <AgGridReact
                columnDefs={columns}
                defaultColDef={defaultColDef}
                rowData={userList}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={AG_PER_PAGE_OPTIONS[0]}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              {/* TODO: Update pagination to use data from the backend */}
              <AgPagination
                totalItems={1}
                totalPages={1}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                quantityLabel={t("users.totalUsers")}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
              />
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default Users
