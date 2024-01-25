import { Test, TestingModule } from "@nestjs/testing"
import { GeocodingService } from "./geocoding.service"
import { Address } from "../../shared/entities/address.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Application } from "../entities/application.entity"
import { ValidationMethod } from "../../multiselect-question/types/validation-method-enum"
import { Listing } from "../../listings/entities/listing.entity"
import { InputType } from "../../shared/types/input-type"
import { MapLayer } from "../../map-layers/entities/map-layer.entity"
import { FeatureCollection } from "@turf/helpers"

describe("GeocodingService", () => {
  let service: GeocodingService
  const applicationRepoUpdate = jest.fn()
  const mockApplicationRepo = {
    createQueryBuilder: jest.fn(),
    update: applicationRepoUpdate,
  }
  const date = new Date()
  const address: Address = {
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
  const featureCollection: FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          coordinates: [
            [
              [
                [-77.0392589333301, 38.79186072967565],
                [-76.90981025809415, 38.89293952026222],
                [-77.04122027689426, 38.996161202682146],
                [-77.12000091005532, 38.93465307055658],
                [-77.10561772391833, 38.91990351952725],
                [-77.09123453778136, 38.90565966392609],
                [-77.06802530560486, 38.9015894658674],
                [-77.06181438431805, 38.889377471720564],
                [-77.03697069917165, 38.870801038935525],
                [-77.03043288729134, 38.850437727576235],
                [-77.03435557441966, 38.80816525459605],
                [-77.0392589333301, 38.79186072967565],
              ],
            ],
          ],
          type: "Polygon",
        },
      },
    ],
  }
  const mockMapLayerRepo = {
    createQueryBuilder: jest.fn(),
    findBy: jest.fn().mockResolvedValue([
      {
        id: "mapLayerId",
        name: "map layer",
        jurisdictionId: "1",
        featureCollection: featureCollection,
      },
    ]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeocodingService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepo,
        },
        {
          provide: getRepositoryToken(MapLayer),
          useValue: mockMapLayerRepo,
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
            ...address,
            latitude: null,
            longitude: null,
          },
          5,
          address
        )
      ).toBe("unknown")
    })
    it("should return 'true' if within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
            latitude: 38.89485,
            longitude: -77.04251,
          },
          5,
          address
        )
      ).toBe("true")
    })
    it("should return 'false' if not within radius", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
            latitude: 39.284205,
            longitude: -76.621698,
          },
          5,
          address
        )
      ).toBe("false")
    })
    it("should return 'true' if same lat long", () => {
      expect(
        service.verifyRadius(
          {
            ...address,
          },
          5,
          address
        )
      ).toBe("true")
    })
  })
  describe("verifyLayers", () => {
    it("should return 'unknown' if no lat/long", () => {
      expect(
        service.verifyLayers(
          {
            ...address,
            latitude: null,
            longitude: null,
          },
          featureCollection
        )
      ).toBe("unknown")
    })
    it("should return 'true' if address is within layer", () => {
      expect(service.verifyLayers(address, featureCollection)).toBe("true")
    })
    it("should return 'false' if address is within layer", () => {
      expect(
        service.verifyLayers(
          { ...address, latitude: 39.284205, longitude: -76.621698 },
          featureCollection
        )
      ).toBe("false")
    })
  })
  describe("validateRadiusPreferences", () => {
    const listing = {
      buildingAddress: address,
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
    const preferenceAddress = { ...address, latitude: 38.89485, longitude: -77.04251 }
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
        (application as unknown) as Application,
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
  describe("validateGeoLayerPreferences", () => {
    const listing = {
      buildingAddress: address,
      listingMultiselectQuestions: [
        {
          multiselectQuestion: {
            options: [
              {
                text: "Geocoding option by map",
                collectAddress: true,
                mapLayerId: "mapLayerId",
                validationMethod: ValidationMethod.map,
              },
            ],
          },
        },
      ],
    }
    const preferenceAddress = { ...address, latitude: 38.89485, longitude: -77.04251 }
    const application = {
      id: "applicationId",
      preferences: [
        {
          key: "Geocoding preference",
          options: [
            {
              key: "Geocoding option by map",
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
    it("should save the validated value as extraData for map layer", async () => {
      await service.validateGeoLayerPreferences(
        (application as unknown) as Application,
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
                  key: "Geocoding option by map",
                },
              ],
            }),
          ]),
        }
      )
    })
  })
})
