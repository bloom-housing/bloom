import React, { useState, useCallback, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import { t, Form, AlertBox, LoadingOverlay, LatitudeLongitude } from "@bloom-housing/ui-components"
import { Button, Dialog, Icon, Tabs } from "@bloom-housing/ui-seeds"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon"
import { AuthContext, MessageContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  ListingCreate,
  ListingEventsTypeEnum,
  ListingUpdate,
  ListingsStatusEnum,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useForm, FormProvider } from "react-hook-form"
import {
  AlertErrorType,
  FormListing,
  TempEvent,
  TempUnit,
  formDefaults,
} from "../../../lib/listings/formTypes"
import ListingDataPipeline from "../../../lib/listings/ListingDataPipeline"
import ListingFormActions, { ListingFormActionsType } from "../ListingFormActions"
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
import { getListingStatusTag } from "../helpers"
import RequestChangesModal from "./RequestChangesModal"

type ListingFormProps = {
  listing?: FormListing
  editMode?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode }: ListingFormProps) => {
  const defaultValues = editMode ? listing : formDefaults
  const isListingActive = listing?.status === ListingsStatusEnum.active
  const formMethods = useForm<FormListing>({
    defaultValues,
    shouldUnregister: false,
  })

  const router = useRouter()

  const { listingsService, profile } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const [tabIndex, setTabIndex] = useState(0)
  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [units, setUnits] = useState<TempUnit[]>([])
  const [openHouseEvents, setOpenHouseEvents] = useState<TempEvent[]>([])
  const [preferences, setPreferences] = useState<MultiselectQuestion[]>(
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.preferences)?.map(
      (listingPref) => {
        return { ...listingPref?.multiselectQuestions }
      }
    ) ?? []
  )
  const [programs, setPrograms] = useState<MultiselectQuestion[]>(
    listingSectionQuestions(listing, MultiselectQuestionsApplicationSectionEnum.programs)?.map(
      (listingProg) => {
        return { ...listingProg?.multiselectQuestions }
      }
    )
  )

  const [latLong, setLatLong] = useState<LatitudeLongitude>({
    latitude: listing?.listingsBuildingAddress?.latitude ?? null,
    longitude: listing?.listingsBuildingAddress?.longitude ?? null,
  })
  const [customMapPositionChosen, setCustomMapPositionChosen] = useState(
    listing?.customMapPin || false
  )

  const setLatitudeLongitude = (latlong: LatitudeLongitude) => {
    if (!loading) {
      setLatLong(latlong)
    }
  }

  const [closeModal, setCloseModal] = useState(false)
  const [publishModal, setPublishModal] = useState(false)
  const [lotteryResultsDrawer, setLotteryResultsDrawer] = useState(false)
  const [listingIsAlreadyLiveModal, setListingIsAlreadyLiveModal] = useState(false)
  const [submitForApprovalModal, setSubmitForApprovalModal] = useState(false)
  const [requestChangesModal, setRequestChangesModal] = useState(false)

  useEffect(() => {
    if (listing?.units) {
      const tempUnits = listing.units.map((unit, i) => ({
        ...unit,
        tempId: i + 1,
      }))
      setUnits(tempUnits)
    }

    if (listing?.listingEvents) {
      setOpenHouseEvents(
        listing.listingEvents
          .filter((event) => event.type === ListingEventsTypeEnum.openHouse)
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
  }, [listing?.units, listing?.listingEvents, setUnits, setOpenHouseEvents])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getValues, setError, clearErrors, reset } = formMethods

  const triggerSubmitWithStatus = (
    confirm?: boolean,
    status?: ListingsStatusEnum,
    newData?: Partial<FormListing>
  ) => {
    if (confirm && status === ListingsStatusEnum.active) {
      if (isListingActive) {
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
            profile: profile,
            latLong,
            customMapPositionChosen,
          })
          const formattedData = await dataPipeline.run()
          let result
          if (editMode) {
            result = await listingsService.update({
              id: listing.id,
              body: { id: listing.id, ...(formattedData as unknown as ListingUpdate) },
            })
          } else {
            result = await listingsService.create({
              body: formattedData as unknown as ListingCreate,
            })
          }

          reset(formData)

          if (result) {
            const getToast = (oldStatus: ListingsStatusEnum, newStatus: ListingsStatusEnum) => {
              const toasts = {
                [ListingsStatusEnum.pendingReview]: t("listings.approval.submittedForReview"),
                [ListingsStatusEnum.changesRequested]: t("listings.listingStatus.changesRequested"),
                [ListingsStatusEnum.active]: t("listings.approval.listingPublished"),
                [ListingsStatusEnum.pending]: t("listings.approval.listingUnpublished"),
                [ListingsStatusEnum.closed]: t("listings.approval.listingClosed"),
              }
              if (oldStatus !== newStatus) {
                if (!listing && newStatus === ListingsStatusEnum.pending)
                  return t("listings.listingUpdated")
                return toasts[newStatus]
              }

              return t("listings.listingUpdated")
            }
            addToast(getToast(listing?.status, formattedData?.status), { variant: "success" })

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
                  const address = formData.listingsBuildingAddress
                  setIfEmpty(`buildingAddress.city`, address.city, readableError)
                  setIfEmpty(`buildingAddress.county`, address.county, readableError)
                  setIfEmpty(`buildingAddress.state`, address.state, readableError)
                  setIfEmpty(`buildingAddress.street`, address.street, readableError)
                  setIfEmpty(`buildingAddress.zipCode`, address.zipCode, readableError)
                }
              }
            })
            setAlert("form")
          } else if (data?.message === "email failed") {
            addToast(t("errors.alert.listingsApprovalEmailError"), { variant: "warn" })
            await router.push(`/listings/${formData.id}/`)
          } else setAlert("api")
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
      addToast,
    ]
  )

  return loading === true ? null : (
    <>
      <LoadingOverlay isLoading={loading}>
        <>
          <StatusBar>{getListingStatusTag(listing?.status)}</StatusBar>

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
                    <div className="md:w-9/12 pb-28">
                      <Tabs
                        forceRenderTabPanel={true}
                        selectedIndex={tabIndex}
                        onSelect={(index) => setTabIndex(index)}
                      >
                        <Tabs.TabList>
                          <Tabs.Tab>Listing Details</Tabs.Tab>
                          <Tabs.Tab>Application Process</Tabs.Tab>
                        </Tabs.TabList>
                        <Tabs.TabPanel>
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
                            disableListingAvailability={
                              isListingActive && !profile.userRoles.isAdmin
                            }
                          />
                          <SelectAndOrder
                            addText={t("listings.addPreference")}
                            drawerTitle={t("listings.addPreferences")}
                            drawerSubtitle={
                              process.env.showLottery && listing?.lotteryOptIn
                                ? t("listings.lotteryPreferenceSubtitle")
                                : null
                            }
                            editText={t("listings.editPreferences")}
                            listingData={preferences || []}
                            setListingData={setPreferences}
                            subtitle={t("listings.sections.housingPreferencesSubtext")}
                            title={t("listings.sections.housingPreferencesTitle")}
                            drawerButtonText={t("listings.selectPreferences")}
                            dataFetcher={useJurisdictionalMultiselectQuestionList}
                            formKey={"preference"}
                            applicationSection={
                              MultiselectQuestionsApplicationSectionEnum.preferences
                            }
                          />
                          <SelectAndOrder
                            addText={"Add program"}
                            drawerTitle={"Add programs"}
                            editText={"Edit programs"}
                            listingData={programs || []}
                            setListingData={setPrograms}
                            subtitle={
                              "Tell us about any additional housing programs related to this listing."
                            }
                            title={"Housing Programs"}
                            drawerButtonText={"Select programs"}
                            dataFetcher={useJurisdictionalMultiselectQuestionList}
                            formKey={"program"}
                            applicationSection={MultiselectQuestionsApplicationSectionEnum.programs}
                          />
                          <AdditionalFees existingUtilities={listing?.listingUtilities} />
                          <BuildingFeatures existingFeatures={listing?.listingFeatures} />
                          <AdditionalEligibility defaultText={listing?.rentalAssistance} />
                          <BuildingSelectionCriteria />
                          <AdditionalDetails />
                          <div className="text-right -mr-8 -mt-8 relative" style={{ top: "7rem" }}>
                            <Button
                              id="applicationProcessButton"
                              type="button"
                              variant="primary-outlined"
                              tailIcon={
                                <Icon>
                                  <ChevronRightIcon />
                                </Icon>
                              }
                              onClick={() => {
                                setTabIndex(1)
                                setTimeout(() => window.scroll({ top: 0, behavior: "smooth" }))
                              }}
                            >
                              Application Process
                            </Button>
                          </div>
                        </Tabs.TabPanel>
                        <Tabs.TabPanel>
                          <RankingsAndResults
                            listing={listing}
                            disableDueDates={isListingActive && !profile.userRoles.isAdmin}
                            isAdmin={profile?.userRoles.isAdmin}
                          />
                          <LeasingAgent />
                          <ApplicationTypes listing={listing} />
                          <ApplicationAddress listing={listing} />
                          <ApplicationDates
                            listing={listing}
                            openHouseEvents={openHouseEvents}
                            setOpenHouseEvents={setOpenHouseEvents}
                            disableDueDate={isListingActive && !profile.userRoles.isAdmin}
                          />

                          <div className="-ml-8 -mt-8 relative" style={{ top: "7rem" }}>
                            <Button
                              type="button"
                              variant="primary-outlined"
                              leadIcon={
                                <Icon>
                                  <ChevronLeftIcon />
                                </Icon>
                              }
                              onClick={() => {
                                setTabIndex(0)
                                setTimeout(() => window.scroll({ top: 0, behavior: "smooth" }))
                              }}
                            >
                              Listing Details
                            </Button>
                          </div>
                        </Tabs.TabPanel>
                      </Tabs>

                      {listing?.status === ListingsStatusEnum.closed &&
                        (!listing?.lotteryOptIn || !process.env.showLottery) && (
                          <LotteryResults
                            submitCallback={(data) => {
                              triggerSubmitWithStatus(false, ListingsStatusEnum.closed, data)
                            }}
                            drawerState={lotteryResultsDrawer}
                            showDrawer={(toggle: boolean) => setLotteryResultsDrawer(toggle)}
                          />
                        )}
                    </div>

                    <aside className="w-full md:w-3/12 md:pl-6">
                      <ListingFormActions
                        type={editMode ? ListingFormActionsType.edit : ListingFormActionsType.add}
                        showCloseListingModal={() => setCloseModal(true)}
                        showLotteryResultsDrawer={() => setLotteryResultsDrawer(true)}
                        showRequestChangesModal={() => setRequestChangesModal(true)}
                        showSubmitForApprovalModal={() => setSubmitForApprovalModal(true)}
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

      <Dialog
        isOpen={!!closeModal}
        onClose={() => setCloseModal(false)}
        ariaLabelledBy="listing-form-close-listing-dialog-header"
        ariaDescribedBy="listing-form-close-listing-dialog-content"
      >
        <Dialog.Header id="listing-form-close-listing-dialog-header">
          {t("t.areYouSure")}
        </Dialog.Header>
        <Dialog.Content id="listing-form-close-listing-dialog-content">
          {t("listings.closeThisListing")}
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setCloseModal(false)
              triggerSubmitWithStatus(false, ListingsStatusEnum.closed)
            }}
            size="sm"
          >
            {t("listings.actions.close")}
          </Button>
          <Button
            type="button"
            variant="primary-outlined"
            onClick={() => {
              setCloseModal(false)
            }}
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog
        isOpen={!!publishModal}
        onClose={() => setPublishModal(false)}
        ariaLabelledBy="listing-form-publish-listing-dialog-header"
        ariaDescribedBy="listing-form-publish-listing-dialog-content"
      >
        <Dialog.Header id="listing-form-publish-listing-dialog-header">
          {t("t.areYouSure")}
        </Dialog.Header>
        <Dialog.Content id="listing-form-publish-listing-dialog-content">
          {t("listings.publishThisListing")}
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            id="publishButtonConfirm"
            type="button"
            variant="success"
            onClick={() => {
              setPublishModal(false)
              triggerSubmitWithStatus(false, ListingsStatusEnum.active)
            }}
            size="sm"
          >
            {t("listings.actions.publish")}
          </Button>
          <Button
            type="button"
            variant="primary-outlined"
            onClick={() => {
              setPublishModal(false)
            }}
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog
        isOpen={listingIsAlreadyLiveModal}
        onClose={() => setListingIsAlreadyLiveModal(false)}
        ariaLabelledBy="listing-form-live-confirmation-dialog-header"
        ariaDescribedBy="listing-form-live-confirmation-dialog-content"
      >
        <Dialog.Header id="listing-form-live-confirmation-dialog-header">
          {t("t.areYouSure")}
        </Dialog.Header>
        <Dialog.Content id="listing-form-live-confirmation-dialog-content">
          {t("listings.listingIsAlreadyLive")}
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            id="saveAlreadyLiveListingButtonConfirm"
            type="button"
            variant="success"
            onClick={() => {
              setListingIsAlreadyLiveModal(false)
              triggerSubmitWithStatus(false, ListingsStatusEnum.active)
            }}
            size="sm"
          >
            {t("t.save")}
          </Button>
          <Button
            type="button"
            variant="primary-outlined"
            onClick={() => {
              setListingIsAlreadyLiveModal(false)
            }}
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>

      <Dialog
        isOpen={submitForApprovalModal}
        onClose={() => setSubmitForApprovalModal(false)}
        ariaLabelledBy="listing-form-approval-dialog-header"
        ariaDescribedBy="listing-form-approval-dialog-content"
      >
        <Dialog.Header id="listing-form-approval-dialog-header">{t("t.areYouSure")}</Dialog.Header>
        <Dialog.Content id="listing-form-approval-dialog-content">
          {t("listings.approval.submitForApprovalDescription")}
        </Dialog.Content>
        <Dialog.Footer>
          <Button
            id="submitListingForApprovalButtonConfirm"
            type="button"
            variant="success"
            onClick={() => {
              setSubmitForApprovalModal(false)
              triggerSubmitWithStatus(false, ListingsStatusEnum.pendingReview)
            }}
            size="sm"
          >
            {t("t.submit")}
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSubmitForApprovalModal(false)
            }}
            size="sm"
          >
            {t("t.cancel")}
          </Button>
        </Dialog.Footer>
      </Dialog>

      <RequestChangesModal
        defaultValue={listing?.requestedChanges}
        modalIsOpen={requestChangesModal}
        setModalIsOpen={setRequestChangesModal}
        submitFormWithStatus={triggerSubmitWithStatus}
      />
    </>
  )
}

export default ListingForm
