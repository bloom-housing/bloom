import { Test, TestingModule } from "@nestjs/testing"
import { GeocodingService } from "./geocoding.service"
import { Address } from "../../shared/entities/address.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Application } from "../entities/application.entity"
import { ValidationMethod } from "../../multiselect-question/types/validation-method-enum"
import { Listing } from "../../listings/entities/listing.entity"
import { InputType } from "../../shared/types/input-type"

describe("GeocodingService", () => {
  let service: GeocodingService
  const applicationRepoUpdate = jest.fn()
  const mockApplicationRepo = {
    createQueryBuilder: jest.fn(),
    update: applicationRepoUpdate,
  }
  const date = new Date()
  const listingAddress: Address = {
    id: "id",
    createdAt: date,
    updatedAt: date,
    city: "Washington",
    county: null,
    state: "DC",
    street: "1600 Pennsylvania Avenue",
    street2: null,
    zipCode: "20500",
    latitude: 38.8977,
    longitude: -77.0365,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeocodingService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepo,
        },
      ],
    }).compile()

    service = await module.resolve(GeocodingService)
  })

  describe("verifyRadius", () => {
    it("should return 'unknown' if lat and long not there", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
            latitude: null,
            longitude: null,
          },
          5,
          listingAddress
        )
      ).toBe("unknown")
    })
    it("should return 'true' if within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
            latitude: 38.89485,
            longitude: -77.04251,
          },
          5,
          listingAddress
        )
      ).toBe("true")
    })
    it("should return 'false' if not within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
            latitude: 39.284205,
            longitude: -76.621698,
          },
          5,
          listingAddress
        )
      ).toBe("false")
    })
    it("should return 'true' if same lat long", () => {
      expect(
        service.verifyRadius(
          {
            ...listingAddress,
          },
          5,
          listingAddress
        )
      ).toBe("true")
    })
  })
  describe("validateRadiusPreferences", () => {
    const listing = {
      buildingAddress: listingAddress,
      listingMultiselectQuestions: [
        {
          multiselectQuestion: {
            options: [
              {
                text: "Geocoding option by radius",
                collectAddress: true,
                radiusSize: 5,
                validationMethod: ValidationMethod.radius,
              },
            ],
          },
        },
      ],
    }
    const preferenceAddress = { ...listingAddress, latitude: 38.89485, longitude: -77.04251 }
    const application = {
      id: "applicationId",
      preferences: [
        {
          key: "Geocoding preference",
          options: [
            {
              key: "Geocoding option by radius",
              checked: true,
              extraData: [
                {
                  type: InputType.address,
                  value: preferenceAddress,
                },
              ],
            },
          ],
        },
      ],
    }
    it("should save the validated value as extraData", async () => {
      await service.validateRadiusPreferences(
        application as unknown as Application,
        listing as Listing
      )
      expect(applicationRepoUpdate).toBeCalledWith(
        { id: "applicationId" },
        {
          preferences: expect.arrayContaining([
            expect.objectContaining({
              key: "Geocoding preference",
              options: [
                {
                  checked: true,
                  extraData: [
                    {
                      type: "address",
                      value: preferenceAddress,
                    },
                    { key: "geocodingVerified", type: "text", value: "true" },
                  ],
                  key: "Geocoding option by radius",
                },
              ],
            }),
          ]),
        }
      )
    })
  })
})
