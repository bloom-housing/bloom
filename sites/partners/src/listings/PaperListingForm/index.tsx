import React, { useState, useCallback, useContext, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/router"
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
  TimeFieldPeriod,
  Modal,
  AppearanceBorderType,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  LatitudeLongitude,
} from "@bloom-housing/ui-components"
import { useForm, FormProvider } from "react-hook-form"
import {
  ListingStatus,
  ListingApplicationAddressType,
  Unit,
  Listing,
  ListingEvent,
  ListingEventType,
  ListingEventCreate,
  Preference,
  PaperApplication,
  PaperApplicationCreate,
  ListingReviewOrder,
  User,
  ListingPreference,
  Program,
  ListingProgram,
} from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../../applications/PaperApplicationForm/FormTypes"
import moment from "moment"
import { nanoid } from "nanoid"

import Aside from "../Aside"
import AdditionalDetails from "./sections/AdditionalDetails"
import AdditionalEligibility from "./sections/AdditionalEligibility"
import LeasingAgent from "./sections/LeasingAgent"
import AdditionalFees from "./sections/AdditionalFees"
import Units from "./sections/Units"
import {
  stringToBoolean,
  stringToNumber,
  createDate,
  createTime,
  removeEmptyObjects,
} from "../../../lib/helpers"
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
import CommunityType from "./sections/CommunityType"
import BuildingSelectionCriteria from "./sections/BuildingSelectionCriteria"
import { getReadableErrorMessage } from "../PaperListingDetails/sections/helpers"
import { useJurisdictionalPreferenceList, useJurisdictionalProgramList } from "../../../lib/hooks"

export type FormListing = Omit<Listing, "countyCode"> & {
  applicationDueDateField?: {
    month: string
    day: string
    year: string
  }
  applicationDueTimeField?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  postmarkByDateDateField?: {
    month: string
    day: string
    year: string
  }
  postmarkByDateTimeField?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  arePaperAppsMailedToAnotherAddress?: YesNoAnswer
  arePostmarksConsidered?: YesNoAnswer
  canApplicationsBeDroppedOff?: YesNoAnswer
  canPaperApplicationsBePickedUp?: YesNoAnswer
  digitalApplicationChoice?: YesNoAnswer
  commonDigitalApplicationChoice?: YesNoAnswer
  paperApplicationChoice?: YesNoAnswer
  referralOpportunityChoice?: YesNoAnswer
  dueDateQuestionChoice?: YesNoAnswer
  criteriaAttachType?: string
  lotteryDate?: {
    month: string
    day: string
    year: string
  }
  lotteryStartTime?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  lotteryEndTime?: {
    hours: string
    minutes: string
    period: TimeFieldPeriod
  }
  lotteryDateNotes?: string
  postMarkDate?: {
    month: string
    day: string
    year: string
  }
  reviewOrderQuestion?: string
  waitlistOpenQuestion?: YesNoAnswer
  waitlistSizeQuestion?: YesNoAnswer
  whereApplicationsDroppedOff?: ListingApplicationAddressType
  whereApplicationsPickedUp?: ListingApplicationAddressType
}

export const addressTypes = {
  ...ListingApplicationAddressType,
  anotherAddress: "anotherAddress",
}

type ListingFormProps = {
  listing?: FormListing
  editMode?: boolean
}

type AlertErrorType = "api" | "form"

