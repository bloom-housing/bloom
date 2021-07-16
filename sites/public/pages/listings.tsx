import Head from "next/head"
import {
  ListingsList,
  PageHeader,
  Button,
  AppearanceSizeType,
  Modal,
  Drawer,
  AppearanceStyleType,
  AppearanceBorderType,
  t,
  Select,
  AgPagination,
  Form,
} from "@bloom-housing/ui-components"
import { useForm } from "react-hook-form"
import Layout from "../layouts/application"
import { MetaTags } from "../src/MetaTags"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useListingsData } from "../lib/hooks"

const ListingsPage = () => {
  const router = useRouter()

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 10

  function setPage(page: number) {
    if (page != currentPage) {
      void router.push(
        {
          pathname: "/listings",
          query: { page: page },
        },
        undefined,
        { shallow: true }
      )
      setCurrentPage(page)
    }
  }

  // Checks if the url is updated manually.
  useEffect(() => {
    if (router.query.page && Number(router.query.page) != currentPage) {
      setCurrentPage(Number(router.query.page))
    }
  }, [currentPage, router.query.page])

  const { listingsData, listingsLoading } = useListingsData(currentPage, itemsPerPage)

  const pageTitle = `${t("pageTitle.rent")} - ${t("nav.siteTitle")}`
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false)
  const [filterDrawerVisible, setFilterDrawerVisible] = useState<boolean>(false)

  const preferredUnitOptions = ["1", "2", "3", "4", "studio"]
  const accessibilityOptions = ["n", "y"]
  const communityOptions = ["general", "senior", "assisted"]
  /* Form Handler */
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, register } = useForm()
  const onSubmit = () => {
    // Not yet implemented.
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
        actions={[
          <Button
            onClick={() => setFilterModalVisible(false)}
            styleType={AppearanceStyleType.primary}
          >
            Apply
          </Button>,
          <Button
            onClick={() => setFilterModalVisible(false)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Close
          </Button>,
        ]}
        hideCloseIcon
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-card__group">
            <p className="field-note mb-4">{t("listingFilters.modalHeader")}</p>
            <Select
              id="filter.unitOptions"
              name="filter.unitOptions"
              label={t("listingFilters.unitOptions.label")}
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={preferredUnitOptions}
              keyPrefix="listingFilters.unitOptions.unitOptionsTypes"
            />
            <Select
              id="filter.accessibilityOptions"
              name="filter.accessibilityOptions"
              label={t("listingFilters.accessibilityOptions.label")}
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={accessibilityOptions}
              keyPrefix="listingFilters.accessibilityOptions.accessibilityOptionsTypes"
            />
            <Select
              id="filter.communityOptions"
              name="filter.communityOptions"
              label={t("listingFilters.communityOptions.label")}
              validation={{ required: true }}
              register={register}
              controlClassName="control"
              options={communityOptions}
              keyPrefix="listingFilters.communityOptions.communityOptionsTypes"
            />
          </div>
        </Form>
      </Modal>
      <Drawer
        open={filterDrawerVisible}
        title="Drawer Title"
        onClose={() => setFilterDrawerVisible(false)}
        actions={[
          <Button
            key={0}
            onClick={() => setFilterDrawerVisible(false)}
            styleType={AppearanceStyleType.primary}
          >
            Submit
          </Button>,
          <Button
            key={1}
            onClick={() => setFilterDrawerVisible(false)}
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
          >
            Cancel
          </Button>,
        ]}
      >
        <p>Placeholder for future text</p>
      </Drawer>
      <div className="max-w-3xl m-auto">
        <Button size={AppearanceSizeType.small} onClick={() => setFilterModalVisible(true)}>
          {/* TODO:avaleske make this a string */}
          Filter listings
        </Button>
        <Button size={AppearanceSizeType.small} onClick={() => setFilterDrawerVisible(true)}>
          {/* TODO:avaleske make this a string */}
          Filter listings (drawer)
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
            sticky={true}
            quantityLabel={t("listings.totalListings")}
            setCurrentPage={setPage}
          />
        </div>
      )}
    </Layout>
  )
}

export default ListingsPage
