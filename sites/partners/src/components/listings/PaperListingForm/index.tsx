import React, { useState, useCallback, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import {
  t,
  Form,
  AlertBox,
  setSiteAlertMessage,
  LoadingOverlay,
  AppearanceStyleType,
  Button,
  Modal,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  LatitudeLongitude,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
import { AuthContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import { useForm, FormProvider } from "react-hook-form"
import {
  ListingStatus,
  ListingEventType,
  ApplicationSection,
  MultiselectQuestion,
} from "@bloom-housing/backend-core/types"
import {
  AlertErrorType,
  FormListing,
  TempEvent,
  TempUnit,
  formDefaults,
} from "../../../lib/listings/formTypes"
import ListingDataPipeline from "../../../lib/listings/ListingDataPipeline"

import Aside from "../Aside"
import AdditionalDetails from "./sections/AdditionalDetails"
import AdditionalEligibility from "./sections/AdditionalEligibility"
import LeasingAgent from "./sections/LeasingAgent"
import AdditionalFees from "./sections/AdditionalFees"
import Units from "./sections/Units"
import BuildingDetails from "./sections/BuildingDetails"
import ListingIntro from "./sections/ListingIntro"
import ListingPhotos from "./sections/ListingPhotos"
import BuildingFeatures from "./sections/BuildingFeatures"
import RankingsAndResults from "./sections/RankingsAndResults"
import ApplicationAddress from "./sections/ApplicationAddress"
import ApplicationDates from "./sections/ApplicationDates"
import LotteryResults from "./sections/LotteryResults"
import ApplicationTypes from "./sections/ApplicationTypes"
import SelectAndOrder from "./sections/SelectAndOrder"
import CommunityType from "./sections/CommunityType"
import BuildingSelectionCriteria from "./sections/BuildingSelectionCriteria"
import { getReadableErrorMessage } from "../PaperListingDetails/sections/helpers"
import { useJurisdictionalMultiselectQuestionList } from "../../../lib/hooks"
import { StatusBar } from "../../../components/shared/StatusBar"
import { Listing } from "@bloom-housing/shared-helpers/src/types/backend-swagger"

type ListingFormProps = {
  listing?: FormListing
  editMode?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode }: ListingFormProps) => {
  const defaultValues = editMode ? listing : formDefaults
  const formMethods = useForm<FormListing>({
    defaultValues,
    shouldUnregister: false,
  })

  const router = useRouter()

  const { listingsService, profile } = useContext(AuthContext)

  const [tabIndex, setTabIndex] = useState(0)
  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [units, setUnits] = useState<TempUnit[]>([])
  const [openHouseEvents, setOpenHouseEvents] = useState<TempEvent[]>([])
  const [preferences, setPreferences] = useState<MultiselectQuestion[]>(
    listingSectionQuestions(listing as unknown as Listing, ApplicationSection.preferences)?.map(
      (listingPref) => {
        return { ...listingPref?.multiselectQuestions } as unknown as MultiselectQuestion
      }
    ) ?? []
  )
  const [programs, setPrograms] = useState<MultiselectQuestion[]>(
    listingSectionQuestions(listing as unknown as Listing, ApplicationSection.programs)?.map(
      (listingProg) => {
        return { ...listingProg?.multiselectQuestions } as unknown as MultiselectQuestion
      }
    ) ?? []
  )

  const [latLong, setLatLong] = useState<LatitudeLongitude>({
    latitude: listing?.buildingAddress?.latitude ?? null,
    longitude: listing?.buildingAddress?.longitude ?? null,
  })
  const [customMapPositionChosen, setCustomMapPositionChosen] = useState(
    listing?.customMapPin || false
  )

  const setLatitudeLongitude = (latlong: LatitudeLongitude) => {
    if (!loading) {
      setLatLong(latlong)
    }
  }

  /**
   * Close modal
   */
  const [closeModal, setCloseModal] = useState(false)

  /**
   * Publish modal
   */
  const [publishModal, setPublishModal] = useState(false)

  /**
   * Lottery results drawer
   */
  const [lotteryResultsDrawer, setLotteryResultsDrawer] = useState(false)

  /**
   * Save already-live modal
   */
  const [listingIsAlreadyLiveModal, setListingIsAlreadyLiveModal] = useState(false)

  useEffect(() => {
    if (listing?.units) {
      const tempUnits = listing.units.map((unit, i) => ({
        ...unit,
        tempId: i + 1,
      }))
      setUnits(tempUnits)
    }

    if (listing?.events) {
      setOpenHouseEvents(
        listing.events
          .filter((event) => event.type === ListingEventType.openHouse)
          .map((event) => {
            return {
              ...event,
              startTime: new Date(event.startTime),
              endTime: new Date(event.endTime),
            }
          })
          .sort((a, b) => (dayjs(a.startTime).isAfter(b.startTime) ? 1 : -1))
      )
    }
  }, [listing?.units, listing?.events, setUnits, setOpenHouseEvents])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getValues, setError, clearErrors, reset } = formMethods

  const triggerSubmitWithStatus = (
    confirm?: boolean,
    status?: ListingStatus,
    newData?: Partial<FormListing>
  ) => {
    if (confirm && status === ListingStatus.active) {
      if (listing?.status === ListingStatus.active) {
        setListingIsAlreadyLiveModal(true)
      } else {
        setPublishModal(true)
      }
      return
    }
    let formData = { ...defaultValues, ...getValues(), ...(newData || {}) }
    if (status) {
      formData = { ...formData, status }
    }
    void onSubmit(formData)
  }

  const onSubmit = useCallback(
    async (formData: FormListing) => {
      if (!loading) {
        try {
          setLoading(true)
          clearErrors()

          const dataPipeline = new ListingDataPipeline(formData, {
            preferences,
            programs,
            units,
            openHouseEvents,
            profile,
            latLong,
            customMapPositionChosen,
          })
          const formattedData = await dataPipeline.run()

          const result = editMode
            ? await listingsService.update({
                id: listing.id,
                body: { id: listing.id, ...formattedData },
              })
            : await listingsService.create({ body: formattedData })
          reset(formData)

          if (result) {
            setSiteAlertMessage(
              editMode ? t("listings.listingUpdated") : t("listings.listingSubmitted"),
              "success"
            )

            await router.push(`/listings/${result.id}`)
          }
          setLoading(false)
        } catch (err) {
          reset(formData)
          setLoading(false)
          clearErrors()
          const { data } = err.response || {}
          if (data?.statusCode === 400) {
            data?.message?.forEach((errorMessage: string) => {
              const fieldName = errorMessage.split(" ")[0]
              const readableError = getReadableErrorMessage(errorMessage)
              if (readableError) {
                setError(fieldName, { message: readableError })
                if (fieldName === "buildingAddress" || fieldName === "buildingAddress.nested") {
                  const setIfEmpty = (
                    fieldName: string,
                    fieldValue: string,
                    errorMessage: string
                  ) => {
                    if (!fieldValue) {
                      setError(fieldName, { message: errorMessage })
                    }
                  }
                  const address = formData.buildingAddress
                  setIfEmpty(`buildingAddress.city`, address.city, readableError)
                  setIfEmpty(`buildingAddress.state`, address.state, readableError)
                  setIfEmpty(`buildingAddress.street`, address.street, readableError)
                  setIfEmpty(`buildingAddress.zipCode`, address.zipCode, readableError)
                }
              }
            })
            setAlert("form")
          } else {
            setAlert("api")
          }
        }
      }
    },
    [
      units,
      openHouseEvents,
      editMode,
      listingsService,
      listing,
      router,
      preferences,
      programs,
      latLong,
      customMapPositionChosen,
      clearErrors,
      loading,
      reset,
      setError,
      profile,
    ]
  )

  return loading === true ? null : (
    <>
      <LoadingOverlay isLoading={loading}>
        <>
          <StatusBar
            tagStyle={(() => {
              switch (listing?.status) {
                case ListingStatus.active:
                  return AppearanceStyleType.success
                case ListingStatus.closed:
                  return AppearanceStyleType.closed
                default:
                  return AppearanceStyleType.primary
              }
            })()}
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
                    {alert === "form" ? t("listings.fieldError") : t("errors.alert.badRequest")}
                  </AlertBox>
                )}

                <Form id="listing-form">
                  <div className="flex flex-row flex-wrap">
                    <div className="md:w-9/12 pb-24">
                      <Tabs
                        forceRenderTabPanel={true}
                        selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}
                      >
                        <TabList>
                          <Tab>Listing Details</Tab>
                          <Tab>Application Process</Tab>
                        </TabList>
                        <TabPanel>
                          <ListingIntro jurisdictions={profile.jurisdictions} />
                          <ListingPhotos />
                          <BuildingDetails
                            listing={listing}
                            setLatLong={setLatitudeLongitude}
                            latLong={latLong}
                            customMapPositionChosen={customMapPositionChosen}
                            setCustomMapPositionChosen={setCustomMapPositionChosen}
                          />
                          <CommunityType listing={listing} />
                          <Units
                            units={units}
                            setUnits={setUnits}
                            disableUnitsAccordion={listing?.disableUnitsAccordion}
                          />
                          <SelectAndOrder
                            addText={t("listings.addPreference")}
                            drawerTitle={t("listings.addPreferences")}
                            editText={t("listings.editPreferences")}
                            listingData={preferences}
                            setListingData={setPreferences}
                            subtitle={t("listings.sections.housingPreferencesSubtext")}
                            title={t("listings.sections.housingPreferencesTitle")}
                            drawerButtonText={t("listings.selectPreferences")}
                            dataFetcher={useJurisdictionalMultiselectQuestionList}
                            formKey={"preference"}
                            applicationSection={ApplicationSection.preferences}
                          />
                          <SelectAndOrder
                            addText={"Add program"}
                            drawerTitle={"Add programs"}
                            editText={"Edit programs"}
                            listingData={programs}
                            setListingData={setPrograms}
                            subtitle={
                              "Tell us about any additional housing programs related to this listing."
                            }
                            title={"Housing Programs"}
                            drawerButtonText={"Select programs"}
                            dataFetcher={useJurisdictionalMultiselectQuestionList}
                            formKey={"program"}
                            applicationSection={ApplicationSection.programs}
                          />
                          <AdditionalFees existingUtilities={listing?.utilities} />
                          <BuildingFeatures existingFeatures={listing?.features} />
                          <AdditionalEligibility defaultText={listing?.rentalAssistance} />
                          <BuildingSelectionCriteria />
                          <AdditionalDetails />
                          <div className="text-right -mr-8 -mt-8 relative" style={{ top: "7rem" }}>
                            <Button
                              type="button"
                              icon="arrowForward"
                              onClick={() => {
                                setTabIndex(1)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              Application Process
                            </Button>
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <RankingsAndResults listing={listing} />
                          <LeasingAgent />
                          <ApplicationTypes listing={listing} />
                          <ApplicationAddress listing={listing} />
                          <ApplicationDates
                            listing={listing}
                            openHouseEvents={openHouseEvents}
                            setOpenHouseEvents={setOpenHouseEvents}
                          />

                          <div className="-ml-8 -mt-8 relative" style={{ top: "7rem" }}>
                            <Button
                              type="button"
                              icon="arrowBack"
                              iconPlacement="left"
                              onClick={() => {
                                setTabIndex(0)
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }}
                            >
                              Listing Details
                            </Button>
                          </div>
                        </TabPanel>
                      </Tabs>

                      {listing?.status === ListingStatus.closed && (
                        <LotteryResults
                          submitCallback={(data) => {
                            triggerSubmitWithStatus(false, ListingStatus.closed, data)
                          }}
                          drawerState={lotteryResultsDrawer}
                          showDrawer={(toggle: boolean) => setLotteryResultsDrawer(toggle)}
                        />
                      )}
                    </div>

                    <aside className="md:w-3/12 md:pl-6">
                      <Aside
                        type={editMode ? "edit" : "add"}
                        showCloseListingModal={() => setCloseModal(true)}
                        showLotteryResultsDrawer={() => setLotteryResultsDrawer(true)}
                        submitFormWithStatus={triggerSubmitWithStatus}
                      />
                    </aside>
                  </div>
                </Form>
              </div>
            </section>
          </FormProvider>
        </>
      </LoadingOverlay>

      <Modal
        open={!!closeModal}
        title={t("t.areYouSure")}
        ariaDescription={t("listings.closeThisListing")}
        onClose={() => setCloseModal(false)}
        actions={[
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            onClick={() => {
              setCloseModal(false)
              triggerSubmitWithStatus(false, ListingStatus.closed)
            }}
            size={AppearanceSizeType.small}
          >
            {t("listings.actions.close")}
          </Button>,
          <Button
            type="button"
            onClick={() => {
              setCloseModal(false)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.closeThisListing")}
      </Modal>

      <Modal
        open={!!publishModal}
        title={t("t.areYouSure")}
        ariaDescription={t("listings.publishThisListing")}
        onClose={() => setPublishModal(false)}
        actions={[
          <Button
            id="publishButtonConfirm"
            type="button"
            styleType={AppearanceStyleType.success}
            onClick={() => {
              setPublishModal(false)
              triggerSubmitWithStatus(false, ListingStatus.active)
            }}
            size={AppearanceSizeType.small}
          >
            {t("listings.actions.publish")}
          </Button>,
          <Button
            type="button"
            onClick={() => {
              setPublishModal(false)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.publishThisListing")}
      </Modal>

      <Modal
        open={listingIsAlreadyLiveModal}
        title={t("t.areYouSure")}
        ariaDescription={t("listings.listingIsAlreadyLive")}
        onClose={() => setListingIsAlreadyLiveModal(false)}
        actions={[
          <Button
            id="saveAlreadyLiveListingButtonConfirm"
            type="button"
            styleType={AppearanceStyleType.success}
            onClick={() => {
              setListingIsAlreadyLiveModal(false)
              triggerSubmitWithStatus(false, ListingStatus.active)
            }}
            size={AppearanceSizeType.small}
            dataTestId={"listingIsAlreadyLiveButton"}
          >
            {t("t.save")}
          </Button>,
          <Button
            type="button"
            onClick={() => {
              setListingIsAlreadyLiveModal(false)
            }}
            size={AppearanceSizeType.small}
          >
            {t("t.cancel")}
          </Button>,
        ]}
      >
        {t("listings.listingIsAlreadyLive")}
      </Modal>
    </>
  )
}

export default ListingForm