const defaults: FormListing = {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  applicationDueDate: null,
  applicationDueTime: null,
  applicationFee: null,
  applicationMethods: [],
  applicationOpenDate: new Date(moment().subtract(10).format()),
  applicationOrganization: "",
  applicationPickUpAddress: null,
  applicationPickUpAddressOfficeHours: "",
  applicationMailingAddress: null,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  assets: [],
  buildingSelectionCriteria: "",
  buildingSelectionCriteriaFile: null,
  criteriaAttachType: "",
  jurisdiction: undefined,
  costsNotIncluded: "",
  creditHistory: "",
  criminalBackground: "",
  depositMax: "0",
  depositMin: "0",
  depositHelperText: "or one month's rent may be higher for lower credit scores",
  disableUnitsAccordion: false,
  displayWaitlistSize: false,
  events: [],
  image: null,
  leasingAgentAddress: null,
  leasingAgentEmail: null,
  leasingAgentName: null,
  leasingAgentOfficeHours: "",
  leasingAgentPhone: null,
  leasingAgentTitle: "",
  name: null,
  postMarkDate: null,
  postmarkedApplicationsReceivedByDate: null,
  listingPreferences: [],
  listingPrograms: [],
  programRules: "",
  rentalAssistance:
    "The property is subsidized by the Section 8 Project-Based Voucher Program. As a result, Housing Choice Vouchers, Section 8 and other valid rental assistance programs are not accepted by this property.",
  rentalHistory: "",
  requiredDocuments: "",
  status: ListingStatus.pending,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  isWaitlistOpen: null,
  waitlistOpenSpots: null,
  whatToExpect:
    "Applicants will be contacted by the property agent in rank order until vacancies are filled. All of the information that you have provided will be verified and your eligibility confirmed. Your application will be removed from the waitlist if you have made any fraudulent statements. If we cannot verify a housing preference that you have claimed, you will not receive the preference but will not be otherwise penalized. Should your application be chosen, be prepared to fill out a more detailed application and provide required supporting documents.",
  units: [],
  accessibility: "",
  amenities: "",
  buildingAddress: null,
  buildingTotalUnits: 0,
  developer: null,
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: "",
  petPolicy: "",
  smokingPolicy: "",
  unitsAvailable: 0,
  unitAmenities: "",
  servicesOffered: "",
  yearBuilt: null,
  urlSlug: undefined,
  showWaitlist: false,
  reviewOrderType: null,
  unitsSummary: [],
  unitsSummarized: {
    unitTypes: [],
    priorityTypes: [],
    amiPercentages: [],
    byUnitTypeAndRent: [],
    byUnitType: [],
    byAMI: [],
    hmi: {
      columns: [],
      rows: [],
    },
  },
}

export type TempUnit = Unit & {
  tempId?: number
  maxIncomeHouseholdSize1?: string
  maxIncomeHouseholdSize2?: string
  maxIncomeHouseholdSize3?: string
  maxIncomeHouseholdSize4?: string
  maxIncomeHouseholdSize5?: string
  maxIncomeHouseholdSize6?: string
  maxIncomeHouseholdSize7?: string
  maxIncomeHouseholdSize8?: string
}

export type TempEvent = ListingEvent & {
  tempId?: string
}

export type PaperApplicationHybrid = PaperApplication | PaperApplicationCreate

