import { Listing } from "../../entities/listing.entity"
import { CombinedListingTransformer } from "../combined-listing-transformer"
import { Jurisdiction } from "../../../jurisdictions/entities/jurisdiction.entity"
import { Address } from "../../../shared/entities/address.entity"
import { Unit } from "../../../units/entities/unit.entity"
import { UnitType } from "../../../unit-types/entities/unit-type.entity"
import { ListingFeatures } from "../../entities/listing-features.entity"
import { ListingUtilities } from "../../entities/listing-utilities.entity"
import { ListingMultiselectQuestion } from "../../../multiselect-question/entities/listing-multiselect-question.entity"
import { MultiselectQuestion } from "../../../multiselect-question/entities/multiselect-question.entity"
import { ReservedCommunityType } from "../../../reserved-community-type/entities/reserved-community-type.entity"
import { ListingImage } from "../../entities/listing-image.entity"
import { Asset } from "../../../assets/entities/asset.entity"

/**
 * This function compares a source object with a transformed object and
 * confirms that the transformed object is as expected given the input
 *
 * @param rawValue The value for the original property to test against
 * @param objValue The value for the property on the transformed object
 * @param cls The class type to expect
 * @param propList A list of properties to compare against or a map of raw=>obj prop names
 * @param expectFailClass Whether to expect the class to be different
 * @param expectFailValues A list of object property names that are expected to fail
 */
const testObjectTransformation = (
  rawValue: object,
  objValue: object,
  /* eslint-disable @typescript-eslint/ban-types */
  cls: Function, // needs to be Function to accept class as an input
  propList: Array<string> | Record<string, string>,
  // Note: would prefer test.failing instead of expectFail, but it's not available yet
  expectFailClass = false,
  expectFailValues: Array<string> = []
) => {
  ;(expectFailClass ? expect(objValue).not : expect(objValue)).toBeInstanceOf(cls)

  // go through each property and make sure they match the original
  if (Array.isArray(propList)) {
    propList.forEach((prop) => {
      ;(expectFailValues.includes(prop) ? expect(objValue[prop]).not : expect(objValue[prop])).toBe(
        rawValue[prop]
      )
    })
  } else {
    Object.entries(propList).forEach(([rawPropName, objPropName]) => {
      ;(expectFailValues.includes(objPropName)
        ? expect(objValue[objPropName]).not
        : expect(objValue[objPropName])
      ).toBe(rawValue[rawPropName])
    })
  }
}

// testception
describe("testObjectTransformation", () => {
  it("should match if type is expected and values are same", () => {
    const testId = "test-id"
    const testName = "test-name"

    class PassClass {
      id: string
      name: string
    }

    const raw = {
      id: testId,
      name: testName,
    }

    const obj = new PassClass()
    obj.id = testId
    obj.name = testName

    testObjectTransformation(raw, obj, PassClass, ["id", "name"])
  })

  it("should still match if prop names are mapped", () => {
    const testId = "test-id"
    const testName = "test-name"

    class PassClass {
      id: string
      name: string
    }

    const raw = {
      id: testId,
      raw_name: testName,
    }

    const obj = new PassClass()
    obj.id = testId
    obj.name = testName

    testObjectTransformation(raw, obj, PassClass, {
      id: "id",
      raw_name: "name",
    })
  })

  it("should fail if type is not a match", () => {
    const testId = "test-id"
    const testName = "test-name"

    class PassClass {
      id: string
      name: string
    }

    class FailClass {
      id: string
      name: string
    }

    const raw = {
      id: testId,
      name: testName,
    }

    const obj = new PassClass()
    obj.id = testId
    obj.name = testName

    // the boolean value in the 5th position tells it to expect the class to be different
    testObjectTransformation(raw, obj, FailClass, ["id", "name"], true)
  })

  it(`should fail if values don't match`, () => {
    const testId = "test-id"
    const testName = "test-name"

    class FailClass {
      id: string
      name: string
    }

    const raw = {
      id: testId,
      name: testName,
    }

    const obj = new FailClass()
    obj.id = "wrong-id"
    obj.name = testName

    // the array in the 6th position tells it to expect the props in that array to be wrong
    testObjectTransformation(raw, obj, FailClass, ["id", "name"], false, ["id"])
  })
})

