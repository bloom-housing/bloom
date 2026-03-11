import React, { useContext, useMemo, useState } from "react"
import Head from "next/head"
import { AgTable, t, useAgTable } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  Agency,
  FeatureFlagEnum,
  User,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { Button, Dialog, Icon } from "@bloom-housing/ui-seeds"
import DocumentArrowDownIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon"
import dayjs from "dayjs"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import TabView from "../../layouts/TabView"
import { getUsersTabs, UsersIndexEnum } from "../../components/users/UsersViewHelpers"
import { useAdvocateUserExport, useUserList } from "../../lib/hooks"
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon"
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon"
import { DialogFooter } from "@bloom-housing/ui-seeds/src/overlays/Dialog"
import { useSWRConfig } from "swr"

const Advocates = () => {
  const { profile, doJurisdictionsHaveFeatureFlagOn, approveAdvocateUser } = useContext(AuthContext)
  const { mutate } = useSWRConfig()
  const [selectedUser, setSelectedUser] = useState<User>(null)
  const [dialogConfig, setDialogConfig] = useState<"accept" | "reject">(null)

  const enableHousingAdvocate = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableHousingAdvocate
  )

  const tableOptions = useAgTable()
  const { onExport, csvExportLoading } = useAdvocateUserExport()

  const columns = useMemo(() => {
    return [
      {
        headerName: t("users.agencyName"),
        field: "agency",
        flex: 1,
        minWidth: 150,
        valueFormatter: ({ value }) => (value as Agency)?.name,
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
        field: "isApproved",
        valueFormatter: ({ value }) => (value ? t("advocate.approved") : t("advocate.requested")),
      },
      {
        headerName: t("users.action"),
        field: "action",
        pinned: "right",
        maxWidth: 150,
        cellRendererFramework: ({ data }) => {
          return (
            !(data as User).isApproved && (
              <div className="flex justify-center gap-2">
                <button
                  className="text-success"
                  onClick={() => {
                    setDialogConfig("accept")
                    setSelectedUser(data)
                  }}
                  aria-label={"Accept"}
                >
                  <Icon size="lg">
                    <CheckCircleIcon />
                  </Icon>
                </button>
                <button
                  className="text-alert"
                  onClick={() => {
                    setDialogConfig("reject")
                    setSelectedUser(data)
                  }}
                  aria-label={"Reject"}
                >
                  <Icon size="lg">
                    <XCircleIcon />
                  </Icon>
                </button>
              </div>
            )
          )
        },
      },
    ]
  }, [])

  const {
    data: advocateUserList,
    cacheKey,
    loading,
    error,
  } = useUserList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
    filter: {
      isAdvocateUser: true,
    },
  })

  const handleCloseDialog = () => {
    setDialogConfig(null)
    setSelectedUser(null)
    void mutate(cacheKey)
  }

  const handleDialogClick = async (approved: boolean) => {
    await approveAdvocateUser(selectedUser.id, approved)
    await mutate(cacheKey)
    setDialogConfig(null)
  }

  if (error) return <div>{t("t.errorOccurred")}</div>

  return (
    <>
      <Layout>
        <Head>
          <title>{`Users - ${t("users.tabAdvocatesPublic")} - ${t(
            "nav.siteTitlePartners"
          )}`}</title>
        </Head>
        <NavigationHeader className="relative" title={t("nav.users")} />
        <TabView hideTabs={!enableHousingAdvocate} tabs={getUsersTabs(UsersIndexEnum.advocates)}>
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
                  items: advocateUserList?.items,
                  loading: loading,
                  totalItems: advocateUserList?.meta.totalItems,
                  totalPages: advocateUserList?.meta.totalPages,
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
      <Dialog isOpen={!!dialogConfig} onClose={handleCloseDialog}>
        {dialogConfig === "accept" ? (
          <>
            <Dialog.Header>{t("users.advocate.acceptHeader")}</Dialog.Header>
            <Dialog.Content>
              {t("users.advocate.acceptContent", {
                user_name: [
                  selectedUser?.firstName,
                  selectedUser?.middleName,
                  selectedUser?.lastName,
                ].join(" "),
              })}
            </Dialog.Content>
            <DialogFooter>
              <Button onClick={() => handleDialogClick(true)}>{t("t.approve")}</Button>
              <Button variant="primary-outlined" onClick={handleCloseDialog}>
                {t("t.cancel")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <Dialog.Header>{t("users.advocate.rejectHeader")}</Dialog.Header>
            <Dialog.Content>
              {t("users.advocate.rejectContent", {
                user_name: [
                  selectedUser?.firstName,
                  selectedUser?.middleName,
                  selectedUser?.lastName,
                ].join(" "),
              })}
            </Dialog.Content>
            <DialogFooter>
              <Button variant="alert" onClick={() => handleDialogClick(false)}>
                {t("t.decline")}
              </Button>
              <Button variant="primary-outlined" onClick={handleCloseDialog}>
                {t("t.cancel")}
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </>
  )
}

export default Advocates
