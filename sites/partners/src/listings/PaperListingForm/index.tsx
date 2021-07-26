import React, { useState, useCallback, useContext, useEffect } from "react"
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
} from "@bloom-housing/ui-components"
import { useForm, FormProvider } from "react-hook-form"
import {
  ListingStatus,
  CSVFormattingType,
  CountyCode,
  ListingApplicationAddressType,
  Unit,
  Listing,
  ListingEventType,
  ListingEventCreate,
} from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../../applications/PaperApplicationForm/FormTypes"
import moment from "moment"

import Aside from "../Aside"
import AdditionalDetails from "./sections/AdditionalDetails"
import AdditionalEligibility from "./sections/AdditionalEligibility"
import LeasingAgent from "./sections/LeasingAgent"
import AdditionalFees from "./sections/AdditionalFees"
import Units from "./sections/Units"
import { stringToBoolean, stringToNumber } from "../../../lib/helpers"
import BuildingDetails from "./sections/BuildingDetails"
import ListingIntro from "./sections/ListingIntro"
import ListingPhoto from "./sections/ListingPhoto"
import BuildingFeatures from "./sections/BuildingFeatures"
import RankingsAndResults from "./sections/RankingsAndResults"
import ApplicationAddress from "./sections/ApplicationAddress"
import ApplicationDates from "./sections/ApplicationDates"