// REMOVE_WHEN_EXTERNAL_NOT_NEEDED
describe("CombinedListingTransformer", () => {
  it("should fully convert a raw object to Listing", () => {
    const transformer = new CombinedListingTransformer()

    const raw = {
      id: "listing-id",
      assets: null,
      units_available: 1,
      application_due_date: "2023-04-02T19:56:53.308Z",
      application_open_date: "2023-04-02T19:56:53.308Z",
      name: "listing-name",
      waitlist_current_size: 3,
      waitlist_max_size: 4,
      status: "active",
      review_order_type: "firstComeFirstServe",
      published_at: "2023-04-02T19:56:53.308Z",
      closed_at: null,
      updated_at: "2023-04-02T19:56:53.308Z",
      url_slug: "raw-listing-url-slug",
      isExternal: true,
      jurisdiction: {
        id: "jurisdiction-id",
        name: "jurisdiction-name",
      },
      units: [
        {
          id: "77a0b48d-1094-46d5-a763-520ea2985100",
          monthlyIncomeMin: "4453",
          floor: 2,
          maxOccupancy: 7,
          minOccupancy: 4,
          monthlyRent: "1781",
          sqFeet: 1029,
          monthlyRentAsPercentOfIncome: null,
          unitType: {
            name: "threeBdrm",
            id: "663e5e66-3a80-4307-b8de-1a77ba8d13c9",
          },
        },
        {
          id: "a3d94060-cb61-4275-a524-14492f02bccd",
          monthlyIncomeMin: "4453",
          floor: 2,
          maxOccupancy: 7,
          minOccupancy: 4,
          monthlyRent: "1781",
          sqFeet: 1029,
          monthlyRentAsPercentOfIncome: null,
          unitType: {
            name: "threeBdrm",
            id: "663e5e66-3a80-4307-b8de-1a77ba8d13c9",
          },
        },
      ],
      images: [
        {
          ordinal: 0,
          image: {
            fileId: "housingbayarea/slide_pacificoaks3_w43tf2",
            label: "cloudinaryBuilding",
            id: "a6bf89c0-058c-424e-b378-a87d21ecfe8d",
          },
        },
      ],
      multiselect_questions: [
        {
          ordinal: 1,
          multiselectQuestion: {
            id: "80f562ee-3f3e-49c1-ae8b-ec0565b47a2a",
          },
        },
        {
          ordinal: 2,
          multiselectQuestion: {
            id: "aa7c4fd2-5069-4c56-9cfc-6c6e721cf7bc",
          },
        },
      ],
      reserved_community_type: {
        name: "senior62",
        id: "7c84c0e6-b9ac-48a8-b55c-daf20ddbfe67",
      },
      building_address: {
        city: "Sausalito",
        county: "Marin",
        state: "CA",
        street: "3 Rodeo Ave",
        street2: null,
        zipCode: "94965",
        latitude: 37.86863,
        longitude: -122.54015,
      },
      features: {
        elevator: false,
        wheelchairRamp: false,
        serviceAnimalsAllowed: false,
        accessibleParking: false,
        parkingOnSite: false,
        inUnitWasherDryer: false,
        laundryInBuilding: false,
        barrierFreeEntrance: false,
        rollInShower: false,
        grabBars: false,
        heatingInUnit: false,
        acInUnit: false,
      },
      utilities: {
        water: false,
        gas: false,
        trash: null,
        sewer: true,
        electricity: false,
        cable: null,
        phone: false,
        internet: null,
      },
      is_external: true,
    }

    const listing = transformer.transform(raw)

    // scalar listing values
    testObjectTransformation(raw, listing, Listing, {
      id: "id",
      assets: "assets",
      units_available: "unitsAvailable",
      application_due_date: "applicationDueDate",
      application_open_date: "applicationOpenDate",
      name: "name",
      waitlist_current_size: "waitlistCurrentSize",
      waitlist_max_size: "waitlistMaxSize",
      status: "status",
      review_order_type: "reviewOrderType",
      published_at: "publishedAt",
      closed_at: "closedAt",
      updated_at: "updatedAt",
      url_slug: "urlSlug",
      is_external: "isExternal",
    })

    // unitsSummarized is too complex to test deeply
    // let's just make sure that it exists even though it wasn't set in raw
    expect(listing.unitsSummarized).not.toBeNull()

    // jurisdiction
    testObjectTransformation(raw.jurisdiction, listing.jurisdiction, Jurisdiction, ["id", "name"])

    // building address
    testObjectTransformation(raw.building_address, listing.buildingAddress, Address, [
      "city",
      "county",
      "state",
      "street",
      "street2",
      "zipCode",
      "latitude",
      "longitude",
    ])

    // reserved community type
    testObjectTransformation(
      raw.reserved_community_type,
      listing.reservedCommunityType,
      ReservedCommunityType,
      ["id", "name"]
    )

    // units
    // verify that it's an array of expected length
    expect(Array.isArray(listing.units)).toBe(true)
    expect(listing.units.length).toBe(raw.units.length)

    listing.units.forEach((unit, idx) => {
      testObjectTransformation(raw.units[idx], unit, Unit, [
        "id",
        "monthlyIncomeMin",
        "floor",
        "maxOccupancy",
        "minOccupancy",
        "monthlyRent",
        "sqFeet",
        "monthlyRentAsPercentOfIncome",
      ])

      // unit type
      testObjectTransformation(raw.units[idx].unitType, unit.unitType, UnitType, ["id", "name"])
    })

    // multiselect questions
    expect(Array.isArray(listing.listingMultiselectQuestions)).toBe(true)
    expect(listing.listingMultiselectQuestions.length).toBe(raw.multiselect_questions.length)

    listing.listingMultiselectQuestions.forEach((question, idx) => {
      testObjectTransformation(
        raw.multiselect_questions[idx],
        question,
        ListingMultiselectQuestion,
        ["ordinal"]
      )

      testObjectTransformation(
        raw.multiselect_questions[idx].multiselectQuestion,
        question.multiselectQuestion,
        MultiselectQuestion,
        ["id"]
      )
    })

    // images
    expect(Array.isArray(listing.images)).toBe(true)
    expect(listing.images.length).toBe(raw.images.length)

    listing.images.forEach((image, idx) => {
      testObjectTransformation(raw.images[idx], image, ListingImage, ["ordinal"])

      // image.image
      testObjectTransformation(raw.images[idx].image, image.image, Asset, ["id", "fileId"])
    })

    // features
    testObjectTransformation(raw.features, listing.features, ListingFeatures, [
      "elevator",
      "wheelchairRamp",
      "serviceAnimalsAllowed",
      "accessibleParking",
      "parkingOnSite",
      "inUnitWasherDryer",
      "laundryInBuilding",
      "barrierFreeEntrance",
      "rollInShower",
      "grabBars",
      "heatingInUnit",
      "acInUnit",
    ])

    // utilities
    testObjectTransformation(raw.utilities, listing.utilities, ListingUtilities, [
      "water",
      "gas",
      "trash",
      "sewer",
      "electricity",
      "cable",
      "phone",
      "internet",
    ])
  })

  it("should gracefully handle an incomplete input", () => {
    const transformer = new CombinedListingTransformer()

    const raw = {
      id: "raw-id",
    }

    const listing = transformer.transform(raw)
    expect(listing.id).toBe(raw.id)
    expect(listing.name).toBeUndefined()
  })

  it("should transform all results", () => {
    const transformer = new CombinedListingTransformer()

    const ids = ["one", "two", "three"]

    const raw = ids.map((id) => {
      return {
        id: id,
        assets: null,
        units_available: 1,
        application_due_date: "2023-04-02T19:56:53.308Z",
        application_open_date: "2023-04-02T19:56:53.308Z",
        name: `name-${id}`,
        waitlist_current_size: 3,
        waitlist_max_size: 4,
        status: "active",
        review_order_type: "firstComeFirstServe",
        published_at: "2023-04-02T19:56:53.308Z",
        closed_at: null,
        updated_at: "2023-04-02T19:56:53.308Z",
        url_slug: "raw-listing-url-slug",
        isExternal: true,
        jurisdiction: null,
        units: null,
        images: null,
        multiselect_questions: null,
        reserved_community_type: null,
        building_address: null,
        features: null,
        utilities: null,
        is_external: true,
      }
    })

    const listings = transformer.transformAll(raw)

    expect(Array.isArray(listings)).toBe(true)
    expect(listings.length).toBe(raw.length)

    listings.forEach((listing) => {
      expect(ids).toContain(listing.id)
    })
  })
})
