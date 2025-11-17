import React, { useMemo, useContext, useState } from "react"
import Head from "next/head"
import DocumentArrowDownIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import dayjs from "dayjs"
import { ColDef, ColGroupDef } from "ag-grid-community"
import { Button, Dialog, Grid, Icon } from "@bloom-housing/ui-seeds"
import { t, AgTable, useAgTable, Select, Form, SelectOption } from "@bloom-housing/ui-components"
import { AuthContext } from "@bloom-housing/shared-helpers"
import { FeatureFlagEnum } from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useListingExport, useListingsData } from "../lib/hooks"
import Layout from "../layouts"
import { MetaTags } from "../components/shared/MetaTags"
import { NavigationHeader } from "../components/shared/NavigationHeader"

class formatLinkCell {
  link: HTMLAnchorElement

  init(params) {
    this.link = document.createElement("a")
    this.link.classList.add("text-blue-700")
    this.link.setAttribute("href", `/listings/${params.data.id}/applications`)
    this.link.innerText = params.valueFormatted || params.value
    this.link.style.textDecoration = "underline"
  }

  getGui() {
    return this.link
  }
}

class formatWaitlistStatus {
  text: HTMLSpanElement

  init({ data }) {
    const isWaitlistOpen = data.waitlistOpenSpots > 0

    this.text = document.createElement("span")
    this.text.innerHTML = isWaitlistOpen ? t("t.yes") : t("t.no")
  }

  getGui() {
    return this.text
  }
}

class formatIsVerified {
  text: HTMLSpanElement

  init({ data }) {
    this.text = document.createElement("span")
    this.text.innerHTML = data.isVerified ? t("t.yes") : t("t.no")
  }

  getGui() {
    return this.text
  }
}

class ApplicationsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}/applications`)
    this.link.setAttribute("data-testid", `listing-status-cell-${params.data.name}`)
  }
}

class ListingsLink extends formatLinkCell {
  init(params) {
    super.init(params)
    this.link.setAttribute("href", `/listings/${params.data.id}`)
    this.link.setAttribute("data-testid", params.data.name)
  }
}

export const getFlagInAllJurisdictions = (
  flagName: FeatureFlagEnum,
  activeState: boolean,
  doJurisdictionsHaveFeatureFlagOn: (
    featureFlag: string,
    jurisdiction?: string,
    onlyIfAllJurisdictionsHaveItEnabled?: boolean
  ) => boolean
) => {
  if (activeState) {
    return doJurisdictionsHaveFeatureFlagOn(flagName, null, true)
  } else {
    return !doJurisdictionsHaveFeatureFlagOn(flagName)
  }
}

type CreateListingFormFields = {
  jurisdiction: string
}

export default function ListingsList() {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const isAdmin =
    profile?.userRoles?.isAdmin ||
    profile?.userRoles?.isSupportAdmin ||
    profile?.userRoles?.isJurisdictionalAdmin ||
    profile?.userRoles?.isLimitedJurisdictionalAdmin ||
    false
  const { onExport, csvExportLoading } = useListingExport()
  const router = useRouter()
  const tableOptions = useAgTable()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, handleSubmit, clearErrors } = useForm<CreateListingFormFields>()

  const [listingSelectModal, setListingSelectModal] = useState(false)

  const defaultJurisdiction =
    profile?.jurisdictions.length === 1 ? profile.jurisdictions[0].id : null

  const jurisdictionOptions: SelectOption[] = [
    { label: "", value: "" },
    ...profile.jurisdictions.map((jurisdiction) => ({
      label: jurisdiction.name,
      value: jurisdiction.id,
    })),
  ]

  const gridComponents = {
    ApplicationsLink,
    formatLinkCell,
    formatWaitlistStatus,
    formatIsVerified,
    ListingsLink,
  }
  const columnDefs = useMemo(() => {
    const columns: (ColDef | ColGroupDef)[] = [
      {
        headerName: t("listings.listingName"),
        field: "name",
        sortable: true,
        unSortIcon: true,
        filter: false,
        resizable: true,
        cellRenderer: "ListingsLink",
        minWidth: 250,
        flex: 1,
      },
      {
        headerName: t("listings.listingStatusText"),
        field: "status",
        sortable: true,
        unSortIcon: true,
        sort: "asc",
        // disable frontend sorting
        comparator: () => 0,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => t(`listings.listingStatus.${value}`),
        cellRenderer: !profile?.userRoles?.isLimitedJurisdictionalAdmin ? "ApplicationsLink" : "",
        minWidth: 190,
      },
      {
        headerName: t("listings.createdDate"),
        field: "createdAt",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
        maxWidth: 140,
      },
      {
        headerName: t("listings.publishedDate"),
        field: "publishedAt",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
        maxWidth: 150,
      },
      {
        headerName: t("listings.applicationDueDate"),
        field: "applicationDueDate",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
        maxWidth: 120,
      },
    ]

    if (
      getFlagInAllJurisdictions(
        FeatureFlagEnum.enableIsVerified,
        true,
        doJurisdictionsHaveFeatureFlagOn
      )
    ) {
      columns.push({
        headerName: t("t.verified"),
        field: "isVerified",
        sortable: false,
        filter: false,
        resizable: true,
        cellRenderer: "formatIsVerified",
        maxWidth: 100,
      })
    }

    if (
      getFlagInAllJurisdictions(
        FeatureFlagEnum.enableUnitGroups,
        false,
        doJurisdictionsHaveFeatureFlagOn
      )
    ) {
      columns.push(
        {
          headerName: t("listings.availableUnits"),
          field: "unitsAvailable",
          sortable: false,
          filter: false,
          resizable: true,
          maxWidth: 120,
        },
        {
          headerName: t("listings.waitlist.open"),
          field: "waitlistCurrentSize",
          sortable: false,
          filter: false,
          resizable: true,
          cellRenderer: "formatWaitlistStatus",
          maxWidth: 160,
        }
      )
    }
    if (
      getFlagInAllJurisdictions(
        FeatureFlagEnum.enableListingUpdatedAt,
        true,
        doJurisdictionsHaveFeatureFlagOn
      )
    ) {
      columns.push({
        headerName: t("t.lastUpdated"),
        field: "contentUpdatedAt",
        sortable: false,
        filter: false,
        resizable: true,
        valueFormatter: ({ value }) => (value ? dayjs(value).format("MM/DD/YYYY") : t("t.none")),
        maxWidth: 140,
      })
    }

    return columns
  }, [])

  const { listingDtos, listingsLoading } = useListingsData({
    page: tableOptions.pagination.currentPage,
    limit: tableOptions.pagination.itemsPerPage,
    search: tableOptions.filter.filterValue,
    userId: profile?.id,
    sort: tableOptions.sort.sortOptions,
    roles: profile?.userRoles,
    userJurisidctionIds: profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id),
  })

  const onSubmit = (data: CreateListingFormFields) => {
    void router.push({
      pathname: "/listings/add",
      query: { jurisdictionId: data.jurisdiction },
    })
  }

  return (
    <Layout>
      <Head>
        <title>{`Home - ${t("nav.siteTitlePartners")}`}</title>
      </Head>
      <MetaTags title={t("nav.siteTitlePartners")} description={metaDescription} />
      <NavigationHeader title={t("nav.listings")}></NavigationHeader>
      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <AgTable
            id="listings-table"
            pagination={{
              perPage: tableOptions.pagination.itemsPerPage,
              setPerPage: tableOptions.pagination.setItemsPerPage,
              currentPage: tableOptions.pagination.currentPage,
              setCurrentPage: tableOptions.pagination.setCurrentPage,
            }}
            config={{
              gridComponents,
              columns: columnDefs,
              totalItemsLabel: t("listings.totalListings"),
            }}
            data={{
              items: listingDtos?.items,
              loading: listingsLoading,
              totalItems: listingDtos?.meta.totalItems,
              totalPages: listingDtos?.meta.totalPages,
            }}
            search={{
              setSearch: tableOptions.filter.setFilterValue,
            }}
            sort={{
              setSort: tableOptions.sort.setSortOptions,
            }}
            headerContent={
              <div className="flex gap-2 items-center">
                {isAdmin && (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        // also check if feature flags
                        if (defaultJurisdiction) {
                          void router.push(`/listings/add/?jurisdictionId=${defaultJurisdiction}`)
                        } else {
                          setListingSelectModal(true)
                        }
                      }}
                      id="addListingButton"
                    >
                      {t("listings.addListing")}
                    </Button>
                    <Button
                      id="export-listings"
                      variant="primary-outlined"
                      onClick={() => onExport()}
                      leadIcon={
                        !csvExportLoading ? (
                          <Icon>
                            <DocumentArrowDownIcon />
                          </Icon>
                        ) : null
                      }
                      size="sm"
                      loadingMessage={csvExportLoading && t("t.formSubmitted")}
                    >
                      {t("t.exportToCSV")}
                    </Button>
                  </>
                )}
              </div>
            }
          />
        </article>
      </section>

      <Dialog
        isOpen={listingSelectModal}
        ariaLabelledBy="listing-select-dialog-header"
        ariaDescribedBy="listing-select-dialog-content"
        onClose={() => setListingSelectModal(false)}
      >
        <Form id="listing-select-form" onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Header id="listing-select-dialog-header">
            {"Create listing dialog header"}
          </Dialog.Header>

          <Dialog.Content id="listing-select-dialog-content">
            {"Create listing dialog content"}
            <Grid>
              <Grid.Row columns={3}>
                <Grid.Cell className={"seeds-grid-span-2"}>
                  <div className={`${defaultJurisdiction ? "hidden" : ""} seeds-m-bs-4`}>
                    <Select
                      id={"jurisdiction"}
                      defaultValue={defaultJurisdiction}
                      name={"jurisdiction"}
                      label={t("t.jurisdiction")}
                      register={register}
                      controlClassName={`control ${defaultJurisdiction ? "hidden" : ""}`}
                      error={!!errors?.jurisdiction}
                      errorMessage={t("errors.requiredFieldError")}
                      keyPrefix={"jurisdictions"}
                      options={jurisdictionOptions}
                      validation={{ required: !defaultJurisdiction }}
                      inputProps={{
                        onChange: () => {
                          clearErrors("jurisdiction")
                        },
                        "aria-required": true,
                        "aria-hidden": !!defaultJurisdiction,
                      }}
                    />
                  </div>
                </Grid.Cell>
              </Grid.Row>
            </Grid>
          </Dialog.Content>
          <Dialog.Footer>
            <Button variant="primary" size="sm" type={"submit"}>
              {t("listings.createListing")}
            </Button>
            <Button
              variant="primary-outlined"
              onClick={() => {
                setListingSelectModal(false)
              }}
              size="sm"
              type={"button"}
            >
              {t("t.cancel")}
            </Button>
          </Dialog.Footer>
        </Form>
      </Dialog>
    </Layout>
  )
}
