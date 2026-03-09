import React, { useContext, useMemo, useState } from "react"
import { useSWRConfig } from "swr"
import Head from "next/head"
import dayjs from "dayjs"
import DocumentArrowDownIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon"
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon"
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon"
import { t } from "@bloom-housing/ui-components"
import { Button, Dialog, Icon } from "@bloom-housing/ui-seeds"
import { AgTable, useAgTable } from "@bloom-housing/ui-components/ag-table"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import { DialogFooter } from "@bloom-housing/ui-seeds/src/overlays/Dialog"
import {
  Agency,
  FeatureFlagEnum,
  OrderByEnum,
  User,
  UserOrderByKeys,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import TabView from "../../layouts/TabView"
import { getUsersTabs, UsersIndexEnum } from "../../components/users/UsersViewHelpers"
import { useAdvocateUserExport, useUserList } from "../../lib/hooks"

const Advocates = () => {
  const { addToast } = useContext(MessageContext)
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
                  data-testid="advocate-accept"
                  onClick={() => {
                    setDialogConfig("accept")
                    setSelectedUser(data)
                  }}
                  aria-label={t("t.approve")}
                >
                  <Icon size="lg">
                    <CheckCircleIcon />
                  </Icon>
                </button>
                <button
                  className="text-alert"
                  data-testid="advocate-reject"
                  onClick={() => {
                    setDialogConfig("reject")
                    setSelectedUser(data)
                  }}
                  aria-label={t("t.decline")}
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
    orderBy: [UserOrderByKeys.isApproved],
    orderDir: [OrderByEnum.asc],
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
    const userName = [selectedUser.firstName, selectedUser.middleName, selectedUser.lastName]
      .filter((entry) => entry)
      .join(" ")
    await approveAdvocateUser(selectedUser.id, approved)
    await mutate(cacheKey)
    setDialogConfig(null)
    if (approved) {
      addToast(t("users.advocate.acceptToast", { userName }), { variant: "success" })
    } else {
      addToast(t("users.advocate.rejectToast", { userName }), { variant: "alert" })
    }
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
      <Dialog
        isOpen={!!dialogConfig}
        onClose={handleCloseDialog}
        ariaLabelledBy="advocate-dialog-header"
        ariaDescribedBy="advocate-dialog-content"
      >
        {dialogConfig === "accept" ? (
          <>
            <Dialog.Header id="advocate-dialog-header">
              {t("users.advocate.acceptHeader")}
            </Dialog.Header>
            <Dialog.Content id="advocate-dialog-content">
              {t("users.advocate.acceptContent", {
                user_name: [
                  selectedUser?.firstName,
                  selectedUser?.middleName,
                  selectedUser?.lastName,
                ]
                  .filter((entry) => entry)
                  .join(" "),
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
            <Dialog.Header id="advocate-dialog-header">
              {t("users.advocate.rejectHeader")}
            </Dialog.Header>
            <Dialog.Content id="advocate-dialog-content">
              {t("users.advocate.rejectContent", {
                user_name: [
                  selectedUser?.firstName,
                  selectedUser?.middleName,
                  selectedUser?.lastName,
                ]
                  .filter((entry) => entry)
                  .join(" "),
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
