import { useSWRConfig } from "swr"
import dayjs from "dayjs"
import React, { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { ColDef, ColGroupDef } from "ag-grid-community"
import { t, useMutate } from "@bloom-housing/ui-components"
import { Button } from "@bloom-housing/ui-seeds"
import { AgTable, useAgTable } from "@bloom-housing/ui-components/ag-table"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  Agency,
  AgencyCreate,
  FeatureFlagEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { TabView } from "@bloom-housing/shared-helpers/src/views/components/TabView"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import { getSettingsTabs, SettingsIndexEnum } from "../../components/settings/SettingsViewHelpers"
import { useAgenciesList } from "../../lib/hooks"
import ManageIconSection from "../../components/settings/ManageIconSection"
import { AgencyDrawer } from "../../components/settings/AgencyDrawer"
import { AgencyDeleteModal } from "../../components/settings/AgencyDeleteModal"

const SettingsAgencies = () => {
  const router = useRouter()
  const tableOptions = useAgTable()
  const { mutate } = useSWRConfig()
  const { mutate: updateAgency, isLoading: isUpdateLoading } = useMutate()
  const { mutate: createAgency, isLoading: isCreateLoading } = useMutate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editConfirmModalOpen, setEditConfirmModalOpen] = useState<Agency | null>(null)
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState<Agency | null>(null)
  const { addToast } = useContext(MessageContext)
  const { profile, agencyService, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const enableAgencies = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableHousingAdvocate)
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )
  const v2Preferences = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableV2MSQ)

  if (
    !enableAgencies ||
    profile?.userRoles?.isPartner ||
    profile?.userRoles?.isSupportAdmin ||
    profile?.userRoles?.isLimitedJurisdictionalAdmin
  ) {
    void router.push("/unauthorized")
  }

  const {
    data: agenciesData,
    loading,
    cacheKey,
  } = useAgenciesList({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
    jurisdictions: profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id).toString(),
  })

  const columnDefs: (ColDef | ColGroupDef)[] = useMemo(
    () => [
      {
        headerName: t("t.name"),
        field: "name",
        minWidth: 150,
        flex: 1,
      },
      ...(profile.jurisdictions.length > 1
        ? [
            {
              headerName: t("t.jurisdiction"),
              field: "jurisdictions.name",
              width: 130,
            },
          ]
        : []),
      {
        headerName: t("t.updatedAt"),
        field: "updatedAt",
        width: 130,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
      },
      {
        headerName: t("t.actions"),
        field: "actions",
        pinned: "right",
        flex: 1,
        resizable: false,
        maxWidth: 150,
        cellRendererFramework: ({ data }) => {
          return (
            <ManageIconSection
              onEdit={() => {
                setEditConfirmModalOpen(data)
                setIsDrawerOpen(true)
              }}
              editTestId={`agency-edit-icon: ${data.name}`}
              onDelete={() => setDeleteConfirmModalOpen(data)}
              deleteTestId={`agency-delete-icon: ${data.name}`}
              align="start"
            />
          )
        },
      },
    ],
    [profile?.jurisdictions]
  )

  const handleSave = (agencyData: AgencyCreate) => {
    if (editConfirmModalOpen) {
      void updateAgency(() =>
        agencyService
          .update({
            body: {
              ...agencyData,
              id: editConfirmModalOpen.id,
            },
          })
          .then(() => {
            addToast(t("agencies.alertUpdated"), { variant: "success" })
          })
          .catch((e) => {
            addToast(t(`errors.alert.badRequest`), { variant: "alert" })
            console.log(e)
          })
          .finally(() => {
            setIsDrawerOpen(false)
            setEditConfirmModalOpen(null)
            void mutate(cacheKey)
          })
      )
    } else {
      void createAgency(() =>
        agencyService
          .create({
            body: agencyData,
          })
          .then(() => {
            addToast(t("agencies.alertCreated"), { variant: "success" })
          })
          .catch((e) => {
            addToast(t(`errors.alert.badRequest`), { variant: "alert" })
            console.log(e)
          })
          .finally(() => {
            setIsDrawerOpen(false)
            void mutate(cacheKey)
          })
      )
    }
  }

  return (
    <>
      <Layout>
        <Head>
          <title>
            {`${t("t.settings")} - ${t("settings.agencies")} - ${t("nav.siteTitlePartners")}`}
          </title>
        </Head>
        <NavigationHeader className="relative" title={t("t.settings")} />
        <TabView
          hideTabs={!atLeastOneJurisdictionEnablesPreferences && !enableProperties}
          tabs={getSettingsTabs(SettingsIndexEnum.agencies, v2Preferences, enableAgencies)}
        >
          <AgTable
            id="agencies-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            data={{
              items: agenciesData?.items,
              loading: loading,
              totalItems: agenciesData?.meta?.totalItems,
              totalPages: agenciesData?.meta?.totalPages,
            }}
            config={{
              columns: columnDefs,
              totalItemsLabel: t("agencies.total"),
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            headerContent={
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsDrawerOpen(true)}
                id="addAgencyButton"
              >
                {t("agencies.add")}
              </Button>
            }
          />
        </TabView>
      </Layout>
      <AgencyDrawer
        drawerOpen={isDrawerOpen}
        onDrawerClose={() => {
          setIsDrawerOpen(false)
          setEditConfirmModalOpen(null)
        }}
        editedAgency={editConfirmModalOpen}
        saveAgency={handleSave}
        isLoading={isCreateLoading || isUpdateLoading}
      />
      {deleteConfirmModalOpen && (
        <AgencyDeleteModal
          agency={deleteConfirmModalOpen}
          onClose={() => {
            setDeleteConfirmModalOpen(null)
            void mutate(cacheKey)
          }}
        />
      )}
    </>
  )
}

export default SettingsAgencies
