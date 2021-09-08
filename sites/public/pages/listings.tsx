import Head from "next/head"
import {
  PageHeader,
  AgPagination,
  Button,
  AppearanceSizeType,
  Modal,
  AppearanceStyleType,
  t,
  Select,
  Form,
  SelectOption,
  encodeToFrontendFilterString,
  decodeFiltersFromFrontendUrl,
  LinkButton,
  Field,
  StatusBarType,
  ApplicationStatusType,
  openDateState,
  ListingCard,
  imageUrlFromListing,
  getSummariesTableFromUnitsSummary,
  getSummariesTableFromUnitSummary,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"
import {
  ListingFilterKeys,
  AvailabilityFilterEnum,
  ListingFilterParams,
  Listing,
  ListingReviewOrder,
  Address,
} from "@bloom-housing/backend-core/types"
import moment from "moment"

const isValidZipCodeOrEmpty = (value: string) => {
  // Empty strings or whitespace are valid and will reset the filter.
  if (!value.trim()) {
    return true
  }
  let returnValue = true
  value.split(",").forEach((element) => {
    if (!/^[0-9]{5}$/.test(element.trim())) {
      returnValue = false
    }
  })
  return returnValue
}

const getListingImageCardStatus = (listing: Listing): StatusBarType => {
  let content = ""
  let subContent = ""
  let formattedDate = ""
  let appStatus = ApplicationStatusType.Open

  if (openDateState(listing)) {
    const date = listing.applicationOpenDate
    const openDate = moment(date)
    formattedDate = openDate.format("MMM. D, YYYY")
    content = t("listings.applicationOpenPeriod")
  } else {
    if (listing.applicationDueDate) {
      const dueDate = moment(listing.applicationDueDate)
      const dueTime = moment(listing.applicationDueTime)
      formattedDate = dueDate.format("MMM. DD, YYYY")

      if (listing.applicationDueTime) {
        formattedDate = formattedDate + ` ${t("t.at")} ` + dueTime.format("h:mm A")
      }

      // if due date is in future, listing is open
      if (moment() < dueDate) {
        content = t("listings.applicationDeadline")
      } else {
        appStatus = ApplicationStatusType.Closed
        content = t("listings.applicationsClosed")
      }
    }
  }

  if (formattedDate != "") {
    content = content + `: ${formattedDate}`
  }

  if (listing.reviewOrderType === ListingReviewOrder.firstComeFirstServe) {
    subContent = content
    content = t("listings.applicationFCFS")
  }

  return {
    status: appStatus,
    content,
    subContent,
  }
}

const getListingCardSubtitle = (address: Address) => {
  const { street, city, state, zipCode } = address || {}
  return address ? `${street}, ${city} ${state}, ${zipCode}` : null
}

const getListingTableData = (listing: Listing) => {
  if (listing.unitsSummary !== undefined && listing.unitsSummary.length > 0) {
    return getSummariesTableFromUnitsSummary(listing.unitsSummary)
  } else if (listing.unitsSummarized !== undefined) {
    return getSummariesTableFromUnitSummary(listing.unitsSummarized.byUnitTypeAndRent)
  }
  return []
}

const getListings = (listings: Listing[]) => {
  const unitSummariesHeaders = {
    unitType: t("t.unitType"),
    minimumIncome: t("t.minimumIncome"),
    rent: t("t.rent"),
  }
  return listings.map((listing: Listing, index) => {
    return (
      <ListingCard
        key={index}
        imageCardProps={{
          imageUrl:
            imageUrlFromListing(listing, parseInt(process.env.listingPhotoSize || "1302")) || "",
          subtitle: getListingCardSubtitle(listing.buildingAddress),
          title: listing.name,
          href: `/listing/${listing.id}/${listing.urlSlug}`,
          tagLabel: listing.reservedCommunityType
            ? t(`listings.reservedCommunityTypes.${listing.reservedCommunityType.name}`)
            : undefined,
          statuses: [getListingImageCardStatus(listing)],
        }}
        tableProps={{
          headers: unitSummariesHeaders,
          data: getListingTableData(listing),
          responsiveCollapse: true,
          cellClassName: "px-5 py-3",
        }}
        seeDetailsLink={`/listing/${listing.id}/${listing.urlSlug}`}
        tableHeader={listing.showWaitlist ? t("listings.waitlist.open") : null}
      />
    )
  })
}

const ListingsPage = () => {
  const router = useRouter()

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [filterState, setFilterState] = useState<ListingFilterParams>()
  const itemsPerPage = 10

  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)

  // TODO: Select options should come from the database (#252)
  const EMPTY_OPTION = { value: "", label: "" }
  const preferredUnitOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "0", label: t("listingFilters.bedroomsOptions.studioPlus") },
    { value: "1", label: t("listingFilters.bedroomsOptions.onePlus") },
    { value: "2", label: t("listingFilters.bedroomsOptions.twoPlus") },
    { value: "3", label: t("listingFilters.bedroomsOptions.threePlus") },
    { value: "4", label: t("listingFilters.bedroomsOptions.fourPlus") },
  ]
  const adaCompliantOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "n", label: t("t.no") },
    { value: "y", label: t("t.yes") },
  ]
  const communityTypeOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "all", label: t("listingFilters.communityTypeOptions.all") },
    { value: "senior", label: t("listingFilters.communityTypeOptions.senior") },
    {
      value: "specialNeedsAndDisability",
      label: t("listingFilters.communityTypeOptions.specialNeeds"),
    },
  ]
  const neighborhoodOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "Foster City", label: "Foster City" },
  ]
  const availabilityOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: AvailabilityFilterEnum.hasAvailability, label: t("listingFilters.hasAvailability") },
    { value: AvailabilityFilterEnum.noAvailability, label: t("listingFilters.noAvailability") },
    { value: AvailabilityFilterEnum.waitlist, label: t("listingFilters.waitlist") },
  ]

  function setQueryString(page: number, filters = filterState) {
    void router.push(`/listings?page=${page}${encodeToFrontendFilterString(filters)}`, undefined, {
      shallow: true,
    })
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }

    setFilterState(decodeFiltersFromFrontendUrl(router.query))
  }, [router.query])

  const { listingsData, listingsLoading, listingsError } = useListingsData(
    currentPage,
    itemsPerPage,
    filterState
  )

  let numberOfFilters = 0
  if (filterState) {
    numberOfFilters = Object.keys(filterState).filter((p) => p !== "$comparison").length
    // We want to consider rent as a single filter, so if both min and max are defined, reduce the count.
    if (filterState.minRent !== undefined && filterState.maxRent != undefined) {
      numberOfFilters -= 1
    }
  }

  const buttonTitle = numberOfFilters
    ? t("listingFilters.buttonTitleWithNumber", { number: numberOfFilters })
    : t("listingFilters.buttonTitle")

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register, errors } = useForm()
  const onSubmit = (data: ListingFilterParams) => {
    setFilterModalVisible(false)
    setQueryString(/*page=*/ 1, data)
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader title={t("pageTitle.rent")} />
      <Modal
        open={filterModalVisible}
        title={t("listingFilters.modalTitle")}
        onClose={() => setFilterModalVisible(false)}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("listingFilters.modalHeader")}</p>
            <Select
              id={"availability"}
              name={"availability"}
              label={t("listingFilters.availability")}
              register={register}
              controlClassName="control"
              options={availabilityOptions}
              defaultValue={filterState?.availability}
            />
            <Select
              id="unitOptions"
              name={ListingFilterKeys.bedrooms}
              label={t("listingFilters.bedrooms")}
              register={register}
              controlClassName="control"
              options={preferredUnitOptions}
              defaultValue={filterState?.bedrooms?.toString()}
            />
            <Field
              id="zipCodeField"
              name={ListingFilterKeys.zipcode}
              label={t("listingFilters.zipCode")}
              register={register}
              controlClassName="control"
              placeholder={t("listingFilters.zipCodeDescription")}
              validation={{
                validate: (value) => isValidZipCodeOrEmpty(value),
              }}
              error={errors.zipCodeField}
              errorMessage={t("errors.multipleZipCodeError")}
              defaultValue={filterState?.zipcode}
            />
            <label className="field-label">Rent Range</label>
            <div className="flex flex-row">
              <Field
                id="minRent"
                name={ListingFilterKeys.minRent}
                register={register}
                type="number"
                placeholder={t("t.min")}
                prepend="$"
                defaultValue={filterState?.minRent}
              />
              <div className="flex items-center p-3">{t("t.to")}</div>
              <Field
                id="maxRent"
                name={ListingFilterKeys.maxRent}
                register={register}
                type="number"
                placeholder={t("t.max")}
                prepend="$"
                defaultValue={filterState?.maxRent}
              />
            </div>
            <Select
              id="neighborhoodOptions"
              name={ListingFilterKeys.neighborhood}
              label={t("listingFilters.neighborhood")}
              register={register}
              controlClassName="control"
              options={neighborhoodOptions}
              defaultValue={filterState?.neighborhood}
            />
            <Select
              id="adaCompliant"
              name="adaCompliant"
              label={t("listingFilters.adaCompliant")}
              register={register}
              controlClassName="control"
              options={adaCompliantOptions}
            />
            <Select
              id="communityType"
              name="communityType"
              label={t("listingFilters.communityType")}
              register={register}
              controlClassName="control"
              options={communityTypeOptions}
            />
          </div>
          <div className="text-center mt-6">
            <Button type="submit" styleType={AppearanceStyleType.primary}>
              {t("listingFilters.applyFilters")}
            </Button>
          </div>
        </Form>
      </Modal>
      <div className="container max-w-3xl px-4 content-start mx-auto">
        <LinkButton
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          href="/eligibility/welcome"
        >
          {t("welcome.checkEligibility")}
        </LinkButton>
        <Button
          className="mx-2 mt-6"
          size={AppearanceSizeType.small}
          onClick={() => setFilterModalVisible(true)}
        >
          {buttonTitle}
        </Button>
        {numberOfFilters > 0 && (
          <Button
            className="mx-2 mt-6"
            size={AppearanceSizeType.small}
            styleType={AppearanceStyleType.secondary}
            // "Submit" the form with no params to trigger a reset.
            onClick={() => setQueryString(1, null)}
            icon="close"
            iconPlacement="left"
          >
            {t("listingFilters.resetButton")}
          </Button>
        )}
      </div>
      {!listingsLoading && !listingsError && listingsData?.meta.totalItems === 0 && (
        <div className="container max-w-3xl my-4 px-4 content-start mx-auto">
          <header>
            <h2 className="page-header__title">{t("listingFilters.noResults")}</h2>
            <p className="page-header__lead">{t("listingFilters.noResultsSubtitle")}</p>
          </header>
        </div>
      )}
      {!listingsLoading && (
        <div>
          {listingsData?.meta.totalItems > 0 && getListings(listingsData?.items)}
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={setQueryString}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
