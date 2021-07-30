import { Injectable, NotFoundException } from "@nestjs/common"
import jp from "jsonpath"

import { Listing } from "./entities/listing.entity"
import { ListingCreateDto, ListingUpdateDto, ListingFilterParams } from "./dto/listing.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { addFilter } from "../shared/filter"
import { plainToClass } from "class-transformer"
import { PropertyCreateDto, PropertyUpdateDto } from "../property/dto/property.dto"
import { arrayIndex } from "../libs/arrayLib"

@Injectable()
export class ListingsService {
  constructor(@InjectRepository(Listing) private readonly listingRepository: Repository<Listing>) {}

  private getQueryBuilder() {
    return Listing.createQueryBuilder("listings")
      .leftJoinAndSelect("listings.applicationMethods", "applicationMethods")
      .leftJoinAndSelect("applicationMethods.paperApplications", "paperApplications")
      .leftJoinAndSelect("paperApplications.file", "paperApplicationFile")
      .leftJoinAndSelect("listings.image", "image")
      .leftJoinAndSelect("listings.events", "listingEvents")
      .leftJoinAndSelect("listingEvents.file", "listingEventFile")
      .leftJoinAndSelect("listings.result", "result")
      .leftJoinAndSelect("listings.applicationAddress", "applicationAddress")
      .leftJoinAndSelect("listings.leasingAgentAddress", "leasingAgentAddress")
      .leftJoinAndSelect("listings.applicationPickUpAddress", "applicationPickUpAddress")
      .leftJoinAndSelect("listings.applicationMailingAddress", "applicationMailingAddress")
      .leftJoinAndSelect("listings.applicationDropOffAddress", "applicationDropOffAddress")
      .leftJoinAndSelect("listings.leasingAgents", "leasingAgents")
      .leftJoinAndSelect("listings.preferences", "preferences")
      .leftJoinAndSelect("listings.property", "property")
      .leftJoinAndSelect("property.buildingAddress", "buildingAddress")
      .leftJoinAndSelect("property.units", "units")
      .leftJoinAndSelect("units.unitType", "unitTypeRef")
      .leftJoinAndSelect("units.unitRentType", "unitRentType")
      .leftJoinAndSelect("units.priorityType", "priorityType")
      .leftJoinAndSelect("units.amiChart", "amiChart")
      .leftJoinAndSelect("listings.jurisdiction", "jurisdiction")
      .leftJoinAndSelect("listings.reservedCommunityType", "reservedCommunityType")
  }

