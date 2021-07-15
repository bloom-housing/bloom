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
} from "@bloom-housing/ui-components"
import { useForm, FormProvider } from "react-hook-form"
import {
  ListingStatus,
  CSVFormattingType,
  CountyCode,
  ListingApplicationAddressType,
  Unit,
  Listing,
  AmiChart,
} from "@bloom-housing/backend-core/types"
import { YesNoAnswer } from "../../applications/PaperApplicationForm/FormTypes"
import moment from "moment"

import Aside from "../Aside"
import AdditionalDetails from "./sections/AdditionalDetails"
import AdditionalEligibility from "./sections/AdditionalEligibility"
import LeasingAgent from "./sections/LeasingAgent"
import AdditionalFees from "./sections/AdditionalFees"
import Units from "./sections/Units"
import { getAmiChartId, stringToBoolean, stringToNumber } from "../../../lib/helpers"
import { useAmiChartList } from "../../../lib/hooks"
import BuildingDetails from "./sections/BuildingDetails"
import ListingIntro from "./sections/ListingIntro"
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
    seconds: string
    period: TimeFieldPeriod
  }
  whereApplicationsDroppedOff?: ListingApplicationAddressType
  whereApplicationsPickedUp?: ListingApplicationAddressType
  arePaperAppsMailedToAnotherAddress?: boolean
  arePostmarksConsidered?: boolean
  canApplicationsBeDroppedOff?: boolean
  canPaperApplicationsBePickedUp?: boolean
  postMarkDate?: {
    month: string
    day: string
    year: string
  }
  waitlistOpenQuestion?: YesNoAnswer
  waitlistSizeQuestion?: YesNoAnswer
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

const formatFormData = (data: FormListing, amiCharts: AmiChart[], units: TempUnit[]) => {
  const showWaitlistNumber =
    data.waitlistOpenQuestion === YesNoAnswer.Yes && data.waitlistSizeQuestion === YesNoAnswer.Yes

  const getDueTime = () => {
    let dueTimeHours = parseInt(data.applicationDueTimeField.hours)
    if (data.applicationDueTimeField.period === "am" && dueTimeHours === 12) {
      dueTimeHours = 0
    }
    if (data.applicationDueTimeField.period === "pm" && dueTimeHours !== 12) {
      dueTimeHours = dueTimeHours + 12
    }
    const dueTime = new Date()
    dueTime.setHours(
      dueTimeHours,
      parseInt(data.applicationDueTimeField.minutes),
      parseInt(data.applicationDueTimeField.seconds)
    )
    return dueTime
  }
  units.forEach((unit) => {
    switch (unit.unitType.name) {
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

    const amiChartId = getAmiChartId(unit.amiChart)
    if (amiChartId) {
      const chart = amiCharts.find((chart) => chart.id === amiChartId)
      unit.amiChart = chart
    } else {
      delete unit.amiChart
    }

    if (unit.id === undefined) {
      unit.id = ""
      delete unit.updatedAt
      delete unit.createdAt
    }

    delete unit.tempId
  })

  return {
    ...data,
    applicationDueTime: getDueTime(),
    disableUnitsAccordion: stringToBoolean(data.disableUnitsAccordion),
    units: units,
    isWaitlistOpen: data.waitlistOpenQuestion === YesNoAnswer.Yes,
    applicationDueDate: new Date(
      `${data.applicationDueDateField.year}-${data.applicationDueDateField.month}-${data.applicationDueDateField.day}`
    ),
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

  /**
   * fetch options
   */
  const { data: amiCharts = [] } = useAmiChartList()
  const [alert, setAlert] = useState<AlertErrorType | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<ListingStatus>(null)
  const [submitData, setSubmitData] = useState<SubmitData>({ ready: false, data: defaultValues })
  const [units, setUnits] = useState<TempUnit[]>([])

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
  const { handleSubmit, trigger } = formMethods

  const triggerSubmit = (data: FormListing) => {
    setAlert(null)
    setLoading(true)
    setSubmitData({ ready: true, data: { ...submitData.data, ...data } })
  }

  /*
    @data: form data comes from the react-hook-form
  */
  const onSubmit = useCallback(
    async (data: FormListing) => {
      const validation = await trigger()

      if (validation) {
        setLoading(false)
        return
      }

      try {
        data = {
          ...data,
          status,
        }
        const formattedData = formatFormData(data, amiCharts, units)
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

          void router.push(`/listings/${result.id}`)
        }
      } catch (err) {
        setLoading(false)
        setAlert("api")
      }
    },
    [amiCharts, editMode, listing?.id, listingsService, router, status, trigger, units]
  )

  const onError = () => {
    setAlert("form")
  }

  useEffect(() => {
    if (submitData.ready === true && status !== null) {
      void onSubmit(submitData.data)
    }
  }, [submitData.ready, submitData.data, onSubmit, status])

  return (
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
                  {alert === "form" ? t("listings.error") : t("errors.alert.badRequest")}
                </AlertBox>
              )}

              <Form id="listing-form" onSubmit={handleSubmit(triggerSubmit, onError)}>
                <div className="flex flex-row flex-wrap">
                  <div className="info-card md:w-9/12">
                    <ListingIntro />
                    <BuildingDetails />
                    <Units
                      units={units}
                      setUnits={setUnits}
                      amiCharts={amiCharts}
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
                    <Aside type={editMode ? "edit" : "add"} setStatus={setStatus} />
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