const formatFormData = (
  data: FormListing,
  units: TempUnit[],
  openHouseEvents: TempEvent[],
  preferences: ListingPreference[],
  programs: ListingProgram[],
  saveLatLong: LatitudeLongitude,
  customPinPositionChosen: boolean,
  profile: User
) => {
  const applicationDueDateFormatted = createDate(data.applicationDueDateField)
  const applicationDueTimeFormatted = createTime(
    applicationDueDateFormatted,
    data.applicationDueTimeField
  )

  let postmarkByDateTimeFormatted = null

  if (data.arePostmarksConsidered === YesNoAnswer.Yes && data.postmarkByDateDateField) {
    const postmarkByDateFormatted = createDate(data.postmarkByDateDateField)
    if (data.postmarkByDateTimeField?.hours) {
      postmarkByDateTimeFormatted = createTime(
        postmarkByDateFormatted,
        data.postmarkByDateTimeField
      )
    } else {
      postmarkByDateTimeFormatted = postmarkByDateFormatted
    }
  }

  units.forEach((unit) => {
    switch (unit.unitType?.name) {
      case "fourBdrm":
        unit.numBedrooms = 4
        break
      case "threeBdrm":
        unit.numBedrooms = 3
        break
      case "twoBdrm":
        unit.numBedrooms = 2
        break
      case "oneBdrm":
        unit.numBedrooms = 1
        break
      default:
        unit.numBedrooms = null
    }

    Object.keys(unit).forEach((key) => {
      if (key.indexOf("maxIncomeHouseholdSize") >= 0) {
        if (parseInt(unit[key])) {
          if (!unit.amiChartOverride) {
            unit.amiChartOverride = {
              id: undefined,
              createdAt: undefined,
              updatedAt: undefined,
              items: [],
            }
          }
          unit.amiChartOverride.items.push({
            percentOfAmi: parseInt(unit.amiPercentage),
            householdSize: parseInt(key[key.length - 1]),
            income: parseInt(unit[key]),
          })
        }
      }
    })

    unit.floor = stringToNumber(unit.floor)
    unit.maxOccupancy = stringToNumber(unit.maxOccupancy)
    unit.minOccupancy = stringToNumber(unit.minOccupancy)
    unit.numBathrooms = stringToNumber(unit.numBathrooms)

    if (!unit.sqFeet) {
      delete unit.sqFeet
    }

    delete unit.tempId
  })

  const events: ListingEventCreate[] = data.events?.filter(
    (event) => !(event?.type === ListingEventType.publicLottery)
  )
  if (
    data.lotteryDate &&
    data.lotteryDate.day &&
    data.lotteryDate.month &&
    data.lotteryDate.year &&
    data.reviewOrderQuestion === "reviewOrderLottery"
  ) {
    const startTime = createTime(createDate(data.lotteryDate), data.lotteryStartTime)
    const endTime = createTime(createDate(data.lotteryDate), data.lotteryEndTime)

    events.push({
      type: ListingEventType.publicLottery,
      startTime: startTime,
      endTime: endTime,
      note: data.lotteryDateNotes,
    })
  }

  if (openHouseEvents) {
    openHouseEvents.forEach((event) => {
      events.push({
        type: ListingEventType.openHouse,
        ...event,
      })
    })
  }

  const jurisdiction =
    !data.jurisdiction?.name && profile.jurisdictions.length === 1
      ? profile.jurisdictions[0]
      : data.jurisdiction

  return {
    ...data,
    jurisdiction,
    applicationDueTime: applicationDueTimeFormatted,
    disableUnitsAccordion: stringToBoolean(data.disableUnitsAccordion),
    units: units,
    listingPreferences: preferences,
    listingPrograms: programs,
    buildingAddress: {
      ...data.buildingAddress,
      latitude: saveLatLong.latitude ?? null,
      longitude: saveLatLong.longitude ?? null,
    },
    customMapPin: customPinPositionChosen,
    isWaitlistOpen:
      data.waitlistOpenQuestion === YesNoAnswer.Yes
        ? true
        : data.waitlistOpenQuestion === YesNoAnswer.No
        ? false
        : null,
    applicationDueDate: applicationDueDateFormatted,
    yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : null,
    waitlistCurrentSize:
      data.waitlistCurrentSize && data.waitlistOpenQuestion === YesNoAnswer.Yes
        ? Number(data.waitlistCurrentSize)
        : null,
    waitlistMaxSize:
      data.waitlistMaxSize && data.waitlistOpenQuestion === YesNoAnswer.Yes
        ? Number(data.waitlistMaxSize)
        : null,
    waitlistOpenSpots:
      data.waitlistOpenSpots && data.waitlistOpenQuestion === YesNoAnswer.Yes
        ? Number(data.waitlistOpenSpots)
        : null,
    postmarkedApplicationsReceivedByDate: postmarkByDateTimeFormatted,
    applicationDropOffAddressType:
      data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
      addressTypes[data.whereApplicationsDroppedOff] !== addressTypes.anotherAddress
        ? addressTypes[data.whereApplicationsDroppedOff]
        : null,
    applicationPickUpAddressType:
      data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
      addressTypes[data.whereApplicationsPickedUp] !== addressTypes.anotherAddress
        ? addressTypes[data.whereApplicationsPickedUp]
        : null,
    applicationDropOffAddress:
      data.canApplicationsBeDroppedOff === YesNoAnswer.Yes &&
      data.whereApplicationsDroppedOff === addressTypes.anotherAddress
        ? data.applicationDropOffAddress
        : null,
    applicationPickUpAddress:
      data.canPaperApplicationsBePickedUp === YesNoAnswer.Yes &&
      data.whereApplicationsPickedUp === addressTypes.anotherAddress
        ? data.applicationPickUpAddress
        : null,
    applicationMailingAddress: data.arePaperAppsMailedToAnotherAddress
      ? data.applicationMailingAddress
      : null,
    events,
    reservedCommunityType: data.reservedCommunityType.id ? data.reservedCommunityType : null,
    reviewOrderType:
      data.reviewOrderQuestion === "reviewOrderLottery"
        ? ListingReviewOrder.lottery
        : ListingReviewOrder.firstComeFirstServe,
    digitalApplication:
      data.digitalApplicationChoice === YesNoAnswer.Yes
        ? true
        : data.digitalApplicationChoice === YesNoAnswer.No
        ? false
        : null,
    commonDigitalApplication: data.commonDigitalApplicationChoice === YesNoAnswer.Yes,
    paperApplication:
      data.paperApplicationChoice === YesNoAnswer.Yes
        ? true
        : data.paperApplicationChoice === YesNoAnswer.No
        ? false
        : null,
    referralOpportunity:
      data.referralOpportunityChoice === YesNoAnswer.Yes
        ? true
        : data.referralOpportunityChoice === YesNoAnswer.No
        ? false
        : null,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode }: ListingFormProps) => {
  const defaultValues = editMode ? listing : defaults
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
  const [preferences, setPreferences] = useState<Preference[]>(
    listing?.listingPreferences.map((listingPref) => {
      return { ...listingPref.preference }
    }) ?? []
  )
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
    if (listing?.units) {
      const tempUnits = listing.units.map((unit, i) => ({
        ...unit,
        tempId: i + 1,
      }))
      setUnits(tempUnits)
    }

    if (listing?.events) {
      const events = listing.events
        .filter((event) => event.type === ListingEventType.openHouse)
        .map((event) => ({
          ...event,
          startTime: event.startTime,
          endTime: event.endTime,
          url: event.url,
          note: event.note,
          tempId: nanoid(),
        }))

      setOpenHouseEvents(events)
    }
  }, [listing, setUnits, setOpenHouseEvents])

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
          const orderedPreferences = preferences.map((preference, index) => {
            return { preference, ordinal: index + 1 }
          })
          const orderedPrograms = programs.map((program, index) => {
            return { program: { ...program }, ordinal: index + 1 }
          })
          const formattedData = formatFormData(
            formData,
            units,
            openHouseEvents,
            orderedPreferences,
            orderedPrograms,
            latLong,
            customMapPositionChosen,
            profile
          )
          removeEmptyObjects(formattedData)
          const result = editMode
            ? await listingsService.update(
                {
                  listingId: listing.id,
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
                await axios.request({
                  url: `${process.env.backendProxyBase}/listings*`,
                  method: "purge",
                })
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
                if (fieldName === "buildingAddress") {
                  setError(`${fieldName}.city`, { message: readableError })
                  setError(`${fieldName}.state`, { message: readableError })
                  setError(`${fieldName}.street`, { message: readableError })
                  setError(`${fieldName}.zipCode`, { message: readableError })
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
                          <ListingIntro
                            jurisdictionOptions={[
                              { label: "", value: "" },
                              ...profile.jurisdictions.map((jurisdiction) => ({
                                label: jurisdiction.name,
                                value: jurisdiction.id,
                              })),
                            ]}
                          />
                          <ListingPhoto />
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
                            dataFetcher={useJurisdictionalPreferenceList}
                            formKey={"preference"}
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
                            dataFetcher={useJurisdictionalProgramList}
                            formKey={"program"}
                          />
                          <AdditionalFees />
                          <BuildingFeatures />
                          <AdditionalEligibility />
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
