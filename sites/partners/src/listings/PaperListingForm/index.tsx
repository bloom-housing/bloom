import React, { useState, useCallback, useContext, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import {
  AuthContext,
  t,
  Form,
  AlertBox,
  setSiteAlertMessage,
  LoadingOverlay,
  StatusBar,
  AppearanceStyleType,
  Button,
  Modal,
  AppearanceBorderType,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  LatitudeLongitude,
} from "@bloom-housing/ui-components"
import { useForm, FormProvider } from "react-hook-form"
import { ListingStatus, ListingEventType, Program } from "@bloom-housing/backend-core/types"
import {
  AlertErrorType,
  FormListing,
  TempEvent,
  TempUnit,
  formDefaults,
  TempUnitsSummary,
} from "./formTypes"
import ListingDataPipeline from "./ListingDataPipeline"

import Aside from "../Aside"
import AdditionalDetails from "./sections/AdditionalDetails"
import AdditionalEligibility from "./sections/AdditionalEligibility"
import LeasingAgent from "./sections/LeasingAgent"
import AdditionalFees from "./sections/AdditionalFees"
import Units from "./sections/Units"
import BuildingDetails from "./sections/BuildingDetails"
import ListingIntro from "./sections/ListingIntro"
import ListingPhoto from "./sections/ListingPhoto"
import BuildingFeatures from "./sections/BuildingFeatures"
import RankingsAndResults from "./sections/RankingsAndResults"
import ApplicationAddress from "./sections/ApplicationAddress"
import ApplicationDates from "./sections/ApplicationDates"
import LotteryResults from "./sections/LotteryResults"
import ApplicationTypes from "./sections/ApplicationTypes"
import SelectAndOrder from "./sections/SelectAndOrder"
import Verification from "./sections/Verification"
import BuildingSelectionCriteria from "./sections/BuildingSelectionCriteria"
import { getReadableErrorMessage } from "../PaperListingDetails/sections/helpers"
import { useJurisdictionalProgramList } from "../../../lib/hooks"

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
  const [jumpToVerify, setJumpToVerify] = useState<boolean>(false)
  const [units, setUnits] = useState<TempUnit[]>([])
  const [unitsSummaries, setUnitsSummaries] = useState<TempUnitsSummary[]>([])
  const [openHouseEvents, setOpenHouseEvents] = useState<TempEvent[]>([])
  const [verifyAlert, setVerifyAlert] = useState<boolean>(false)

  const [programs, setPrograms] = useState<Program[]>(
    listing?.listingPrograms.map((program) => {
      return program.program
    }) ?? []
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

    if (listing?.isVerified === false) {
      setVerifyAlert(true)
    }
  }, [listing?.events, listing?.isVerified])

  useEffect(() => {
    if (listing?.unitGroups && !unitsSummaries.length) {
      const tempSummaries = listing.unitGroups.map((summary, i) => ({
        ...summary,
        tempId: i + 1,
        amiLevels: summary?.amiLevels?.map((elem, index) => ({ ...elem, tempId: index + 1 })),
        openWaitListQuestion: summary?.openWaitlist?.toString(),
      }))
      setUnitsSummaries(tempSummaries)
    }
  }, [])

  const scrollToVerify = () => {
    document.getElementById("isVerifiedContainer").scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (jumpToVerify && tabIndex === 0) {
      scrollToVerify()
      setJumpToVerify(false)
    }
  }, [tabIndex, jumpToVerify])

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
            programs,
            units,
            unitGroups: unitsSummaries,
            openHouseEvents,
            profile,
            latLong,
            customMapPositionChosen,
          })
          const formattedData = await dataPipeline.run()

          const result = editMode
            ? await listingsService.update(
                {
                  id: listing.id,
                  body: { id: listing.id, ...formattedData },
                },
                { headers: { "x-purge-cache": true } }
              )
            : await listingsService.create(
                { body: formattedData },
                { headers: { "x-purge-cache": true } }
              )
          reset(formData)

          if (result) {
            /**
             * Send purge request to Nginx.
             * Wrapped in try catch, because it's possible that content may not be cached in between edits,
             * and will return a 404, which is expected.
             * listings* purges all /listings locations (with args, details), so if we decide to clear on certain locations,
             * like all lists and only the edited listing, then we can do that here (with a corresponding update to nginx config)
             */
            if (process.env.backendProxyBase) {
              try {
                // clear individual listing's cache
                await axios.request({
                  url: `${process.env.backendProxyBase}/listings/${result.id}*`,
                  method: "purge",
                })
                // clear list caches if published
                if (result.status !== ListingStatus.pending) {
                  await axios.request({
                    url: `${process.env.backendProxyBase}/listings?*`,
                    method: "purge",
                  })
                }
              } catch (e) {
                console.log("purge error = ", e)
              }
            }

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
      loading,
      clearErrors,
      programs,
      units,
      unitsSummaries,
      openHouseEvents,
      profile,
      latLong,
      customMapPositionChosen,
      editMode,
      listingsService,
      listing?.id,
      reset,
      router,
      setError,
    ]
  )

  return loading === true ? null : (
    <>
      <LoadingOverlay isLoading={loading}>
        <>
          <StatusBar
            backButton={
              <Button
                inlineIcon="left"
                icon="arrowBack"
                onClick={() => (editMode ? router.push(`/listings/${listing?.id}`) : router.back())}
              >
                {t("t.back")}
              </Button>
            }
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
                {verifyAlert && (
                  <AlertBox
                    className="mb-5 bg-blue-300"
                    onClose={() => setVerifyAlert(false)}
                    closeable
                    type="alert"
                  >
                    <span className="text-sm font-normal">
                      Let us know that the listing data is accurate and up to date.{" "}
                      <a
                        className="decoration-blue-700 underline"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (tabIndex === 1) {
                            setJumpToVerify(true)
                            setTabIndex(0)
                          } else {
                            scrollToVerify()
                          }
                        }}
                      >
                        Verify your listing data.
                      </a>
                    </span>
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
                          <ListingPhoto />
                          <BuildingDetails
                            listing={listing}
                            setLatLong={setLatitudeLongitude}
                            latLong={latLong}
                            customMapPositionChosen={customMapPositionChosen}
                            setCustomMapPositionChosen={setCustomMapPositionChosen}
                          />
                          <Units
                            units={units}
                            setUnits={setUnits}
                            unitsSummaries={unitsSummaries}
                            setSummaries={setUnitsSummaries}
                            disableUnitsAccordion={listing?.disableUnitsAccordion}
                          />
                          <SelectAndOrder
                            addText={"Add programs"}
                            drawerTitle={"Add programs"}
                            editText={"Edit programs"}
                            listingData={programs}
                            setListingData={setPrograms}
                            subtitle={
                              "Tell us about any additional community programs related to this listing."
                            }
                            title={"Community Programs"}
                            drawerButtonText={"Select programs"}
                            dataFetcher={useJurisdictionalProgramList}
                            formKey={"program"}
                            subNote={
                              "Please choose the populations your building serves, based on your building's financing and regulatory agreements."
                            }
                          />
                          <AdditionalFees />
                          <BuildingFeatures existingFeatures={listing?.features} />
                          <AdditionalEligibility />
                          <BuildingSelectionCriteria />
                          <AdditionalDetails />
                          <Verification setAlert={setVerifyAlert} />

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
                          <ApplicationDates listing={listing} />
                          <LeasingAgent />
                          <ApplicationTypes listing={listing} />
                          <ApplicationAddress listing={listing} />

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
          >
            {t("listings.actions.close")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setCloseModal(false)
            }}
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
          >
            {t("listings.actions.publish")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setPublishModal(false)
            }}
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
            dataTestId={"listingIsAlreadyLiveButton"}
          >
            {t("t.save")}
          </Button>,
          <Button
            type="button"
            styleType={AppearanceStyleType.secondary}
            border={AppearanceBorderType.borderless}
            onClick={() => {
              setListingIsAlreadyLiveModal(false)
            }}
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
