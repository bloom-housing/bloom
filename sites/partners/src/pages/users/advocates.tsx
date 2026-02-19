import React, { useContext, useMemo } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { AgTable, t, useAgTable } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Icon } from "@bloom-housing/ui-seeds"
import DocumentArrowDownIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon"
import dayjs from "dayjs"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import TabView from "../../layouts/TabView"
import { getUsersTabs, UsersIndexEnum } from "../../components/users/UsersViewHelpers"
import { useUserList, useUsersExport } from "../../lib/hooks"

const Advocates = () => {
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const router = useRouter()

  const enableHousingAdvocate = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingAdvocate
  )

  const tableOptions = useAgTable()

  //TODO (Advocate): Update this to use the new export function
  const { onExport, csvExportLoading } = useUsersExport()

  const columns = useMemo(() => {
    return [
      {
        headerName: t("users.agencyName"),
        field: "agency",
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: t("t.email"),
        field: "email",
        flex: 1,
        minWidth: 250,
      },
      {
        headerName: t("listings.details.createdDate"),
        field: "createdAt",
        valueFormatter: ({ value }) => dayjs(value).format("MM/DD/YYYY"),
      },
      {
        headerName: t("users.status"),
        field: "status",
      },
      {
        headerName: t("users.action"),
        field: "action",
        cellRendererFramework: () => {
          //TODO: Add actions
          return <></>
        },
      },
    ]
  }, [])

  //TODO (Advocate): Switch to useUserListAdvocate or sth like that
  const {
    data: userList,
    loading,
    error,
  } = useUserList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
  })

  if (error) return <div>{t("t.errorOccurred")}</div>

  return (
    <Layout>
      <Head>
        <title>{`Users - ${t("users.tabAdvocatesPublic")} - ${t("nav.siteTitlePartners")}`}</title>
      </Head>
      <NavigationHeader className="relative" title={t("nav.users")} />
      <TabView
        hideTabs={!enableHousingAdvocate}
        tabs={getUsersTabs(UsersIndexEnum.advocates, router)}
      >
        <section>
          <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
            <AgTable
              id="advocate-users-table"
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
      </TabView>
    </Layout>
  )
}

export default Advocates
