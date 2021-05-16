import React, { useState, useContext } from "react"
import { useRouter } from "next/router"
import {
  ApiClientContext,
  t,
  Form,
  AlertBox,
  setSiteAlertMessage,
  LoadingOverlay,
  StatusBar,
  AppearanceStyleType,
  Button,
} from "@bloom-housing/ui-components"
import { useForm, FormProvider } from "react-hook-form"
import {
  Listing,
  ListingStatus,
  CSVFormattingType,
  CountyCode,
} from "@bloom-housing/backend-core/types"

import Aside from "../Aside"
import FormListingData from "./sections/FormListingData"

type ListingFormProps = {
  listing?: Listing
  editMode?: boolean
}

type AlertErrorType = "api" | "form"

const defaults: Listing = {
  applicationMethods: [],
  assets: [],
  name: "",
  preferences: [],
  property: {
    buildingAddress: {},
    units: [],
  },
  countyCode: CountyCode.Alameda,
  CSVFormattingType: CSVFormattingType.basic,
  events: [],
  status: ListingStatus.pending,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode }: ListingFormProps) => {
  const defaultValues = editMode ? listing : defaults
  const formMethods = useForm<Listing>({
    defaultValues,
  })

  const router = useRouter()

  const { listingsService } = useContext(ApiClientContext)

  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, clearErrors, reset, trigger, getValues } = formMethods

  const triggerSubmit = async (data: Listing) => onSubmit(data, "details")

  const setStatusAndSubmit = async (status: ListingStatus) => {
    const validation = await trigger()

    if (validation) {
      let data = getValues()
      // just for the poc
      if (!data.property.id) {
        data.property.id = "4b237295-38a8-4795-95fd-1bec08723e6d"
      }

      data = {
        ...defaultValues,
        ...data,
        status,
      }

      if (data) {
        void onSubmit(data, editMode ? "details" : "new")
      }
    }
  }

  /*
    @data: form data comes from the react-hook-form
    @redirect: open listing details or reset form
  */
  const onSubmit = async (data: Listing, redirect: "details" | "new") => {
    setAlert(null)
    setLoading(true)
    try {
      const result = editMode
        ? await listingsService.update({
            listingId: listing?.id,
            body: { ...data },
          })
        : await listingsService.create({ body: data })
      setLoading(false)

      if (result) {
        setSiteAlertMessage(
          editMode ? t("listings.listingUpdated") : t("listings.listingSubmitted"),
          "success"
        )

        if (redirect === "details") {
          void router.push(`/listings?id=${result.id}`)
        } else {
          reset()
          clearErrors()
          setAlert(null)
          void router.push("/")
        }
      }
    } catch (err) {
      setLoading(false)
      setAlert("api")
    }
  }

  const onError = () => {
    setAlert("form")
  }

  return (
    <LoadingOverlay isLoading={loading}>
      <>
        <StatusBar
          backButton={
            <Button
              inlineIcon="left"
              icon="arrow-back"
              onClick={() => (editMode ? router.push(`/listing?id=${listing?.id}`) : router.back())}
            >
              {t("t.back")}
            </Button>
          }
          tagStyle={
            listing?.status == ListingStatus.active
              ? AppearanceStyleType.success
              : AppearanceStyleType.primary
          }
          tagLabel={
            listing?.status
              ? t(`listings.listingStatus.${listing.status}`)
              : t(`listings.listingStatus.pending`)
          }
        />

        <FormProvider {...formMethods}>
          <section className="bg-primary-lighter py-5">
            <div className="max-w-screen-xl px-5 mx-auto">
              {alert && (
                <AlertBox className="mb-5" onClose={() => setAlert(null)} closeable type="alert">
                  {alert === "form"
                    ? t("listing.add.listingAddError")
                    : t("errors.alert.badRequest")}
                </AlertBox>
              )}

              <Form id="listing-form" onSubmit={handleSubmit(triggerSubmit, onError)}>
                <div className="flex flex-row flex-wrap">
                  <div className="info-card md:w-9/12">
                    <FormListingData />
                  </div>

                  <aside className="md:w-3/12 md:pl-6">
                    <Aside
                      type={editMode ? "edit" : "add"}
                      setStatusAndSubmit={setStatusAndSubmit}
                    />
                  </aside>
                </div>
              </Form>
            </div>
          </section>
        </FormProvider>
      </>
    </LoadingOverlay>
  )
}

export default ListingForm