  private testListingResponse = [
    {
      id: "da66473e-9600-4f6d-8d02-f4371e166736",
      createdAt: "2021-07-29T11:57:27.793Z",
      updatedAt: "2021-07-29T11:57:27.819Z",
      additionalApplicationSubmissionNotes: null,
      applicationMethods: [
        {
          type: "Internal",
          label: "Label",
          externalReference: "",
          acceptsPostmarkedApplications: false,
        },
      ],
      assets: [
        {
          fileId:
            "https://regional-dahlia-staging.s3-us-west-1.amazonaws.com/listings/triton/thetriton.png",
          label: "building",
        },
      ],
      applicationDueDate: "2021-08-08T11:57:18.209Z",
      applicationDueTime: null,
      applicationOpenDate: "2021-07-19T11:57:18.209Z",
      applicationFee: "20",
      applicationOrganization: "Application Organization",
      applicationPickUpAddressOfficeHours: "Custom pick up address office hours text",
      applicationPickUpAddressType: null,
      applicationDropOffAddressOfficeHours: null,
      applicationDropOffAddressType: null,
      buildingSelectionCriteria: "example.com",
      costsNotIncluded: "Custom costs not included text",
      creditHistory: "Custom credit history text",
      criminalBackground: "Custom criminal background text",
      depositMin: "500",
      depositMax: "500",
      disableUnitsAccordion: true,
      leasingAgentEmail: "hello@exygy.com",
      leasingAgentName: "Leasing Agent Name",
      leasingAgentOfficeHours: "Custom leasing agent office hours",
      leasingAgentPhone: "(415) 992-7251",
      leasingAgentTitle: "Leasing Agent Title",
      name: "Test: Default, No Preferences",
      postmarkedApplicationsReceivedByDate: null,
      programRules: "Custom program rules text",
      rentalAssistance: "Custom rental assistance text",
      rentalHistory: "Custom rental history text",
      requiredDocuments: "Custom required documents text",
      specialNotes: "Custom special notes text",
      waitlistCurrentSize: null,
      waitlistMaxSize: null,
      whatToExpect: {
        applicantsWillBeContacted: "Custom applicant will be contacted text",
        allInfoWillBeVerified: "Custom all info will be verified text",
        bePreparedIfChosen: "Custom be prepared if chosen text",
      },
      status: "active",
      urlSlug: "test_default_no_preferences_548_market_street_san_francisco_ca",
      applicationCount: 20,
      displayWaitlistSize: false,
      CSVFormattingType: "basic",
      countyCode: "Alameda",
      showWaitlist: false,
      reservedCommunityMinAge: null,
      resultLink: null,
      isWaitlistOpen: false,
      waitlistOpenSpots: null,
      preferences: [],
      applicationAddress: {
        id: "de1e7871-2617-4ec8-8055-bd543babdeff",
        createdAt: "2021-07-29T11:57:27.793Z",
        updatedAt: "2021-07-29T11:57:27.819Z",
        placeName: null,
        city: "San Francisco",
        county: null,
        state: "CA",
        street: "548 Market Street",
        street2: "Suite #59930",
        zipCode: "94104",
        latitude: 37.789673,
        longitude: -122.40151,
      },
      applicationPickUpAddress: {
        id: "41933902-9de9-4ffe-a57c-1131d7ce6072",
        createdAt: "2021-07-29T11:57:27.793Z",
        updatedAt: "2021-07-29T11:57:27.819Z",
        placeName: null,
        city: "San Francisco",
        county: null,
        state: "CA",
        street: "548 Market Street",
        street2: "Suite #59930",
        zipCode: "94104",
        latitude: 37.789673,
        longitude: -122.40151,
      },
      applicationDropOffAddress: null,
      applicationMailingAddress: null,
      events: [
        {
          type: "openHouse",
          startTime: "2021-08-08T11:57:18.208Z",
          endTime: "2021-08-08T11:57:18.209Z",
          url: "example.com",
          note: "Custom open house event note",
          label: "Custom Event URL Label",
          file: null,
          id: "9c008ca5-33e2-466b-9574-695a3f171a87",
          createdAt: "2021-07-29T11:57:27.793Z",
          updatedAt: "2021-07-29T11:57:27.793Z",
        },
        {
          type: "publicLottery",
          startTime: "2021-08-08T11:57:18.209Z",
          endTime: "2021-08-08T11:57:18.209Z",
          url: "example2.com",
          note: "Custom public lottery event note",
          label: "Custom Event URL Label",
          file: null,
          id: "2287dfbd-5e17-4dd4-adac-be8536e289cf",
          createdAt: "2021-07-29T11:57:27.793Z",
          updatedAt: "2021-07-29T11:57:27.793Z",
        },
      ],
      image: null,
      leasingAgentAddress: {
        id: "2f696d9f-455d-4914-be6b-34c21903852b",
        createdAt: "2021-07-29T11:57:27.793Z",
        updatedAt: "2021-07-29T11:57:27.819Z",
        placeName: null,
        city: "San Francisco",
        county: null,
        state: "CA",
        street: "548 Market Street",
        street2: "Suite #59930",
        zipCode: "94104",
        latitude: 37.789673,
        longitude: -122.40151,
      },
      leasingAgents: [
        {
          id: "dbbf3cc0-a5f9-4b2b-a2de-8454f652e20e",
          confirmedAt: "2021-07-29T11:57:27.616Z",
          email: "leasing-agent-1@example.com",
          firstName: "First",
          middleName: "Middle",
          lastName: "Last",
          dob: "2021-07-29T11:57:18.209Z",
          createdAt: "2021-07-29T11:57:27.546Z",
          updatedAt: "2021-07-29T11:57:27.625Z",
          language: null,
        },
      ],
      jurisdiction: null,
      reservedCommunityType: null,
      result: null,
      reviewOrderType: "lottery",
      units: [],
      accessibility: "Custom accessibility text",
      amenities: "Custom property amenities text",
      buildingAddress: {
        id: "093da953-0934-4157-b11d-0c615ea57d43",
        createdAt: "2021-07-29T11:57:27.783Z",
        updatedAt: "2021-07-29T11:57:27.819Z",
        placeName: null,
        city: "San Francisco",
        county: null,
        state: "CA",
        street: "548 Market Street",
        street2: "Suite #59930",
        zipCode: "94104",
        latitude: 37.789673,
        longitude: -122.40151,
      },
      buildingTotalUnits: 100,
      developer: "Developer",
      householdSizeMax: null,
      householdSizeMin: null,
      neighborhood: "Custom neighborhood text",
      petPolicy: "Custom pet text",
      smokingPolicy: "Custom smoking text",
      unitsAvailable: 2,
      unitAmenities: "Custom unit amenities text",
      servicesOffered: "Custom services offered text",
      yearBuilt: 2021,
      unitsSummarized: {
        unitTypes: [
          {
            id: "aec3bfb1-e3c7-4aa7-a1e6-29a81a29a528",
            createdAt: "2021-07-29T11:57:11.088Z",
            updatedAt: "2021-07-29T11:57:11.088Z",
            name: "oneBdrm",
          },
          {
            id: "b36fe1f1-bb3f-4e1c-8222-5211eb4445b6",
            createdAt: "2021-07-29T11:57:11.088Z",
            updatedAt: "2021-07-29T11:57:11.088Z",
            name: "twoBdrm",
          },
        ],
        reservedTypes: [],
        priorityTypes: [
          {
            id: "944ff5be-61d7-4cc6-ba95-cd08553ae1ca",
            createdAt: "2021-07-29T11:57:11.088Z",
            updatedAt: "2021-07-29T11:57:11.088Z",
            name: "Mobility and hearing",
          },
        ],
        amiPercentages: ["30"],
        byUnitTypeAndRent: [
          {
            areaRange: {
              min: 635,
              max: 635,
            },
            minIncomeRange: {
              min: "$3,014",
              max: "$3,014",
            },
            occupancyRange: {
              min: 1,
              max: 3,
            },
            rentRange: {
              min: "$1,219",
              max: "$1,219",
            },
            rentAsPercentIncomeRange: {
              min: null,
              max: null,
            },
            floorRange: {
              min: 1,
              max: 1,
            },
            unitType: {
              id: "aec3bfb1-e3c7-4aa7-a1e6-29a81a29a528",
              createdAt: "2021-07-29T11:57:11.088Z",
              updatedAt: "2021-07-29T11:57:11.088Z",
              name: "oneBdrm",
            },
            totalAvailable: 1,
          },
          {
            areaRange: {
              min: 748,
              max: 748,
            },
            minIncomeRange: {
              min: "$3,468",
              max: "$3,468",
            },
            occupancyRange: {
              min: 2,
              max: 5,
            },
            rentRange: {
              min: "$1,387",
              max: "$1,387",
            },
            rentAsPercentIncomeRange: {
              min: null,
              max: null,
            },
            floorRange: {
              min: 2,
              max: 2,
            },
            unitType: {
              id: "b36fe1f1-bb3f-4e1c-8222-5211eb4445b6",
              createdAt: "2021-07-29T11:57:11.088Z",
              updatedAt: "2021-07-29T11:57:11.088Z",
              name: "twoBdrm",
            },
            totalAvailable: 1,
          },
        ],
        byNonReservedUnitType: [
          {
            areaRange: {
              min: 635,
              max: 635,
            },
            minIncomeRange: {
              min: "$3,014",
              max: "$3,014",
            },
            occupancyRange: {
              min: 1,
              max: 3,
            },
            rentRange: {
              min: "$1,219",
              max: "$1,219",
            },
            rentAsPercentIncomeRange: {
              min: null,
              max: null,
            },
            floorRange: {
              min: 1,
              max: 1,
            },
            unitType: {
              id: "aec3bfb1-e3c7-4aa7-a1e6-29a81a29a528",
              createdAt: "2021-07-29T11:57:11.088Z",
              updatedAt: "2021-07-29T11:57:11.088Z",
              name: "oneBdrm",
            },
            totalAvailable: 1,
          },
          {
            areaRange: {
              min: 748,
              max: 748,
            },
            minIncomeRange: {
              min: "$3,468",
              max: "$3,468",
            },
            occupancyRange: {
              min: 2,
              max: 5,
            },
            rentRange: {
              min: "$1,387",
              max: "$1,387",
            },
            rentAsPercentIncomeRange: {
              min: null,
              max: null,
            },
            floorRange: {
              min: 2,
              max: 2,
            },
            unitType: {
              id: "b36fe1f1-bb3f-4e1c-8222-5211eb4445b6",
              createdAt: "2021-07-29T11:57:11.088Z",
              updatedAt: "2021-07-29T11:57:11.088Z",
              name: "twoBdrm",
            },
            totalAvailable: 1,
          },
        ],
        byUnitType: [
          {
            areaRange: {
              min: 635,
              max: 635,
            },
            minIncomeRange: {
              min: "$3,014",
              max: "$3,014",
            },
            occupancyRange: {
              min: 1,
              max: 3,
            },
            rentRange: {
              min: "$1,219",
              max: "$1,219",
            },
            rentAsPercentIncomeRange: {
              min: null,
              max: null,
            },
            floorRange: {
              min: 1,
              max: 1,
            },
            unitType: {
              id: "aec3bfb1-e3c7-4aa7-a1e6-29a81a29a528",
              createdAt: "2021-07-29T11:57:11.088Z",
              updatedAt: "2021-07-29T11:57:11.088Z",
              name: "oneBdrm",
            },
            totalAvailable: 0,
          },
          {
            areaRange: {
              min: 748,
              max: 748,
            },
            minIncomeRange: {
              min: "$3,468",
              max: "$3,468",
            },
            occupancyRange: {
              min: 2,
              max: 5,
            },
            rentRange: {
              min: "$1,387",
              max: "$1,387",
            },
            rentAsPercentIncomeRange: {
              min: null,
              max: null,
            },
            floorRange: {
              min: 2,
              max: 2,
            },
            unitType: {
              id: "b36fe1f1-bb3f-4e1c-8222-5211eb4445b6",
              createdAt: "2021-07-29T11:57:11.088Z",
              updatedAt: "2021-07-29T11:57:11.088Z",
              name: "twoBdrm",
            },
            totalAvailable: 0,
          },
        ],
        byReservedType: [],
        byAMI: [
          {
            percent: "30",
            byNonReservedUnitType: [
              {
                areaRange: {
                  min: 635,
                  max: 635,
                },
                minIncomeRange: {
                  min: "$3,014",
                  max: "$3,014",
                },
                occupancyRange: {
                  min: 1,
                  max: 3,
                },
                rentRange: {
                  min: "$1,219",
                  max: "$1,219",
                },
                rentAsPercentIncomeRange: {
                  min: null,
                  max: null,
                },
                floorRange: {
                  min: 1,
                  max: 1,
                },
                unitType: {
                  id: "aec3bfb1-e3c7-4aa7-a1e6-29a81a29a528",
                  createdAt: "2021-07-29T11:57:11.088Z",
                  updatedAt: "2021-07-29T11:57:11.088Z",
                  name: "oneBdrm",
                },
                totalAvailable: 1,
              },
              {
                areaRange: {
                  min: 748,
                  max: 748,
                },
                minIncomeRange: {
                  min: "$3,468",
                  max: "$3,468",
                },
                occupancyRange: {
                  min: 2,
                  max: 5,
                },
                rentRange: {
                  min: "$1,387",
                  max: "$1,387",
                },
                rentAsPercentIncomeRange: {
                  min: null,
                  max: null,
                },
                floorRange: {
                  min: 2,
                  max: 2,
                },
                unitType: {
                  id: "b36fe1f1-bb3f-4e1c-8222-5211eb4445b6",
                  createdAt: "2021-07-29T11:57:11.088Z",
                  updatedAt: "2021-07-29T11:57:11.088Z",
                  name: "twoBdrm",
                },
                totalAvailable: 1,
              },
            ],
            byReservedType: [],
          },
        ],
        hmi: {
          columns: {
            householdSize: "listings.householdSize",
            maxIncomeMonth: "listings.maxIncomeMonth",
            maxIncomeYear: "listings.maxIncomeYear",
          },
          rows: [
            {
              householdSize: 1,
              maxIncomeMonth: "$2,398",
              maxIncomeYear: "$28,770",
            },
            {
              householdSize: 2,
              maxIncomeMonth: "$2,740",
              maxIncomeYear: "$32,880",
            },
            {
              householdSize: 3,
              maxIncomeMonth: "$3,083",
              maxIncomeYear: "$36,990",
            },
            {
              householdSize: 4,
              maxIncomeMonth: "$3,425",
              maxIncomeYear: "$41,100",
            },
            {
              householdSize: 5,
              maxIncomeMonth: "$3,700",
              maxIncomeYear: "$44,400",
            },
          ],
        },
      },
    },
  ]