export type FormListing = Listing & {
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
  arePaperAppsMailedToAnotherAddress?: boolean
  arePostmarksConsidered?: boolean
  canApplicationsBeDroppedOff?: boolean
  canPaperApplicationsBePickedUp?: boolean
  dueDateQuestion?: boolean
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

interface SubmitData {
  ready: boolean
  data: FormListing
}

const defaultAddress = {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  city: "",
  state: "",
  street: "",
  zipCode: "",
}

const defaults: FormListing = {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  applicationAddress: defaultAddress,
  applicationDueDate: new Date(),
  applicationDueTime: null,
  applicationFee: "0",
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
  countyCode: CountyCode.Alameda,
  costsNotIncluded: "",
  creditHistory: "",
  criminalBackground: "",
  CSVFormattingType: CSVFormattingType.basic,
  depositMax: "",
  depositMin: "",
  disableUnitsAccordion: false,
  displayWaitlistSize: false,
  events: [],
  image: { fileId: "", label: "" },
  leasingAgentAddress: defaultAddress,
  leasingAgentEmail: "test@email.com",
  leasingAgentName: "",
  leasingAgentOfficeHours: "",
  leasingAgentPhone: "",
  leasingAgentTitle: "",
  name: "",
  postMarkDate: null,
  postmarkedApplicationsReceivedByDate: null,
  preferences: [],
  programRules: "",
  rentalAssistance: "",
  rentalHistory: "",
  requiredDocuments: "",
  status: ListingStatus.pending,
  waitlistCurrentSize: null,
  waitlistMaxSize: null,
  isWaitlistOpen: null,
  waitlistOpenSpots: null,
  whatToExpect: {
    applicantsWillBeContacted: "",
    allInfoWillBeVerified: "",
    bePreparedIfChosen: "",
  },
  units: [],
  accessibility: "",
  amenities: "",
  buildingAddress: defaultAddress,
  buildingTotalUnits: 0,
  developer: "",
  householdSizeMax: 0,
  householdSizeMin: 0,
  neighborhood: "",
  petPolicy: "",
  smokingPolicy: "",
  unitsAvailable: 0,
  unitAmenities: "",
  servicesOffered: "",
  yearBuilt: 2021,
  urlSlug: undefined,
  showWaitlist: false,
  reviewOrderType: null,
  unitsSummarized: {
    unitTypes: [],
    reservedTypes: [],
    priorityTypes: [],
    amiPercentages: [],
    byUnitTypeAndRent: [],
    byUnitType: [],
    byNonReservedUnitType: [],
    byReservedType: [],
    byAMI: [],
    hmi: {
      columns: [],
      rows: [],
    },
  },
}

export type TempUnit = Unit & {
  tempId?: number
}

const formatFormData = (data: FormListing, units: TempUnit[]) => {
  const showWaitlistNumber =
    data.waitlistOpenQuestion === YesNoAnswer.Yes && data.waitlistSizeQuestion === YesNoAnswer.Yes

  const createDate = (formDate: { year: string; month: string; day: string }) => {
    return new Date(`${formDate.month}-${formDate.day}-${formDate.year}`)
  }

  const createTime = (
    date: Date,
    formTime: { hours: string; minutes: string; period: TimeFieldPeriod }
  ) => {
    let formattedHours = parseInt(formTime.hours)
    if (formTime.period === "am" && formattedHours === 12) {
      formattedHours = 0
    }
    if (formTime.period === "pm" && formattedHours !== 12) {
      formattedHours = formattedHours + 12
    }
    date.setHours(formattedHours, parseInt(formTime.minutes), 0)
    return date
  }

  const applicationDueDateFormatted = createDate(data.applicationDueDateField)
  const applicationDueTimeFormatted = createTime(
    applicationDueDateFormatted,
    data.applicationDueTimeField
  )

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

    unit.floor = stringToNumber(unit.floor)
    unit.maxOccupancy = stringToNumber(unit.maxOccupancy)
    unit.minOccupancy = stringToNumber(unit.minOccupancy)
    unit.numBathrooms = stringToNumber(unit.numBathrooms)

    if (unit.sqFeet.length === 0) {
      delete unit.sqFeet
    }

    if (unit.id === undefined) {
      unit.id = ""
      delete unit.updatedAt
      delete unit.createdAt
    }

    delete unit.tempId
  })

  const events: ListingEventCreate[] = []
  if (data.lotteryDate && data.reviewOrderQuestion === "reviewOrderLottery") {
    const startTime = createTime(createDate(data.lotteryDate), data.lotteryStartTime)
    const endTime = createTime(createDate(data.lotteryDate), data.lotteryEndTime)

    events.push({
      type: ListingEventType.publicLottery,
      startTime: startTime,
      endTime: endTime,
      note: data.lotteryDateNotes,
    })
  }

  return {
    ...data,
    applicationDueTime: applicationDueTimeFormatted,
    disableUnitsAccordion: stringToBoolean(data.disableUnitsAccordion),
    units: units,
    isWaitlistOpen: data.waitlistOpenQuestion === YesNoAnswer.Yes,
    applicationDueDate: applicationDueDateFormatted,
    yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : null,
    waitlistCurrentSize:
      data.waitlistCurrentSize && showWaitlistNumber ? Number(data.waitlistCurrentSize) : null,
    waitlistMaxSize:
      data.waitlistMaxSize && showWaitlistNumber ? Number(data.waitlistMaxSize) : null,
    waitlistOpenSpots:
      data.waitlistOpenSpots && showWaitlistNumber ? Number(data.waitlistOpenSpots) : null,
    postmarkedApplicationsReceivedByDate:
      data.postMarkDate && data.arePostmarksConsidered
        ? new Date(`${data.postMarkDate.year}-${data.postMarkDate.month}-${data.postMarkDate.day}`)
        : null,
    applicationDropOffAddressType:
      addressTypes[data.whereApplicationsDroppedOff] !== addressTypes.anotherAddress
        ? addressTypes[data.whereApplicationsDroppedOff]
        : null,
    applicationPickUpAddressType:
      addressTypes[data.whereApplicationsPickedUp] !== addressTypes.anotherAddress
        ? addressTypes[data.whereApplicationsPickedUp]
        : null,
    applicationDropOffAddress:
      data.canApplicationsBeDroppedOff &&
      data.whereApplicationsPickedUp === addressTypes.anotherAddress
        ? data.applicationDropOffAddress
        : null,
    applicationPickUpAddress:
      data.canPaperApplicationsBePickedUp &&
      data.whereApplicationsPickedUp === addressTypes.anotherAddress
        ? data.applicationPickUpAddress
        : null,
    applicationMailingAddress: data.arePaperAppsMailedToAnotherAddress
      ? data.applicationMailingAddress
      : null,
    events: events,
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ListingForm = ({ listing, editMode }: ListingFormProps) => {
  const defaultValues = editMode ? listing : defaults
  const formMethods = useForm<FormListing>({
    defaultValues,
  })

  const router = useRouter()

  const { listingsService } = useContext(AuthContext)

  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<ListingStatus>(null)
  const [submitData, setSubmitData] = useState<SubmitData>({ ready: false, data: defaultValues })
  const [units, setUnits] = useState<TempUnit[]>([])

  /**
   * Close modal
   */
  const [closeModal, setCloseModal] = useState(false)

  useEffect(() => {
    if (listing?.units) {
      const tempUnits = listing.units.map((unit, i) => ({
        ...unit,
        tempId: i + 1,
      }))
      setUnits(tempUnits)
    }
  }, [listing, setUnits])

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { handleSubmit, getValues } = formMethods

  const triggerSubmit = (data: FormListing) => {
    setAlert(null)
    setLoading(true)
    setSubmitData({ ready: true, data: { ...submitData.data, ...data } })
  }

  /*
    @data: form data comes from the react-hook-form
  */
  const onSubmit = useCallback(
    async (data: FormListing, status: ListingStatus) => {
      try {
        data = {
          ...data,
          status,
        }
        const formattedData = formatFormData(data, units)
        const result = editMode
          ? await listingsService.update({
              listingId: listing.id,
              body: { id: listing.id, ...formattedData },
            })
          : await listingsService.create({ body: formattedData })
        setLoading(false)
        if (result) {
          setSiteAlertMessage(
            editMode ? t("listings.listingUpdated") : t("listings.listingSubmitted"),
            "success"
          )

          await router.push(`/listings/${result.id}`)
        }
      } catch (err) {
        console.log(err)
        setLoading(false)
        setAlert("api")
      }
    },
    [units, editMode, listingsService, listing, router]
  )

  const onError = () => {
    setLoading(false)
    setAlert("form")
  }

  useEffect(() => {
    if (submitData.ready === true && status !== null) {
      void onSubmit(submitData.data, status)
    }
  }, [submitData.ready, submitData.data, onSubmit, status])

  return (
    <>
      <LoadingOverlay isLoading={loading}>
        <>
          <StatusBar
            backButton={
              <Button
                inlineIcon="left"
                icon="arrowBack"
                onClick={() => (editMode ? router.push(`/listing/${listing?.id}`) : router.back())}
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
                    {alert === "form" ? t("listings.error") : t("errors.alert.badRequest")}
                  </AlertBox>
                )}

                <Form id="listing-form" onSubmit={handleSubmit(triggerSubmit, onError)}>
                  <div className="flex flex-row flex-wrap">
                    <div className="info-card md:w-9/12">
                      <ListingIntro />
                      <ListingPhoto />
                      <BuildingDetails />
                      <Units
                        units={units}
                        setUnits={setUnits}
                        disableUnitsAccordion={listing?.disableUnitsAccordion}
                      />
                      <AdditionalFees />
                      <BuildingFeatures />
                      <AdditionalEligibility />
                      <AdditionalDetails />
                      <RankingsAndResults listing={listing} />
                      <LeasingAgent />
                      <ApplicationAddress listing={listing} />
                      <ApplicationDates listing={listing} />
                    </div>

                    <aside className="md:w-3/12 md:pl-6">
                      <Aside
                        type={editMode ? "edit" : "add"}
                        setStatus={setStatus}
                        showCloseListingModal={() => setCloseModal(true)}
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
            styleType={AppearanceStyleType.secondary}
            onClick={() => {
              setStatus(ListingStatus.closed)
              triggerSubmit(getValues())
              setCloseModal(false)
            }}
          >
            {t("listings.actions.close")}
          </Button>,
          <Button
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
    </>
  )
}

export default ListingForm
