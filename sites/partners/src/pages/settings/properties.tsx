import React, { useContext, useMemo, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import { AgTable, t, useAgTable, useMutate } from "@bloom-housing/ui-components"
import { AuthContext, MessageContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  Property,
  PropertyCreate,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import TabView from "../../layouts/TabView"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import { getSettingsTabs, SettingsIndexEnum } from "../../components/settings/SettingsViewHelpers"
import { Button } from "@bloom-housing/ui-seeds"
import { usePropertiesList } from "../../lib/hooks"
import dayjs from "dayjs"
import ManageIconSection from "../../components/settings/ManageIconSection"
import { ColDef, ColGroupDef } from "ag-grid-community"
import { PropertyDrawer } from "../../components/settings/PropertyDrawer"
import { useSWRConfig } from "swr"

const SettingsProperties = () => {
  const router = useRouter()
  const tableOptions = useAgTable()
  const { mutate } = useSWRConfig()
  const { mutate: updateProperty, isLoading: isUpdateLoading } = useMutate()
  const { mutate: createProperty, isLoading: isCreateLoading } = useMutate()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const { addToast } = useContext(MessageContext)
  const { profile, propertiesService, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)
  const atLeastOneJurisdictionEnablesPreferences = !doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.disableListingPreferences,
    null,
    true
  )

  if (profile?.userRoles?.isPartner || profile?.userRoles?.isSupportAdmin || !enableProperties) {
    void router.push("/unauthorized")
  }

  const {
    data: propertiesData,
    loading,
    cacheKey,
  } = usePropertiesList({
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
        minWidth: 100,
        flex: 1,
      },
      {
        headerName: t("t.descriptionTitle"),
        field: "description",
        minWidth: 130,
        flex: 1,
      },
      {
        headerName: t("t.url"),
        field: "url",
        minWidth: 100,
        cellRendererFramework: ({ value }) => {
          return (
            <a href={value} target="_blank">
              {value}
            </a>
          )
        },
      },
      ...(profile.jurisdictions.length > 1
        ? [
            {
              headerName: t("t.jurisdiction"),
              field: "jurisdictions.name",
            },
          ]
        : []),
      {
        headerName: t("t.updatedAt"),
        field: "updatedAt",
        minWidth: 130,
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
              onCopy={() => console.log("Copy: ", data.name)}
              copyTestId={`property-copy-icon: ${data.name}`}
              onEdit={() => {
                setIsDrawerOpen(true)
                setSelectedProperty(data)
              }}
              editTestId={`property-edit-icon: ${data.name}`}
              onDelete={() => console.log("Copy: ", data.name)}
              deleteTestId={`property-delete-icon: ${data.name}`}
              align="start"
            />
          )
        },
      },
    ],
    [profile?.jurisdictions]
  )

  const handleSave = (propertyData: PropertyCreate) => {
    if (selectedProperty) {
      void updateProperty(() =>
        propertiesService
          .update({
            body: {
              ...propertyData,
              id: selectedProperty.id,
            },
          })
          .then(() => {
            addToast(t("properties.alertUpdated"), { variant: "success" })
          })
          .catch((e) => {
            addToast(t(`errors.alert.badRequest`), { variant: "alert" })
            console.log(e)
          })
          .finally(() => {
            setIsDrawerOpen(false)
            setSelectedProperty(null)
            void mutate(cacheKey)
          })
      )
    } else {
      void createProperty(() =>
        propertiesService
          .add({
            body: propertyData,
          })
          .then(() => {
            addToast(t("properties.alertCreated"), { variant: "success" })
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
            {`${t("t.settings")} - ${t("settings.properties")} - ${t("nav.siteTitlePartners")}`}
          </title>
        </Head>
        <NavigationHeader className="relative" title={t("t.settings")} />
        <TabView
          hideTabs={!(atLeastOneJurisdictionEnablesPreferences && enableProperties)}
          tabs={getSettingsTabs(SettingsIndexEnum.properties, router)}
        >
          <AgTable
            id="properties-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            data={{
              items: propertiesData?.items,
              loading: loading,
              totalItems: propertiesData?.meta?.totalItems,
              totalPages: propertiesData?.meta?.totalPages,
            }}
            config={{
              columns: columnDefs,
              totalItemsLabel: t("properties.total"),
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            headerContent={
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsDrawerOpen(true)}
                id="addListingButton"
              >
                {t("properties.add")}
              </Button>
            }
          />
        </TabView>
      </Layout>
      <PropertyDrawer
        drawerOpen={isDrawerOpen}
        onDrawerClose={() => {
          setIsDrawerOpen(false)
          setSelectedProperty(null)
        }}
        editedProperty={selectedProperty}
        saveQuestion={handleSave}
        isLoading={isCreateLoading || isUpdateLoading}
      />
    </>
  )
}

export default SettingsProperties