  public async list(
    origin: string,
    jsonpath?: string,
    filter?: ListingFilterParams[]
  ): Promise<Listing[]> {
    return this.testListingResponse as any
    const qb = this.getQueryBuilder()
    if (filter) {
      addFilter<ListingFilterParams>(filter, "listings", qb)
    }

    qb.orderBy({
      "listings.id": "DESC",
      "units.max_occupancy": "ASC",
      "preferences.ordinal": "ASC",
    })

    let listings = await qb.getMany()

    /**
     * Get the application counts and map them to listings
     */
    if (origin === process.env.PARTNERS_BASE_URL) {
      const counts = await Listing.createQueryBuilder("listing")
        .select("listing.id")
        .loadRelationCountAndMap("listing.applicationCount", "listing.applications", "applications")
        .getMany()

      const countIndex = arrayIndex<Listing>(counts, "id")

      listings.forEach((listing: Listing) => {
        listing.applicationCount = countIndex[listing.id].applicationCount || 0
      })
    }

    if (jsonpath) {
      listings = jp.query(listings, jsonpath)
    }
    return listings
  }

  async create(listingDto: ListingCreateDto) {
    const listing = Listing.create({
      ...listingDto,
      property: plainToClass(PropertyCreateDto, listingDto),
    })
    return await listing.save()
  }

