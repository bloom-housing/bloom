import React, { useState, useCallback, useContext, useEffect } from "react"
import { useRouter } from "next/router"
import dayjs from "dayjs"
import { CharacterCount as CharacterCountExtension } from "@tiptap/extension-character-count"
import { useEditor } from "@tiptap/react"
import { t, Form, AlertBox, LoadingOverlay, LatitudeLongitude } from "@bloom-housing/ui-components"
import { Button, Icon, Tabs } from "@bloom-housing/ui-seeds"
import ChevronLeftIcon from "@heroicons/react/20/solid/ChevronLeftIcon"
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon"
import { AuthContext, MessageContext, listingSectionQuestions } from "@bloom-housing/shared-helpers"
import {
  FeatureFlag,
  FeatureFlagEnum,
  Jurisdiction,
  Listing,
  ListingCreate,
  ListingEventsTypeEnum,
  ListingUpdate,
  ListingsStatusEnum,
  MarketingTypeEnum,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
  YesNoEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { useForm, FormProvider } from "react-hook-form"
import {
  AlertErrorType,
  FormListing,
  TempEvent,
  TempUnit,
  TempUnitGroup,
  formDefaults,
} from "../../../lib/listings/formTypes"
import ListingDataPipeline from "../../../lib/listings/ListingDataPipeline"
import { EditorExtensions } from "../../shared/TextEditor"
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
import CommunityType from "./sections/CommunityType"
import BuildingSelectionCriteria from "./sections/BuildingSelectionCriteria"
import { cleanRichText, getReadableErrorMessage } from "../PaperListingDetails/sections/helpers"
import { StatusBar } from "../../../components/shared/StatusBar"
import { getListingStatusTag } from "../helpers"
import RequestChangesDialog from "./dialogs/RequestChangesDialog"
import CloseListingDialog from "./dialogs/CloseListingDialog"
import PublishListingDialog from "./dialogs/PublishListingDialog"
import LiveConfirmationDialog from "./dialogs/LiveConfirmationDialog"
import ListingApprovalDialog from "./dialogs/ListingApprovalDialog"
import SaveBeforeExitDialog from "./dialogs/SaveBeforeExitDialog"
import ListingVerification from "./sections/ListingVerification"
import NeighborhoodAmenities from "./sections/NeighborhoodAmenities"
import PreferencesAndPrograms from "./sections/PreferencesAndPrograms"
import * as styles from "./ListingForm.module.scss"

const CHARACTER_LIMIT = 1000

type ListingFormProps = {
  listing?: FormListing
  editMode?: boolean
  setListingName?: React.Dispatch<React.SetStateAction<string>>
  updateListing?: (updatedListing: Listing) => void
}

export type SubmitFunction = (
  action: "redirect" | "continue" | "confirm",
  status?: ListingsStatusEnum,
  newData?: Partial<FormListing>
) => void

const getToast = (
  listing: FormListing,
  oldStatus: ListingsStatusEnum,
  newStatus: ListingsStatusEnum
) => {
  const toasts = {
    [ListingsStatusEnum.pendingReview]: t("listings.approval.submittedForReview"),
    [ListingsStatusEnum.changesRequested]: t("listings.listingStatus.changesRequested"),
    [ListingsStatusEnum.active]: t("listings.approval.listingPublished"),
    [ListingsStatusEnum.pending]: t("listings.approval.listingUnpublished"),
    [ListingsStatusEnum.closed]: t("listings.approval.listingClosed"),
    saved: t("listings.progressSaved"),
  }
  if (oldStatus !== newStatus) {
    if (!listing && newStatus === ListingsStatusEnum.pending) return toasts.saved
    return toasts[newStatus]
  }

  return toasts.saved
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode, setListingName, updateListing }: ListingFormProps) => {
  const defaultValues = editMode ? listing : formDefaults
  const formMethods = useForm<FormListing>({
    defaultValues,
    shouldUnregister: false,
  })

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getValues, setError, clearErrors, reset, watch } = formMethods
  const selectedJurisdiction: string = watch("jurisdictions.id")
  const marketingTypeChoice = watch("marketingType")

  const router = useRouter()

  const { listingsService, profile, jurisdictionsService } = useContext(AuthContext)
  const { addToast } = useContext(MessageContext)

  const [tabIndex, setTabIndex] = useState(0)
  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [units, setUnits] = useState<TempUnit[]>([])
  const [unitGroups, setUnitGroups] = useState<TempUnitGroup[]>([])
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
  const [activeFeatureFlags, setActiveFeatureFlags] = useState<FeatureFlag[]>(null)
  const [requiredFields, setRequiredFields] = useState<string[]>([])

  const setLatitudeLongitude = (latlong: LatitudeLongitude) => {
    if (!loading) {
      setLatLong(latlong)
    }
  }

  const [closeSaveDialog, setCloseSaveDialog] = useState(false)
  const [closeListingDialog, setCloseListingDialog] = useState(false)
  const [publishDialog, setPublishDialog] = useState(false)
  const [lotteryResultsDrawer, setLotteryResultsDrawer] = useState(false)
  const [listingIsAlreadyLiveDialog, setListingIsAlreadyLiveDialog] = useState(false)
  const [submitForApprovalDialog, setSubmitForApprovalDialog] = useState(false)
  const [requestChangesDialog, setRequestChangesDialog] = useState(false)
  const [selectedJurisdictionData, setSelectedJurisdictionData] = useState<Jurisdiction>()

  const whatToExpectEditor = useEditor({
    extensions: [...EditorExtensions, CharacterCountExtension.configure()],
    content: listing?.whatToExpect,
    immediatelyRender: false,
  })

  const whatToExpectAdditionalDetailsEditor = useEditor({
    extensions: [...EditorExtensions, CharacterCountExtension.configure()],
    content: listing?.whatToExpectAdditionalText,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (selectedJurisdictionData) {
      if (
        marketingTypeChoice === MarketingTypeEnum.comingSoon &&
        !!selectedJurisdictionData.whatToExpectUnderConstruction
      ) {
        whatToExpectEditor.commands.setContent(
          selectedJurisdictionData.whatToExpectUnderConstruction
        )
        whatToExpectAdditionalDetailsEditor.commands.clearContent()
        return
      }

      if (!editMode) {
        if (!whatToExpectEditor?.storage.characterCount.characters()) {
          whatToExpectEditor.commands.setContent(selectedJurisdictionData.whatToExpect)
        }
        if (!whatToExpectAdditionalDetailsEditor?.storage.characterCount.characters()) {
          whatToExpectAdditionalDetailsEditor.commands.setContent(
            selectedJurisdictionData.whatToExpectAdditionalText
          )
        }
      }
    }
    //eslint-disable-next-line
  }, [selectedJurisdictionData, marketingTypeChoice])

  const enableUnitGroups =
    activeFeatureFlags?.find((flag) => flag.name === FeatureFlagEnum.enableUnitGroups)?.active ||
    false

  const enableSection8 =
    activeFeatureFlags?.find((flag) => flag.name === FeatureFlagEnum.enableSection8Question)
      ?.active || false

  const disableListingPreferences =
    activeFeatureFlags?.find((flag) => flag.name === FeatureFlagEnum.disableListingPreferences)
      ?.active || false

  useEffect(() => {
    if (listing?.units) {
      const tempUnits = listing.units.map((unit, i) => ({
        ...unit,
        tempId: i + 1,
      }))
      setUnits(tempUnits)
    }

    if (listing?.unitGroups) {
      const tempUnitGroups = listing.unitGroups.map((unitGroup, i) => ({
        ...unitGroup,
        unitGroupAmiLevels: unitGroup.unitGroupAmiLevels.map((amiEntry, i) => ({
          ...amiEntry,
          tempId: i + 1,
        })),
        tempId: i + 1,
      }))
      setUnitGroups(tempUnitGroups)
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
  }, [
    listing?.units,
    listing?.unitGroups,
    listing?.listingEvents,
    setUnits,
    setUnitGroups,
    setOpenHouseEvents,
  ])

  useEffect(() => {
    // Retrieve the jurisdiction data from the backend whenever the jurisdiction changes
    async function fetchData() {
      if (selectedJurisdiction) {
        const jurisdictionData = await jurisdictionsService.retrieve({
          jurisdictionId: selectedJurisdiction,
        })

        if (jurisdictionData) {
          setSelectedJurisdictionData(jurisdictionData)
        }
      }
    }
    void fetchData()

    // Set the active feature flags depending on if/what jurisdiction is selected
    const newFeatureFlags = profile?.jurisdictions?.reduce((featureFlags, juris) => {
      if (!selectedJurisdiction || selectedJurisdiction === juris.id) {
        // filter only the active feature flags
        const jurisFeatureFlags = juris.featureFlags?.filter((value) => value.active)
        const flags = [...featureFlags, ...jurisFeatureFlags]
        return [...new Set(flags)]
      }
      return featureFlags
    }, [])

    setActiveFeatureFlags(newFeatureFlags)
    const selectedJurisdictionObj = profile?.jurisdictions?.find(
      (juris) => selectedJurisdiction === juris.id
    )
    if (profile?.jurisdictions.length === 1)
      setRequiredFields(profile?.jurisdictions[0].requiredListingFields || [])
    else setRequiredFields(selectedJurisdictionObj?.requiredListingFields || [])
  }, [profile?.jurisdictions, selectedJurisdiction, jurisdictionsService])

  const triggerSubmitWithStatus: SubmitFunction = (action, status, newData) => {
    if (action !== "redirect" && status === ListingsStatusEnum.active) {
      if (listing?.status === ListingsStatusEnum.active) {
        setListingIsAlreadyLiveDialog(true)
      } else {
        setPublishDialog(true)
      }
      return
    }
    let formData = { ...defaultValues, ...getValues(), ...(newData || {}) }
    if (status) {
      formData = { ...formData, status }
    }
    void onSubmit(formData, action === "continue")
  }

  const onSubmit = useCallback(
    async (formData: FormListing, continueEditing: boolean) => {
      if (!loading) {
        try {
          setLoading(true)
          clearErrors()
          const successful = await formMethods.trigger()

          if (whatToExpectEditor?.storage.characterCount.characters() > CHARACTER_LIMIT) {
            setLoading(false)
            setAlert("form")
            return
          }

          formData.whatToExpect = cleanRichText(whatToExpectEditor.getHTML())

          if (
            whatToExpectAdditionalDetailsEditor?.storage.characterCount.characters() >
            CHARACTER_LIMIT
          ) {
            setLoading(false)
            setAlert("form")
            return
          }

          formData.whatToExpectAdditionalText = cleanRichText(
            whatToExpectAdditionalDetailsEditor.getHTML()
          )

          if (!enableSection8) {
            formData.listingSection8Acceptance = YesNoEnum.no
          }

          if (successful) {
            const dataPipeline = new ListingDataPipeline(formData, {
              preferences: disableListingPreferences ? [] : preferences,
              programs,
              units: !enableUnitGroups ? units : [], // Clear existing units if unit groups flag has been enabled
              unitGroups: enableUnitGroups ? unitGroups : [], // Clear existing unit groups if the unit groups flag has been disabled
              openHouseEvents,
              profile: profile,
              latLong,
              customMapPositionChosen,
              enableUnitGroups,
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
              addToast(getToast(listing, listing?.status, formattedData?.status), {
                variant: "success",
              })

              if (continueEditing) {
                setAlert(null)
                setListingName(result.name)
                if (updateListing) {
                  updateListing(result as Listing)
                }
              } else {
                await router.push(`/listings/${result.id}`)
              }
            }
            setLoading(false)
          } else {
            setLoading(false)
            setAlert("form")
          }
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [
      units,
      unitGroups,
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
      enableUnitGroups,
    ]
  )

  return loading === true ? null : (
    <>
      <LoadingOverlay isLoading={loading}>
        <>
          <StatusBar>{getListingStatusTag(listing?.status)}</StatusBar>

          <FormProvider {...formMethods}>
            <section className={`bg-primary-lighter py-5 ${styles["form-overrides"]}`}>
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
                          <Tabs.Tab>{t("listings.details")}</Tabs.Tab>
                          <Tabs.Tab>{t("listings.applicationProcess")}</Tabs.Tab>
                        </Tabs.TabList>
                        <Tabs.TabPanel>
                          <p className="field-label seeds-m-be-content">
                            {t("listings.requiredToPublishAsterisk")}
                          </p>
                          <ListingIntro
                            jurisdictions={profile?.jurisdictions || []}
                            requiredFields={requiredFields}
                          />
                          <ListingPhotos requiredFields={requiredFields} />
                          <BuildingDetails
                            customMapPositionChosen={customMapPositionChosen}
                            latLong={latLong}
                            listing={listing}
                            requiredFields={requiredFields}
                            setCustomMapPositionChosen={setCustomMapPositionChosen}
                            setLatLong={setLatitudeLongitude}
                          />
                          <CommunityType listing={listing} requiredFields={requiredFields} />
                          <Units
                            disableUnitsAccordion={listing?.disableUnitsAccordion}
                            featureFlags={activeFeatureFlags}
                            requiredFields={requiredFields}
                            setUnitGroups={setUnitGroups}
                            setUnits={setUnits}
                            unitGroups={unitGroups}
                            units={units}
                          />
                          <PreferencesAndPrograms
                            listing={listing}
                            preferences={preferences || []}
                            setPreferences={setPreferences}
                            programs={programs || []}
                            setPrograms={setPrograms}
                          />
                          <AdditionalFees
                            existingUtilities={listing?.listingUtilities}
                            requiredFields={requiredFields}
                          />
                          <BuildingFeatures
                            existingFeatures={listing?.listingFeatures}
                            requiredFields={requiredFields}
                          />
                          <NeighborhoodAmenities />
                          <AdditionalEligibility
                            defaultText={listing?.rentalAssistance}
                            requiredFields={requiredFields}
                          />
                          <BuildingSelectionCriteria />
                          <AdditionalDetails requiredFields={requiredFields} />
                          <ListingVerification />
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
                              {t("listings.applicationProcess")}
                            </Button>
                          </div>
                        </Tabs.TabPanel>
                        <Tabs.TabPanel>
                          <p className="field-label seeds-m-be-content">
                            {t("listings.requiredToPublishAsterisk")}
                          </p>
                          <RankingsAndResults
                            listing={listing}
                            isAdmin={profile?.userRoles.isAdmin}
                            whatToExpectEditor={whatToExpectEditor}
                            whatToExpectAdditionalTextEditor={whatToExpectAdditionalDetailsEditor}
                            requiredFields={requiredFields}
                          />
                          <LeasingAgent requiredFields={requiredFields} />
                          <ApplicationTypes listing={listing} requiredFields={requiredFields} />
                          <ApplicationAddress listing={listing} requiredFields={requiredFields} />
                          <ApplicationDates
                            listing={listing}
                            openHouseEvents={openHouseEvents}
                            setOpenHouseEvents={setOpenHouseEvents}
                            requiredFields={requiredFields}
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
                              {t("listings.details")}
                            </Button>
                          </div>
                        </Tabs.TabPanel>
                      </Tabs>

                      {listing?.status === ListingsStatusEnum.closed &&
                        (!listing?.lotteryOptIn || !process.env.showLottery) && (
                          <LotteryResults
                            submitCallback={(data) => {
                              triggerSubmitWithStatus("redirect", ListingsStatusEnum.closed, data)
                            }}
                            drawerState={lotteryResultsDrawer}
                            showDrawer={(toggle: boolean) => setLotteryResultsDrawer(toggle)}
                          />
                        )}
                    </div>

                    <aside className="w-full md:w-3/12 md:pl-6">
                      <ListingFormActions
                        type={editMode ? ListingFormActionsType.edit : ListingFormActionsType.add}
                        showSaveBeforeExitDialog={() => setCloseSaveDialog(true)}
                        showCloseListingModal={() => setCloseListingDialog(true)}
                        showLotteryResultsDrawer={() => setLotteryResultsDrawer(true)}
                        showRequestChangesModal={() => setRequestChangesDialog(true)}
                        showSubmitForApprovalModal={() => setSubmitForApprovalDialog(true)}
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

      <SaveBeforeExitDialog
        isOpen={closeSaveDialog}
        setOpen={setCloseSaveDialog}
        currentListingStatus={listing?.status}
        submitFormWithStatus={triggerSubmitWithStatus}
        listingDetailURL={`/${listing ? `listings/${listing?.id}` : ""}`}
      />

      <CloseListingDialog
        isOpen={closeListingDialog}
        setOpen={setCloseListingDialog}
        submitFormWithStatus={triggerSubmitWithStatus}
      />

      <PublishListingDialog
        isOpen={publishDialog}
        setOpen={setPublishDialog}
        submitFormWithStatus={triggerSubmitWithStatus}
      />

      <LiveConfirmationDialog
        isOpen={listingIsAlreadyLiveDialog}
        setOpen={setListingIsAlreadyLiveDialog}
        submitFormWithStatus={triggerSubmitWithStatus}
      />

      <ListingApprovalDialog
        isOpen={submitForApprovalDialog}
        setOpen={setSubmitForApprovalDialog}
        submitFormWithStatus={triggerSubmitWithStatus}
      />

      <RequestChangesDialog
        defaultValue={listing?.requestedChanges}
        modalIsOpen={requestChangesDialog}
        setModalIsOpen={setRequestChangesDialog}
        submitFormWithStatus={triggerSubmitWithStatus}
      />
    </>
  )
}

export default ListingForm
