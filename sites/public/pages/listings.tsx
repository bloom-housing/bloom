import Head from "next/head"
import {
  ListingsList,
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
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"
import {
  EnumListingFilterParamsComparison,
  ListingFilterKeys,
  ListingFilterParams,
} from "@bloom-housing/backend-core/types"

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
    { value: "one", label: "1 Bedroom" },
    { value: "two", label: "2 Bedroom" },
    { value: "three", label: "3 Bedroom" },
    { value: "four", label: "4 Bedroom" },
    { value: "studio", label: "Studio" },
  ]
  const accessibilityOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "n", label: "No" },
    { value: "y", label: "Yes" },
  ]
  const communityOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "general", label: "General" },
    { value: "senior", label: "Senior" },
    { value: "assisted", label: "Assisted" },
  ]
  const neighborhoodOptions: SelectOption[] = [
    EMPTY_OPTION,
    { value: "Foster City", label: "Foster City" },
  ]

  function setQueryString(page: number, filters = filterState) {
    const query = { page: page }
    for (const filterKey in filters) {
      const filterValue = filters[filterKey]
      if (filterValue) {
        query[filterKey] = filterValue
      }
    }
    void router.push(
      {
        pathname: "/listings",
        query: query,
      },
      undefined,
      { shallow: true }
    )
  }

  // Checks for changes in url params.
  useEffect(() => {
    if (router.query.page) {
      setCurrentPage(Number(router.query.page))
    }

    const updatedFilters: ListingFilterParams = {
      $comparison: EnumListingFilterParamsComparison["="],
    }
    for (const filterKey in ListingFilterKeys) {
      const filterValue = router.query[filterKey]
      if (filterValue) {
        updatedFilters[filterKey] = filterValue
      }
    }
    setFilterState(updatedFilters)
  }, [router.query])

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage, filterState)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()
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
        actions={[]}
        hideCloseIcon
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("listingFilters.modalHeader")}</p>
            <Select
              id="unitOptions"
              name="preferredUnit"
              label="Unit Options"
              register={register}
              controlClassName="control"
              options={preferredUnitOptions}
            />
            <Select
              id="accessibilityOptions"
              name="accessibility"
              label="Accessibility"
              register={register}
              controlClassName="control"
              options={accessibilityOptions}
            />
            <Select
              id="communityOptions"
              name="community"
              label="Community Type"
              register={register}
              controlClassName="control"
              options={communityOptions}
            />
            <Select
              id="neighborhoodOptions"
              name={ListingFilterKeys.neighborhood}
              label={t("listingFilters.neighborhood")}
              register={register}
              controlClassName="control"
              options={neighborhoodOptions}
              defaultValue={filterState?.neighborhood}
            />
          </div>
          <div className="text-center mt-6">
            <Button styleType={AppearanceStyleType.primary}>Apply Filters</Button>
          </div>
          <div className="text-center mt-6">
            <a href="#" onClick={() => setFilterModalVisible(false)}>
              {t("t.cancel")}
            </a>
          </div>
        </Form>
      </Modal>
      <div className="max-w-3xl m-auto">
        <Button size={AppearanceSizeType.small} onClick={() => setFilterModalVisible(true)}>
          {/* TODO:avaleske make this a string */}
          Filter listings
        </Button>
      </div>
      {!listingsLoading && (
        <div>
          {listingsData && <ListingsList listings={listingsData.items} />}
          <AgPagination
            totalItems={listingsData?.meta.totalItems}
            totalPages={listingsData?.meta.totalPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            quantityLabel={t("applications.totalApplications")}
            setCurrentPage={setQueryString}
          />
        </div>
      )}
    </Layout>
  )
}
export default ListingsPage
