import { ListingSeedType, PropertySeedType, UnitSeedType } from "./listings"
import { getDate, getDefaultAssets, getLiveWorkPreference } from "./shared"
import { ListingDefaultSeed } from "./listing-default-seed"
import { BaseEntity, DeepPartial } from "typeorm"
import { CountyCode } from "../../../shared/types/county-code"
import { ListingReviewOrder } from "../../../listings/types/listing-review-order-enum"
import { ListingStatus } from "../../../listings/types/listing-status-enum"
import { UnitCreateDto } from "../../../units/dto/unit-create.dto"
import { Listing } from "../../../listings/entities/listing.entity"
import { ListingAvailability } from "../../../listings/types/listing-availability-enum"

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
  yearBuilt: 2021,
}

const tritonListing: ListingSeedType = {
  jurisdictionName: "Alameda",
  digitalApplication: false,
  commonDigitalApplication: false,
  paperApplication: false,
  referralOpportunity: false,
  countyCode: CountyCode.alameda,
  applicationDropOffAddress: null,
  applicationDropOffAddressOfficeHours: null,
  applicationMailingAddress: null,
  applicationDueDate: getDate(5),
  applicationFee: "38.0",
  applicationOpenDate: getDate(-10),
  applicationOrganization: "Triton",
  applicationPickUpAddress: {
    city: "Foster City",
    state: "CA",
    street: "55 Triton Park Lane",
    zipCode: "94404",
    latitude: 37.5658152,
    longitude: -122.2704286,
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
  listingPreferences: [],
  listingPrograms: [],
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
  listingAvailability: ListingAvailability.availableUnits,
}

export class ListingTritonSeed extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const alamedaJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.alameda,
    })

    const amiChart = await this.amiChartRepository.findOneOrFail({
      name: "San Jose TCAC 2019",
      jurisdiction: alamedaJurisdiction,
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

    const property = await this.propertyRepository.save({
      ...tritonProperty,
      unitsAvailable: tritonUnits.length,
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
      name: "Test: Triton 2",
      property: property,
      utilities: {
        water: true,
        gas: true,
        trash: null,
        sewer: true,
        electricity: true,
        cable: null,
        phone: false,
        internet: true,
      },
      assets: getDefaultAssets(),
      listingPreferences: [
        {
          preference: await this.preferencesRepository.findOneOrFail({
            title: getLiveWorkPreference(alamedaJurisdiction.name).title,
          }),
          ordinal: 2,
        },
      ],
      events: [],
    }

    return await this.listingRepository.save(listingCreateDto)
  }
}

export class ListingTritonSeedDetroit extends ListingDefaultSeed {
  async seed() {
    const unitTypeOneBdrm = await this.unitTypeRepository.findOneOrFail({ name: "oneBdrm" })
    const unitTypeTwoBdrm = await this.unitTypeRepository.findOneOrFail({ name: "twoBdrm" })

    const detroitJurisdiction = await this.jurisdictionRepository.findOneOrFail({
      name: CountyCode.detroit,
    })
    const amiChart = await this.amiChartRepository.findOneOrFail({
      name: "Detroit TCAC 2019",
      jurisdiction: detroitJurisdiction,
    })

    const property = await this.propertyRepository.findOneOrFail({
      developer: "Thompson Dorfman, LLC",
      neighborhood: "Foster City",
      smokingPolicy: "Non-Smoking",
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
      name: "Test: Triton 1",
      property: property,
      utilities: {
        water: false,
        gas: true,
        trash: null,
        sewer: true,
        electricity: true,
        cable: null,
        phone: false,
        internet: null,
      },
      applicationOpenDate: getDate(-5),
      assets: getDefaultAssets(),
      events: [],
    }

    return await this.listingRepository.save(listingCreateDto)
  }
}