  async update(listingDto: ListingUpdateDto) {
    const qb = this.getQueryBuilder()
    qb.where("listings.id = :id", { id: listingDto.id })
    const listing = await qb.getOne()

    if (!listing) {
      throw new NotFoundException()
    }
    listingDto.units.forEach((unit) => {
      if (unit.id.length === 0 || unit.id === "undefined") {
        delete unit.id
      }
    })
    Object.assign(listing, {
      ...plainToClass(Listing, listingDto, { excludeExtraneousValues: true }),
      property: plainToClass(
        PropertyUpdateDto,
        {
          // NOTE: Create a property out of fields encapsulated in listingDto
          ...listingDto,
          // NOTE: Since we use the entire listingDto to create a property object the listing ID
          //  would overwrite propertyId fetched from DB
          id: listing.property.id,
        },
        { excludeExtraneousValues: true }
      ),
    })

    return await this.listingRepository.save(listing)
  }

  async delete(listingId: string) {
    const listing = await Listing.findOneOrFail({
      where: { id: listingId },
    })
    return await Listing.remove(listing)
  }

  async findOne(listingId: string) {
    const result = await this.getQueryBuilder()
      .where("listings.id = :id", { id: listingId })
      .orderBy({
        "preferences.ordinal": "ASC",
      })
      .getOne()
    if (!result) {
      throw new NotFoundException()
    }
    return result
  }
}
