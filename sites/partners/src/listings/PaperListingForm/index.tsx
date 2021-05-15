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
  Preference,
  Property,
  CSVFormattingType,
  CountyCode,
  Asset,
  ApplicationMethod,
  ListingEvent,
} from "@bloom-housing/backend-core/types"

import Aside from "../Aside"
import FormListingData from "./sections/FormListingData"

type ListingFormProps = {
  listing?: Listing
  editMode?: boolean
}

type AlertErrorType = "api" | "form"

interface FormInputs {
  name: string
  applicationDueDate?: Date
  preferences: Preference[]
  property: Property
  status: ListingStatus
  CSVFormattingType?: CSVFormattingType
  countyCode: CountyCode
  assets: Asset[]
  applicationMethods: ApplicationMethod[]
  events: ListingEvent[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode }: ListingFormProps) => {
  const defaultValues = editMode
    ? listing
    : {
        name: "",
        preferences: [],
        property: {
          developer: "",
        },
        status: ListingStatus.pending,
        CSVFormattingType: CSVFormattingType.basic,
        countyCode: CountyCode.Alameda,
        assets: [],
        applicationMethods: [],
        events: [],
      }

  const formMethods = useForm<FormInputs>({
    defaultValues,
  })

  const router = useRouter()

  const { listingsService } = useContext(ApiClientContext)

  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, clearErrors, reset, trigger, getValues } = formMethods

  const triggerSubmit = async (data: FormInputs) => onSubmit(data, "details")

  const setStatusAndSubmit = async (status: ListingStatus) => {
    const validation = await trigger()

    if (validation) {
      let data = getValues()
      // TODO: replace with real fields
      console.log("data before = ", data)
      data = {
        ...data,
        status,
        CSVFormattingType: CSVFormattingType.basic,
        countyCode: CountyCode.Alameda,
        preferences: [],
        assets: [],
        applicationMethods: [],
        events: [],
        applicationDueDate: new Date(data.applicationDueDate),
      }
      data.property = {
        ...data.property,
        id: "4b237295-38a8-4795-95fd-1bec08723e6d",
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
  const onSubmit = async (data: FormInputs, redirect: "details" | "new") => {
    setAlert(null)
    setLoading(true)
    console.log("onSubmit data = ", data)
    try {
      const result = editMode
        ? await listingsService.update({
            listingId: listing?.id,
            body: { ...data },
          })
        : await listingsService.create({ body: data })
      console.log("result = ", result)
      setLoading(false)

      if (result) {
        setSiteAlertMessage(
          editMode ? t("listing.listingUpdated") : t("listing.listingSubmitted"),
          "success"
        )

        if (redirect === "details") {
          void router.push(`/listing?id=${result.id}`)
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
