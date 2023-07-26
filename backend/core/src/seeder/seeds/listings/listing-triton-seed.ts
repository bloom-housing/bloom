import { ListingSeedType, UnitSeedType } from "./listings"
import { getDate, getDefaultAssets, getLiveWorkPreference } from "./shared"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingReviewOrder } from "../../../listings/types/listing-review-order-enum"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"
import { Listing } from "../../../listings/entities/listing.entity"
import { classToClass } from "class-transformer"
import dayjs from "dayjs"

const tritonListing: ListingSeedType = {
  jurisdictionName: "Bay Area",
  digitalApplication: false,
  commonDigitalApplication: false,
  paperApplication: false,
  referralOpportunity: false,
  countyCode: CountyCode.bay_area,
  accessibility:
    "Accessibility features in common areas like lobby – wheelchair ramps, wheelchair accessible bathrooms and elevators.",
  amenities: "Gym, Clubhouse, Business Lounge, View Lounge, Pool, Spa",
  buildingAddress: {
    city: "Fairfield",
    county: "Solano",
    state: "CA",
    street: "2550 Hilborn Rd",
    zipCode: "94534",
    latitude: 38.2780166,
    longitude: -122.0540528,
  },
  buildingTotalUnits: 48,
  developer: "Thompson Dorfman, LLC",
  neighborhood: "Fairfield",
  petPolicy:
    "Pets allowed except the following; pit bull, malamute, akita, rottweiler, doberman, staffordshire terrier, presa canario, chowchow, american bull dog, karelian bear dog, st bernard, german shepherd, husky, great dane, any hybrid or mixed breed of the aforementioned breeds. 50 pound weight limit. 2 pets per household limit. $500 pet deposit per pet. $60 pet rent per pet.",
  servicesOffered: null,
  smokingPolicy: "Non-Smoking",
  unitAmenities: "Washer and dryer, AC and Heater, Gas Stove",
  yearBuilt: 2021,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  applicationMailingAddress: null,
  applicationDueDate: getDate(5),
  applicationFee: "38.0",
  applicationOpenDate: getDate(-10),
  applicationOrganization: "Triton",
  applicationPickUpAddress: {
    city: "Fairfield",
    state: "CA",
    street: "2550 Hilborn Rd",
    zipCode: "94534",
    latitude: 38.2780166,
    longitude: -122.0540528,
  },
  images: [],
  applicationPickUpAddressOfficeHours: null,
  buildingSelectionCriteria:
    "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/The_Triton_BMR_rental_information.pdf",
  costsNotIncluded:
    "Residents responsible for PG&E, Internet, Utilities - water, sewer, trash, admin fee. Pet Deposit is $500 with a $60 monthly pet rent. Residents required to maintain a renter's insurance policy as outlined in the lease agreement. Rent is due by the 3rd of each month. Late fee is $50.00. Resident to pay $25 for each returned check or rejected electronic payment. For additional returned checks, resident will pay a charge of $50.00.",
  creditHistory:
    "No collections, no bankruptcy, income is twice monthly rent A credit report will be completed on all applicants to verify credit ratings.\n\nIncome plus verified credit history will be entered into a credit scoring model to determine rental eligibility and security deposit levels. All decisions for residency are based on a system which considers credit history, rent history, income qualifications, and employment history. An approved decision based on the system does not automatically constittute an approval of residency. Applicant(s) and occupant(s) aged 18 years or older MUST also pass the criminal background check based on the criteria contained herein to be approved for residency. \n\nCredit recommendations other than an accept decision, will require a rental verification. Applications for residency will automatically be denied for the following reasons:\n\n- a. An outstanding debt to a previous landlord or an outstanding NSF check must be paid in full\n- b. An unsatisfied breach of a prior lease or a prior eviction of any applicant or occupant\n- c. More than four (4) late pays and two (2) NSF's in the last twenty-four (24) months",
  criminalBackground: null,
  depositMax: "800",
  depositMin: "500",
  disableUnitsAccordion: true,
  displayWaitlistSize: false,
  leasingAgentAddress: {
    city: "Fairfield",
    state: "CA",
    street: "2550 Hilborn Rd",
    zipCode: "94534",
    latitude: 38.2780166,
    longitude: -122.0540528,
  },
  leasingAgentEmail: "thetriton@legacypartners.com",
  leasingAgentName: "Francis Santos",
  leasingAgentOfficeHours: "Monday - Friday, 9:00 am - 5:00 pm",
  leasingAgentPhone: "650-437-2039",
  leasingAgentTitle: "Business Manager",
  listingMultiselectQuestions: [],
  name: "Test: Triton",
  postmarkedApplicationsReceivedByDate: null,
  programRules: null,
  rentalAssistance: "Rental assistance",
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
  utilities: {
    water: true,
    gas: true,
    trash: null,
    sewer: true,
    electricity: false,
    cable: null,
    phone: true,
    internet: null,
  },
}

export class ListingTritonSeed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "oneBdrm" },
    })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "twoBdrm" },
    })

    const bayAreaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.bay_area },
    })

    const amiChart = await this.amiChartRepository.findOneOrFail({
      where: {
        name: "San Jose TCAC 2019",
        jurisdiction: {
          name: bayAreaJurisdiction.name,
        },
      },
    })

    const tritonUnits: Array<UnitSeedType> = [
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...classToClass(tritonListing),
      name: "Test: Triton 2",
      publishedAt: dayjs(new Date()).subtract(2.5, "hour"),
      assets: getDefaultAssets(),
      listingMultiselectQuestions: [
        {
          multiselectQuestion: await this.multiselectQuestionsRepository.findOneOrFail({
            where: { text: getLiveWorkPreference(bayAreaJurisdiction.name).text },
          }),
          ordinal: 2,
        },
      ],
      events: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = tritonUnits.map(
      (unit) => {
        return {
          ...unit,
          listing: {
            id: listing.id,
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

    return listing
  }
}

export class ListingTritonSeedDetroit extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "oneBdrm" },
    })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({
      where: { name: "twoBdrm" },
    })

    const detroitJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      where: { name: CountyCode.detroit },
    })
    const amiChart = await this.amiChartRepository.findOneOrFail({
      where: {
        name: "Detroit TCAC 2019",
        jurisdiction: {
          name: detroitJurisdiction.name,
        },
      },
    })

    const tritonUnits: Array<UnitSeedType> = [
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
      {
        amiChart: amiChart,
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
      },
    ]

    const listingCreateDto: Omit<
      DeepPartial<Listing>,
      keyof BaseEntity | "urlSlug" | "showWaitlist"
    > = {
      ...classToClass(tritonListing),
      name: "Test: Triton 1",
      applicationOpenDate: getDate(-5),
      assets: getDefaultAssets(),
      events: [],
    }

    const listing = await this.listingRepository.save(listingCreateDto)

    const unitsToBeCreated: Array<Omit<UnitCreateDto, keyof BaseEntity>> = tritonUnits.map(
      (unit) => {
        return {
          ...unit,
          listing: {
            id: listing.id,
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

    return listing
  }
}
