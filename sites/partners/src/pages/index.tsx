import React, { useContext, useState, useEffect } from "react"
import Head from "next/head"
import DocumentArrowDownIcon from "@heroicons/react/24/solid/DocumentArrowDownIcon"
import { useRouter } from "next/router"
import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  PaginationState,
  SortingState,
} from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import dayjs from "dayjs"
import { AuthContext, Form, tIfExists } from "@bloom-housing/shared-helpers"
import { Button, Dialog, Grid, Icon, Link } from "@bloom-housing/ui-seeds"
import { t, Select, SelectOption, Field } from "@bloom-housing/ui-components"
import {
  EnumListingListingType,
  FeatureFlagEnum,
  ListingOrderByKeys,
  ListingTypeEnum,
  OrderByEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { fetchBaseListingData, useListingExport } from "../lib/hooks"
import Layout from "../layouts"
import { NavigationHeader } from "../components/shared/NavigationHeader"
import { DataTable, TableDataRow } from "../components/shared/DataTable"
import styles from "./index.module.scss"

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
  listingType: ListingTypeEnum
}

export default function ListingsList() {
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const isAdmin =
    profile?.userRoles?.isAdmin ||
    profile?.userRoles?.isSupportAdmin ||
    profile?.userRoles?.isJurisdictionalAdmin ||
    profile?.userRoles?.isLimitedJurisdictionalAdmin ||
    false
  const { onExport, csvExportLoading } = useListingExport(!!process.env.useSecureDownloadPathway)
  const router = useRouter()

  const MIN_SEARCH_CHARACTERS = 3

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, errors, handleSubmit, clearErrors } = useForm<CreateListingFormFields>()

  const [listingSelectModal, setListingSelectModal] = useState(false)
  const [isNonRegulatedEnabled, setIsNonRegulatedEnabled] = useState(false)
  const [isLandUseEnabled, setIsLandUseEnabled] = useState(false)

  const defaultJurisdiction =
    profile?.jurisdictions?.length === 1 ? profile.jurisdictions[0].id : null

  const otherPortalsTitle = tIfExists("listings.otherPortals.title")
  const otherPortals: { name: string; url: string }[] = []
  for (let i = 1; ; i++) {
    const name = tIfExists(`listings.otherPortals.portal${i}.name`)
    const url = tIfExists(`listings.otherPortals.portal${i}.url`)
    if (!name || !url) break
    otherPortals.push({ name, url })
  }

  const jurisdictions = profile?.jurisdictions || []

  const jurisdictionOptions: SelectOption[] = [
    { label: "", value: "" },
    ...jurisdictions.map((jurisdiction) => ({
      label: jurisdiction.name,
      value: jurisdiction.id,
    })),
  ]

  const showForNonRegulated = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableNonRegulatedListings,
    undefined,
    true
  )

  const showForLandUse = doJurisdictionsHaveFeatureFlagOn(
    FeatureFlagEnum.enableLandUse,
    undefined,
    true
  )

  const showListingTypeColumn = showForNonRegulated || showForLandUse

  useEffect(() => {
    if (defaultJurisdiction) {
      const landUseEnabled = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableLandUse)
      setIsLandUseEnabled(landUseEnabled)
      setIsNonRegulatedEnabled(
        doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableNonRegulatedListings)
      )
    }
  }, [defaultJurisdiction, doJurisdictionsHaveFeatureFlagOn])

  const onModalClose = () => {
    setListingSelectModal(false)
    setIsNonRegulatedEnabled(showForNonRegulated)
    setIsLandUseEnabled(showForLandUse)
  }

  const onSubmit = (data: CreateListingFormFields) => {
    const query = {
      jurisdictionId: data.jurisdiction,
    }
    if (data.listingType === ListingTypeEnum.landUse) {
      query["landUse"] = true
    } else if (data.listingType === ListingTypeEnum.nonRegulated) {
      query["nonRegulated"] = true
    }
    void router.push({
      pathname: "/listings/add",
      query: query,
    })
  }

  const columnHelper = createColumnHelper<TableDataRow>()

  const columns = React.useMemo<ColumnDef<TableDataRow>[]>(
    () => [
      columnHelper.accessor("name", {
        id: "name",
        cell: (props) => (
          <Link
            href={`/listings/${props.row.original.id as string}`}
            data-testid={props.getValue() as string}
            className="text-blue-700 underline"
            id={props.getValue() as string}
          >
            {props.getValue() as string}
          </Link>
        ),
        header: () => t("t.name"),
        footer: (props) => props.column.id,
        minSize: 430,
        meta: {
          plaintextName: t("t.name"),
        },
      }),
      columnHelper.accessor("listingType", {
        id: "listingType",
        cell: (props) => {
          if (!props.getValue()) {
            return t("t.none")
          }
          return t(`listings.${props.getValue() as string}`)
        },
        header: () => t("listings.listingType"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        minSize: 160,
        meta: {
          plaintextName: t("listings.listingType"),
          enabled: showListingTypeColumn,
        },
      }),
      columnHelper.accessor("status", {
        id: "status",
        cell: (props) => {
          const statusString = t(`listings.listingStatus.${props.getValue() as string}`)
          if (!profile?.userRoles?.isLimitedJurisdictionalAdmin) {
            return (
              <Link
                href={`/listings/${props.row.original.id as string}/applications`}
                className="text-blue-700 underline"
                id={`listing-status-cell-${props.row.original.name as string}`}
              >
                {statusString}
              </Link>
            )
          } else {
            return statusString
          }
        },
        header: () => t("application.status"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        minSize: 120,
        meta: {
          plaintextName: t("application.status"),
        },
      }),
      columnHelper.accessor("listingFileNumber", {
        id: "listingFileNumber",
        cell: (props) => props.getValue() ?? t("t.none"),
        header: () => t("listings.listingFileNumber"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 160,
        meta: {
          plaintextName: t("listings.listingFileNumber"),
          enabled: doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableListingFileNumber),
        },
      }),
      columnHelper.accessor("createdAt", {
        id: "createdAt",
        cell: (props) =>
          props.getValue() ? dayjs(props.getValue() as string).format("MM/DD/YYYY") : t("t.none"),
        header: () => t("listings.createdDate"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 140,
        meta: {
          plaintextName: t("listings.createdDate"),
        },
      }),
      columnHelper.accessor("scheduledPublishAt", {
        id: "scheduledPublishAt",
        cell: (props) =>
          props.getValue()
            ? dayjs.utc(props.getValue() as string).format("MM/DD/YYYY")
            : t("t.none"),
        header: () => t("listings.scheduledListingPublishDate"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 180,
        meta: {
          plaintextName: t("listings.scheduledListingPublishDate"),
          enabled: doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableAutopublish),
        },
      }),
      columnHelper.accessor("publishedAt", {
        id: "mostRecentlyPublished",
        cell: (props) =>
          props.getValue() ? dayjs(props.getValue() as string).format("MM/DD/YYYY") : t("t.none"),
        header: () => t("listings.publishedDate"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        minSize: 190,
        meta: {
          plaintextName: t("listings.publishedDate"),
        },
      }),
      columnHelper.accessor("applicationDueDate", {
        id: "applicationDates",
        cell: (props) =>
          props.getValue() ? dayjs(props.getValue() as string).format("MM/DD/YYYY") : t("t.none"),
        header: () => t("listings.applicationDueDate"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        minSize: 140,
        meta: {
          plaintextName: t("listings.applicationDueDate"),
        },
      }),
      columnHelper.accessor("isVerified", {
        id: "isVerified",
        cell: (props) => (props.getValue() ? t("t.yes") : t("t.no")),
        header: () => t("t.verified"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 100,
        meta: {
          enabled: getFlagInAllJurisdictions(
            FeatureFlagEnum.enableIsVerified,
            true,
            doJurisdictionsHaveFeatureFlagOn
          ),
        },
      }),
      columnHelper.accessor("unitsAvailable", {
        id: "unitsAvailable",
        cell: (props) => props.getValue(),
        header: () => t("listings.availableUnits"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 160,
        meta: {
          enabled: getFlagInAllJurisdictions(
            FeatureFlagEnum.enableUnitGroups,
            false,
            doJurisdictionsHaveFeatureFlagOn
          ),
        },
      }),
      columnHelper.accessor("waitlistCurrentSize", {
        id: "waitlistCurrentSize",
        cell: (props) => {
          const isWaitlistOpen = (props.row.original.waitlistOpenSpots as number) > 0
          return isWaitlistOpen ? t("t.yes") : t("t.no")
        },
        header: () => t("listings.waitlist.open"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 150,
        meta: {
          enabled: getFlagInAllJurisdictions(
            FeatureFlagEnum.enableUnitGroups,
            false,
            doJurisdictionsHaveFeatureFlagOn
          ),
        },
      }),
      columnHelper.accessor("contentUpdatedAt", {
        id: "contentUpdatedAt",
        cell: (props) =>
          props.getValue() ? dayjs(props.getValue() as string).format("MM/DD/YYYY") : t("t.none"),
        header: () => t("t.lastUpdated"),
        footer: (props) => props.column.id,
        enableColumnFilter: false,
        enableSorting: false,
        minSize: 150,
        meta: {
          enabled: getFlagInAllJurisdictions(
            FeatureFlagEnum.enableListingUpdatedAt,
            true,
            doJurisdictionsHaveFeatureFlagOn
          ),
        },
      }),
    ],
    []
  )

  const fetchListingsData = async (
    pagination?: PaginationState,
    search?: ColumnFiltersState,
    sort?: SortingState
  ) => {
    const searchValue = search[0]?.value as string
    const data = await fetchBaseListingData({
      page: pagination?.pageIndex ? pagination.pageIndex + 1 : 0,
      limit: pagination?.pageSize || 8,
      search: searchValue?.length >= MIN_SEARCH_CHARACTERS ? searchValue : undefined,
      orderBy: sort?.[0]?.id ? [sort[0].id as ListingOrderByKeys] : undefined,
      orderDir: sort?.[0]?.desc ? [OrderByEnum.desc] : [OrderByEnum.asc],
      userJurisdictionIds: profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id),
      roles: profile?.userRoles,
      userId: profile?.id,
    })
    return {
      items: data.items as unknown as TableDataRow[],
      totalItems: data.meta.totalItems,
      errorMessage: data.error ? data.error.response.data.message[0] : null,
      currentPage: data.meta.currentPage,
      itemsPerPage: data.meta.itemsPerPage,
    }
  }

  return (
    <Layout>
      <Head>
        <title>{`Home - ${t("nav.siteTitlePartners")}`}</title>
      </Head>
      <NavigationHeader title={t("nav.listings")}></NavigationHeader>
      <section>
        <div className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="flex gap-2 items-center w-full mb-4 justify-end">
            {isAdmin && (
              <>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    if (defaultJurisdiction && !isNonRegulatedEnabled && !isLandUseEnabled) {
                      void router.push({
                        pathname: "/listings/add",
                        query: { jurisdictionId: defaultJurisdiction },
                      })
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
          <DataTable
            description={t("nav.listings")}
            columns={columns}
            enableHorizontalScroll={true}
            initialSort={[{ id: "status", desc: false }]}
            minSearchCharacters={MIN_SEARCH_CHARACTERS}
            fetchData={fetchListingsData}
          />
        </div>
      </section>

      <Dialog
        isOpen={listingSelectModal}
        ariaLabelledBy="listing-select-dialog-header"
        ariaDescribedBy="listing-select-dialog-content"
        onClose={() => onModalClose()}
      >
        <Dialog.Header id="listing-select-dialog-header">
          {defaultJurisdiction
            ? t("listings.selectListingType")
            : t("listings.selectJurisdictionTitle")}
        </Dialog.Header>
        <Dialog.Content id="listing-select-dialog-content">
          <Form id="listing-select-form" onSubmit={handleSubmit(onSubmit)}>
            {t("listings.selectJurisdictionContent")}
            <Grid>
              <Grid.Row columns={3} className={"seeds-m-bs-4"}>
                <Grid.Cell className={"seeds-grid-span-2"}>
                  <div className={`${defaultJurisdiction ? "hidden" : ""}`}>
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
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                          const selectedJurisdictionId = e.target?.value
                          const landUseEnabled =
                            !!selectedJurisdictionId &&
                            doJurisdictionsHaveFeatureFlagOn(
                              FeatureFlagEnum.enableLandUse,
                              selectedJurisdictionId
                            )
                          setIsLandUseEnabled(landUseEnabled)
                          setIsNonRegulatedEnabled(
                            !landUseEnabled &&
                              !!selectedJurisdictionId &&
                              doJurisdictionsHaveFeatureFlagOn(
                                FeatureFlagEnum.enableNonRegulatedListings,
                                selectedJurisdictionId
                              )
                          )
                          clearErrors("jurisdiction")
                        },
                        "aria-required": true,
                        "aria-hidden": !!defaultJurisdiction,
                      }}
                    />
                  </div>
                </Grid.Cell>
              </Grid.Row>
              {otherPortalsTitle && !defaultJurisdiction && (
                <Grid.Row>
                  <Grid.Cell>
                    <div
                      className={styles["other-portals-banner"]}
                      data-testid={"other-portals-banner"}
                    >
                      <p>{otherPortalsTitle}</p>
                      <ul>
                        {otherPortals.map(({ name, url }) => (
                          <li key={url}>
                            <Link href={url}>{name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Grid.Cell>
                </Grid.Row>
              )}
              {isLandUseEnabled && (
                <div aria-live="polite">
                  <fieldset>
                    <legend className={`text__caps-spaced`}>{t("listings.landUseTitle")}</legend>
                    <Grid.Row columns={4}>
                      <Grid.Cell className={"seeds-grid-span-2"}>
                        <div className="pb-4 sm:pb-0">
                          <Field
                            name="listingType"
                            type="radio"
                            className="mr-4"
                            register={register}
                            id={EnumListingListingType.landUse}
                            label={t("t.yes")}
                            inputProps={{
                              value: EnumListingListingType.landUse,
                            }}
                          />
                        </div>
                      </Grid.Cell>
                      <Grid.Cell className={"seeds-grid-span-2"}>
                        <div>
                          <Field
                            name="listingType"
                            type="radio"
                            register={register}
                            id="landUseNo"
                            label={t("t.no")}
                            inputProps={{
                              value: EnumListingListingType.regulated,
                              defaultChecked: true,
                            }}
                          />
                        </div>
                      </Grid.Cell>
                    </Grid.Row>
                  </fieldset>
                </div>
              )}
              {isNonRegulatedEnabled && !isLandUseEnabled && (
                <div aria-live="polite">
                  <fieldset>
                    <legend className={`text__caps-spaced`}>
                      {t("listings.listingTypeTitle")}
                    </legend>
                    <Grid.Row columns={4}>
                      <Grid.Cell className={"seeds-grid-span-2"}>
                        <div className="pb-4 sm:pb-0">
                          <Field
                            name="listingType"
                            type="radio"
                            className="mr-4"
                            register={register}
                            id={EnumListingListingType.regulated}
                            label={t("listings.regulated")}
                            inputProps={{
                              value: EnumListingListingType.regulated,
                              defaultChecked: true,
                            }}
                            subNote={t("listings.listingType.regulated.description")}
                          />
                        </div>
                      </Grid.Cell>
                      <Grid.Cell className={"seeds-grid-span-2"}>
                        <div>
                          <Field
                            name="listingType"
                            type="radio"
                            register={register}
                            id={EnumListingListingType.nonRegulated}
                            label={t("listings.nonRegulated")}
                            inputProps={{
                              value: EnumListingListingType.nonRegulated,
                            }}
                            subNote={t("listings.listingType.nonRegulated.description")}
                          />
                        </div>
                      </Grid.Cell>
                    </Grid.Row>
                  </fieldset>
                </div>
              )}
            </Grid>
          </Form>
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            variant="primary"
            size="sm"
            type={"submit"}
            nativeButtonProps={{ form: "listing-select-form" }}
          >
            {t("listings.getStarted")}
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
      </Dialog>
    </Layout>
  )
}
