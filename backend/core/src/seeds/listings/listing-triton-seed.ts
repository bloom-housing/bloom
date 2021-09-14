import { AmiChartCreateDto } from "../../ami-charts/dto/ami-chart.dto"
import { ListingSeedType, PropertySeedType, UnitSeedType } from "./listings"
import { getDefaultAmiChart, getDate, getDefaultAssets, getLiveWorkPreference } from "./shared"
import { ListingStatus } from "../../listings/types/listing-status-enum"
import { CSVFormattingType } from "../../csv/types/csv-formatting-type-enum"
import { AmiChart } from "../../ami-charts/entities/ami-chart.entity"
import { ListingDefaultSeed } from "./listing-default-seed"
import { UnitCreateDto } from "../../units/dto/unit.dto"
import { BaseEntity, DeepPartial } from "typeorm"
import { Listing } from "../../listings/entities/listing.entity"
import { UnitStatus } from "../../units/types/unit-status-enum"
import { ListingReviewOrder } from "../../listings/types/listing-review-order-enum"
import { CountyCode } from "../../shared/types/county-code"

export const tritonAmiChart: AmiChartCreateDto = {
  name: "San Jose TCAC 2019",
  items: [
    {
      percentOfAmi: 120,
      householdSize: 1,
      income: 110400,
    },
    {
      percentOfAmi: 120,
      householdSize: 2,
      income: 126150,
    },
    {
      percentOfAmi: 120,
      householdSize: 3,
      income: 141950,
    },
    {
      percentOfAmi: 120,
      householdSize: 4,
      income: 157700,
    },
    {
      percentOfAmi: 120,
      householdSize: 5,
      income: 170300,
    },
    {
      percentOfAmi: 120,
      householdSize: 6,
      income: 182950,
    },
    {
      percentOfAmi: 120,
      householdSize: 7,
      income: 195550,
    },
    {
      percentOfAmi: 120,
      householdSize: 8,
      income: 208150,
    },
    {
      percentOfAmi: 110,
      householdSize: 1,
      income: 101200,
    },
    {
      percentOfAmi: 110,
      householdSize: 2,
      income: 115610,
    },
    {
      percentOfAmi: 110,
      householdSize: 3,
      income: 130075,
    },
    {
      percentOfAmi: 110,
      householdSize: 4,
      income: 144540,
    },
    {
      percentOfAmi: 110,
      householdSize: 5,
      income: 156090,
    },
    {
      percentOfAmi: 110,
      householdSize: 6,
      income: 167640,
    },
    {
      percentOfAmi: 110,
      householdSize: 7,
      income: 179245,
    },
    {
      percentOfAmi: 110,
      householdSize: 8,
      income: 190795,
    },
    {
      percentOfAmi: 100,
      householdSize: 1,
      income: 92000,
    },
    {
      percentOfAmi: 100,
      householdSize: 2,
      income: 105100,
    },
    {
      percentOfAmi: 100,
      householdSize: 3,
      income: 118250,
    },
    {
      percentOfAmi: 100,
      householdSize: 4,
      income: 131400,
    },
    {
      percentOfAmi: 100,
      householdSize: 5,
      income: 141900,
    },
    {
      percentOfAmi: 100,
      householdSize: 6,
      income: 152400,
    },
    {
      percentOfAmi: 100,
      householdSize: 7,
      income: 162950,
    },
    {
      percentOfAmi: 100,
      householdSize: 8,
      income: 173450,
    },
    {
      percentOfAmi: 80,
      householdSize: 1,
      income: 72750,
    },
    {
      percentOfAmi: 80,
      householdSize: 2,
      income: 83150,
    },
    {
      percentOfAmi: 80,
      householdSize: 3,
      income: 93550,
    },
    {
      percentOfAmi: 80,
      householdSize: 4,
      income: 103900,
    },
    {
      percentOfAmi: 80,
      householdSize: 5,
      income: 112250,
    },
    {
      percentOfAmi: 80,
      householdSize: 6,
      income: 120550,
    },
    {
      percentOfAmi: 80,
      householdSize: 7,
      income: 128850,
    },
    {
      percentOfAmi: 80,
      householdSize: 8,
      income: 137150,
    },
    {
      percentOfAmi: 60,
      householdSize: 1,
      income: 61500,
    },
    {
      percentOfAmi: 60,
      householdSize: 2,
      income: 70260,
    },
    {
      percentOfAmi: 60,
      householdSize: 3,
      income: 79020,
    },
    {
      percentOfAmi: 60,
      householdSize: 4,
      income: 87780,
    },
    {
      percentOfAmi: 60,
      householdSize: 5,
      income: 94860,
    },
    {
      percentOfAmi: 60,
      householdSize: 6,
      income: 101880,
    },
    {
      percentOfAmi: 60,
      householdSize: 7,
      income: 108900,
    },
    {
      percentOfAmi: 60,
      householdSize: 8,
      income: 115920,
    },
    {
      percentOfAmi: 55,
      householdSize: 1,
      income: 56375,
    },
    {
      percentOfAmi: 55,
      householdSize: 2,
      income: 64405,
    },
    {
      percentOfAmi: 55,
      householdSize: 3,
      income: 72435,
    },
    {
      percentOfAmi: 55,
      householdSize: 4,
      income: 80465,
    },
    {
      percentOfAmi: 55,
      householdSize: 5,
      income: 86955,
    },
    {
      percentOfAmi: 55,
      householdSize: 6,
      income: 93390,
    },
    {
      percentOfAmi: 55,
      householdSize: 7,
      income: 99825,
    },
    {
      percentOfAmi: 55,
      householdSize: 8,
      income: 106260,
    },
    {
      percentOfAmi: 50,
      householdSize: 1,
      income: 51250,
    },
    {
      percentOfAmi: 50,
      householdSize: 2,
      income: 58550,
    },
    {
      percentOfAmi: 50,
      householdSize: 3,
      income: 65850,
    },
    {
      percentOfAmi: 50,
      householdSize: 4,
      income: 73150,
    },
    {
      percentOfAmi: 50,
      householdSize: 5,
      income: 79050,
    },
    {
      percentOfAmi: 50,
      householdSize: 6,
      income: 84900,
    },
    {
      percentOfAmi: 50,
      householdSize: 7,
      income: 90750,
    },
    {
      percentOfAmi: 50,
      householdSize: 8,
      income: 96600,
    },
    {
      percentOfAmi: 45,
      householdSize: 1,
      income: 46125,
    },
    {
      percentOfAmi: 45,
      householdSize: 2,
      income: 52695,
    },
    {
      percentOfAmi: 45,
      householdSize: 3,
      income: 59265,
    },
    {
      percentOfAmi: 45,
      householdSize: 4,
      income: 65835,
    },
    {
      percentOfAmi: 45,
      householdSize: 5,
      income: 71145,
    },
    {
      percentOfAmi: 45,
      householdSize: 6,
      income: 76410,
    },
    {
      percentOfAmi: 45,
      householdSize: 7,
      income: 81675,
    },
    {
      percentOfAmi: 40,
      householdSize: 1,
      income: 41000,
    },
    {
      percentOfAmi: 40,
      householdSize: 2,
      income: 46840,
    },
    {
      percentOfAmi: 40,
      householdSize: 3,
      income: 52680,
    },
    {
      percentOfAmi: 40,
      householdSize: 4,
      income: 58520,
    },
    {
      percentOfAmi: 40,
      householdSize: 5,
      income: 63240,
    },
    {
      percentOfAmi: 40,
      householdSize: 6,
      income: 67920,
    },
    {
      percentOfAmi: 40,
      householdSize: 7,
      income: 72600,
    },
    {
      percentOfAmi: 40,
      householdSize: 8,
      income: 77280,
    },
    {
      percentOfAmi: 35,
      householdSize: 1,
      income: 35875,
    },
    {
      percentOfAmi: 35,
      householdSize: 2,
      income: 40985,
    },
    {
      percentOfAmi: 35,
      householdSize: 3,
      income: 46095,
    },
    {
      percentOfAmi: 35,
      householdSize: 4,
      income: 51205,
    },
    {
      percentOfAmi: 35,
      householdSize: 5,
      income: 55335,
    },
    {
      percentOfAmi: 35,
      householdSize: 6,
      income: 59430,
    },
    {
      percentOfAmi: 35,
      householdSize: 7,
      income: 63525,
    },
    {
      percentOfAmi: 35,
      householdSize: 8,
      income: 67620,
    },
    {
      percentOfAmi: 30,
      householdSize: 1,
      income: 30750,
    },
    {
      percentOfAmi: 30,
      householdSize: 2,
      income: 35130,
    },
    {
      percentOfAmi: 30,
      householdSize: 3,
      income: 39510,
    },
    {
      percentOfAmi: 30,
      householdSize: 4,
      income: 43890,
    },
    {
      percentOfAmi: 30,
      householdSize: 5,
      income: 47430,
    },
    {
      percentOfAmi: 30,
      householdSize: 6,
      income: 50940,
    },
    {
      percentOfAmi: 30,
      householdSize: 7,
      income: 54450,
    },
    {
      percentOfAmi: 25,
      householdSize: 1,
      income: 25625,
    },
    {
      percentOfAmi: 25,
      householdSize: 2,
      income: 29275,
    },
    {
      percentOfAmi: 25,
      householdSize: 3,
      income: 32925,
    },
    {
      percentOfAmi: 25,
      householdSize: 4,
      income: 36575,
    },
    {
      percentOfAmi: 25,
      householdSize: 5,
      income: 39525,
    },
    {
      percentOfAmi: 25,
      householdSize: 6,
      income: 42450,
    },
    {
      percentOfAmi: 25,
      householdSize: 7,
      income: 45375,
    },
    {
      percentOfAmi: 25,
      householdSize: 8,
      income: 48300,
    },
    {
      percentOfAmi: 20,
      householdSize: 1,
      income: 20500,
    },
    {
      percentOfAmi: 20,
      householdSize: 2,
      income: 23420,
    },
    {
      percentOfAmi: 20,
      householdSize: 3,
      income: 26340,
    },
    {
      percentOfAmi: 20,
      householdSize: 4,
      income: 29260,
    },
    {
      percentOfAmi: 20,
      householdSize: 5,
      income: 31620,
    },
    {
      percentOfAmi: 20,
      householdSize: 6,
      income: 33960,
    },
    {
      percentOfAmi: 20,
      householdSize: 7,
      income: 36300,
    },
    {
      percentOfAmi: 20,
      householdSize: 8,
      income: 38640,
    },
    {
      percentOfAmi: 15,
      householdSize: 1,
      income: 15375,
    },
    {
      percentOfAmi: 15,
      householdSize: 2,
      income: 17565,
    },
    {
      percentOfAmi: 15,
      householdSize: 3,
      income: 19755,
    },
    {
      percentOfAmi: 15,
      householdSize: 4,
      income: 21945,
    },
    {
      percentOfAmi: 15,
      householdSize: 5,
      income: 23715,
    },
    {
      percentOfAmi: 15,
      householdSize: 6,
      income: 25470,
    },
    {
      percentOfAmi: 15,
      householdSize: 7,
      income: 27225,
    },
    {
      percentOfAmi: 15,
      householdSize: 8,
      income: 28980,
    },
  ],
}
const tritonProperty: PropertySeedType = {
  accessibility:
    "Accessibility features in common areas like lobby – wheelchair ramps, wheelchair accessible bathrooms and elevators.",
  amenities: "Gym, Clubhouse, Business Lounge, View Lounge, Pool, Spa",
  buildingAddress: {
    city: "Foster City",
    county: "San Mateo",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  buildingTotalUnits: 48,
  developer: "Thompson Dorfman, LLC",
  neighborhood: "Foster City",
  petPolicy:
    "Pets allowed except the following; pit bull, malamute, akita, rottweiler, doberman, staffordshire terrier, presa canario, chowchow, american bull dog, karelian bear dog, st bernard, german shepherd, husky, great dane, any hybrid or mixed breed of the aforementioned breeds. 50 pound weight limit. 2 pets per household limit. $500 pet deposit per pet. $60 pet rent per pet.",
  servicesOffered: null,
  smokingPolicy: "Non-Smoking",
  unitAmenities: "Washer and dryer, AC and Heater, Gas Stove",
  unitsAvailable: 4,
  yearBuilt: 2021,
}
const tritonUnits: Array<UnitSeedType> = [
  {
    amiChart: getDefaultAmiChart() as AmiChart,
    amiPercentage: "120.0",
    annualIncomeMax: "177300.0",
    annualIncomeMin: "84696.0",
    floor: 1,
    maxOccupancy: 5,
    minOccupancy: 2,
    monthlyIncomeMin: "7058.0",
    monthlyRent: "3340.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 2,
    number: null,
    priorityType: null,
    sqFeet: "1100",
    status: UnitStatus.occupied,
  },
  {
    amiChart: getDefaultAmiChart() as AmiChart,
    amiPercentage: "80.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "58152.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "4858.0",
    monthlyRent: "2624.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    sqFeet: "750",
    status: UnitStatus.occupied,
  },
  {
    amiChart: getDefaultAmiChart() as AmiChart,
    amiPercentage: "80.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "58152.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "4858.0",
    monthlyRent: "2624.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    sqFeet: "750",
    status: UnitStatus.occupied,
  },
  {
    amiChart: getDefaultAmiChart() as AmiChart,
    amiPercentage: "80.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "58152.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "4858.0",
    monthlyRent: "2624.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    sqFeet: "750",
    status: UnitStatus.occupied,
  },
  {
    amiChart: getDefaultAmiChart() as AmiChart,
    amiPercentage: "50.0",
    annualIncomeMax: "103350.0",
    annualIncomeMin: "38952.0",
    floor: 1,
    maxOccupancy: 2,
    minOccupancy: 1,
    monthlyIncomeMin: "3246.0",
    monthlyRent: "1575.0",
    monthlyRentAsPercentOfIncome: null,
    numBathrooms: null,
    numBedrooms: 1,
    number: null,
    priorityType: null,
    sqFeet: "750",
    status: UnitStatus.occupied,
  },
]

const tritonListing: ListingSeedType = {
  applicationAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  countyCode: CountyCode.alameda,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  applicationMailingAddress: null,
  applicationDueDate: getDate(5),
  applicationFee: "38.0",
  applicationOpenDate: getDate(-10),
  applicationDueTime: null,
  applicationOrganization: "Triton",
  applicationPickUpAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  applicationPickUpAddressOfficeHours: null,
  buildingSelectionCriteria:
    "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/The_Triton_BMR_rental_information.pdf",
  costsNotIncluded:
    "Residents responsible for PG&E, Internet, Utilities - water, sewer, trash, admin fee. Pet Deposit is $500 with a $60 monthly pet rent. Residents required to maintain a renter's insurance policy as outlined in the lease agreement. Rent is due by the 3rd of each month. Late fee is $50.00. Resident to pay $25 for each returned check or rejected electronic payment. For additional returned checks, resident will pay a charge of $50.00.",
  creditHistory:
    "No collections, no bankruptcy, income is twice monthly rent A credit report will be completed on all applicants to verify credit ratings.\n\nIncome plus verified credit history will be entered into a credit scoring model to determine rental eligibility and security deposit levels. All decisions for residency are based on a system which considers credit history, rent history, income qualifications, and employment history. An approved decision based on the system does not automatically constittute an approval of residency. Applicant(s) and occupant(s) aged 18 years or older MUST also pass the criminal background check based on the criteria contained herein to be approved for residency. \n\nCredit recommendations other than an accept decision, will require a rental verification. Applications for residency will automatically be denied for the following reasons:\n\n- a. An outstanding debt to a previous landlord or an outstanding NSF check must be paid in full\n- b. An unsatisfied breach of a prior lease or a prior eviction of any applicant or occupant\n- c. More than four (4) late pays and two (2) NSF's in the last twenty-four (24) months",
  criminalBackground: null,
  CSVFormattingType: CSVFormattingType.basic,
  depositMax: "800",
  depositMin: "500",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  leasingAgentAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
  },
  leasingAgentEmail: "thetriton@legacypartners.com",
  leasingAgentName: "Francis Santos",
  leasingAgentOfficeHours: "Monday - Friday, 9:00 am - 5:00 pm",
  leasingAgentPhone: "650-437-2039",
  leasingAgentTitle: "Business Manager",
  name: "Test: Triton",
  postmarkedApplicationsReceivedByDate: null,
  programRules: null,
  rentalAssistance: null,
  rentalHistory: "No evictions",
  requiredDocuments:
    "Due at interview - Paystubs, 3 months’ bank statements, recent tax returns or non-tax affidavit, recent retirement statement, application to lease, application qualifying criteria, social security card, state or nation ID. For self-employed, copy of IRS Tax Return including schedule C and current or most recent clients. Unemployment if applicable. Child support/Alimony; current notice from DA office, a court order or a letter from the provider with copies of last two checks. Any other income etc",
  reviewOrderType: "firstComeFirstServe" as ListingReviewOrder,
  specialNotes: null,
  status: ListingStatus.active,
  waitlistCurrentSize: 400,
  waitlistMaxSize: 600,
  waitlistOpenSpots: 200,
  isWaitlistOpen: true,
  whatToExpect: null,
}

export class ListingTritonSeed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const amiChart = await this.amiChartRepository.save(tritonAmiChart)

    const property = await this.propertyRepository.save({
      ...tritonProperty,
    })

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = tritonUnits.map(
      (unit) => {
        return {
          ...unit,
          property: {
            id: property.id,
          },
          amiChart,
        }
      }
    )

    unitsToBeCreated[0].unitType = unitTypeTwoBdrm
    unitsToBeCreated[1].unitType = unitTypeOneBdrm
    unitsToBeCreated[2].unitType = unitTypeOneBdrm
    unitsToBeCreated[3].unitType = unitTypeOneBdrm
    unitsToBeCreated[4].unitType = unitTypeOneBdrm

    await this.unitsRepository.save(unitsToBeCreated)

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...tritonListing,
      property: property,
      assets: getDefaultAssets(),
      preferences: [getLiveWorkPreference()],
      events: [],
    }

    return await this.listingRepository.save(listingCreateDto)
  }
}
